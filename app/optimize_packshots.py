#!/usr/bin/env python3
"""
Batch optimize packshot images for git-friendly sizes.

Default behavior:
- Recursively scans images/packshots
- Resizes images down to max dimension (no upscaling)
- Compresses JPEG/JPG with quality stepping
- Writes back in-place only when optimized output is smaller or resized

Examples:
  python3 optimize_packshots.py --dry-run
  python3 optimize_packshots.py --target-kb 450 --max-dim 1800
"""

from __future__ import annotations

import argparse
import os
import shutil
import subprocess
import sys
import tempfile
from dataclasses import dataclass
from pathlib import Path


SUPPORTED_EXTS = {".jpg", ".jpeg", ".png", ".webp"}


@dataclass
class ImageMeta:
    width: int
    height: int
    size_bytes: int


@dataclass
class OptimizationResult:
    path: Path
    changed: bool
    before_bytes: int
    after_bytes: int
    before_wh: tuple[int, int]
    after_wh: tuple[int, int]


def run_cmd(args: list[str]) -> subprocess.CompletedProcess[str]:
    return subprocess.run(args, check=False, capture_output=True, text=True)


def have_sips() -> bool:
    return shutil.which("sips") is not None


def get_image_meta(path: Path) -> ImageMeta:
    result = run_cmd(["sips", "-g", "pixelWidth", "-g", "pixelHeight", str(path)])
    if result.returncode != 0:
        raise RuntimeError(f"Failed to inspect image: {path}\n{result.stderr.strip()}")

    width = None
    height = None
    for line in result.stdout.splitlines():
        line = line.strip()
        if line.startswith("pixelWidth:"):
            width = int(line.split(":", 1)[1].strip())
        elif line.startswith("pixelHeight:"):
            height = int(line.split(":", 1)[1].strip())

    if width is None or height is None:
        raise RuntimeError(f"Unable to parse dimensions for: {path}")

    return ImageMeta(width=width, height=height, size_bytes=path.stat().st_size)


def optimize_one(
    image_path: Path,
    max_dim: int,
    target_bytes: int,
    start_quality: int,
    min_quality: int,
    quality_step: int,
    dry_run: bool,
) -> OptimizationResult:
    before = get_image_meta(image_path)
    ext = image_path.suffix.lower()

    with tempfile.TemporaryDirectory(prefix="mgl-opt-") as tmpdir:
        tmpdir_path = Path(tmpdir)
        resized_path = tmpdir_path / f"resized{ext}"

        needs_resize = max(before.width, before.height) > max_dim
        if needs_resize:
            resize_result = run_cmd(
                ["sips", "--resampleHeightWidthMax", str(max_dim), str(image_path), "--out", str(resized_path)]
            )
            if resize_result.returncode != 0:
                raise RuntimeError(f"Resize failed for {image_path}\n{resize_result.stderr.strip()}")
        else:
            shutil.copy2(image_path, resized_path)

        best_path = resized_path

        # For JPEG/WEBP, progressively lower quality until under target.
        if ext in {".jpg", ".jpeg", ".webp"}:
            candidate_paths: list[Path] = []
            q = start_quality
            while q >= min_quality:
                candidate = tmpdir_path / f"q{q}{ext}"
                quality_result = run_cmd(
                    [
                        "sips",
                        "--setProperty",
                        "formatOptions",
                        str(q),
                        str(resized_path),
                        "--out",
                        str(candidate),
                    ]
                )
                if quality_result.returncode == 0 and candidate.exists():
                    candidate_paths.append(candidate)
                    if candidate.stat().st_size <= target_bytes:
                        best_path = candidate
                        break
                q -= quality_step

            if candidate_paths and best_path == resized_path:
                # If none hit target, use smallest candidate produced.
                best_path = min(candidate_paths, key=lambda p: p.stat().st_size)
        else:
            # PNG: resize only (optionally apply sharing optimization).
            optimized_png = tmpdir_path / f"optimized{ext}"
            optimize_result = run_cmd(
                ["sips", "--optimizeColorForSharing", str(resized_path), "--out", str(optimized_png)]
            )
            if optimize_result.returncode == 0 and optimized_png.exists():
                best_path = optimized_png

        after = get_image_meta(best_path)

        changed = (after.size_bytes < before.size_bytes) or needs_resize
        if changed and not dry_run:
            # Replace atomically enough for local batch usage.
            shutil.copy2(best_path, image_path)
            after = get_image_meta(image_path)

    return OptimizationResult(
        path=image_path,
        changed=changed,
        before_bytes=before.size_bytes,
        after_bytes=after.size_bytes if changed else before.size_bytes,
        before_wh=(before.width, before.height),
        after_wh=(after.width, after.height) if changed else (before.width, before.height),
    )


def iter_images(root: Path) -> list[Path]:
    files: list[Path] = []
    for path in root.rglob("*"):
        if not path.is_file():
            continue
        if path.suffix.lower() in SUPPORTED_EXTS:
            files.append(path)
    files.sort()
    return files


def bytes_to_kb(value: int) -> float:
    return value / 1024.0


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Optimize packshot image sizes in-place.")
    parser.add_argument(
        "--root",
        default="images/packshots",
        help="Root directory to scan (default: images/packshots)",
    )
    parser.add_argument(
        "--max-dim",
        type=int,
        default=1800,
        help="Maximum image width/height in pixels (default: 1800)",
    )
    parser.add_argument(
        "--target-kb",
        type=int,
        default=450,
        help="Target size in KB per image for JPEG/WEBP attempts (default: 450)",
    )
    parser.add_argument(
        "--start-quality",
        type=int,
        default=88,
        help="Initial quality for JPEG/WEBP compression, 1-100 (default: 88)",
    )
    parser.add_argument(
        "--min-quality",
        type=int,
        default=68,
        help="Minimum quality for JPEG/WEBP compression, 1-100 (default: 68)",
    )
    parser.add_argument(
        "--quality-step",
        type=int,
        default=4,
        help="Quality decrement step when searching size target (default: 4)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print what would change, do not write files",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    if not have_sips():
        print("Error: 'sips' is required (macOS tool) but was not found.", file=sys.stderr)
        return 1

    root = Path(args.root).resolve()
    if not root.exists() or not root.is_dir():
        print(f"Error: root directory not found: {root}", file=sys.stderr)
        return 1

    target_bytes = args.target_kb * 1024
    images = iter_images(root)
    if not images:
        print(f"No supported images found in: {root}")
        return 0

    print(f"Scanning {len(images)} images under: {root}")
    if args.dry_run:
        print("Dry run mode: no files will be written.")

    total_before = 0
    total_after = 0
    changed_count = 0

    for image in images:
        try:
            result = optimize_one(
                image_path=image,
                max_dim=args.max_dim,
                target_bytes=target_bytes,
                start_quality=args.start_quality,
                min_quality=args.min_quality,
                quality_step=args.quality_step,
                dry_run=args.dry_run,
            )
        except Exception as exc:  # noqa: BLE001 - batch should continue on individual failures.
            print(f"[ERROR] {image}: {exc}")
            continue

        total_before += result.before_bytes
        total_after += result.after_bytes

        if result.changed:
            changed_count += 1
            delta = result.before_bytes - result.after_bytes
            pct = (delta / result.before_bytes * 100.0) if result.before_bytes else 0.0
            print(
                f"[OPT] {image} | "
                f"{result.before_wh[0]}x{result.before_wh[1]} -> {result.after_wh[0]}x{result.after_wh[1]} | "
                f"{bytes_to_kb(result.before_bytes):.1f}KB -> {bytes_to_kb(result.after_bytes):.1f}KB "
                f"({pct:.1f}% smaller)"
            )

    saved = total_before - total_after
    saved_pct = (saved / total_before * 100.0) if total_before else 0.0
    print("\nDone.")
    print(f"Changed files: {changed_count}/{len(images)}")
    print(
        f"Total size: {bytes_to_kb(total_before):.1f}KB -> {bytes_to_kb(total_after):.1f}KB "
        f"(saved {bytes_to_kb(saved):.1f}KB, {saved_pct:.1f}%)"
    )

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
