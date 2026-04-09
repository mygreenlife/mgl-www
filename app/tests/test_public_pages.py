import os
import threading
import unittest
from contextlib import contextmanager
from html.parser import HTMLParser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.request import urlopen


ROOT = Path(__file__).resolve().parents[1]


class FooterLinkParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_footer = False
        self.current_href = None
        self.links = []

    def handle_starttag(self, tag, attrs):
        attr_map = dict(attrs)
        if tag == "footer":
            footer_class = attr_map.get("class", "")
            if "site-footer" in footer_class:
                self.in_footer = True
        if self.in_footer and tag == "a":
            self.current_href = attr_map.get("href")

    def handle_data(self, data):
        if self.in_footer and self.current_href:
            text = data.strip()
            if text:
                self.links.append((self.current_href, text))

    def handle_endtag(self, tag):
        if tag == "a":
            self.current_href = None
        if tag == "footer":
            self.in_footer = False


@contextmanager
def static_server(root_dir: Path):
    previous_cwd = Path.cwd()
    os.chdir(root_dir)
    try:
        server = ThreadingHTTPServer(("127.0.0.1", 0), SimpleHTTPRequestHandler)
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        try:
            yield server.server_address[1]
        finally:
            server.shutdown()
            thread.join(timeout=5)
            server.server_close()
    finally:
        os.chdir(previous_cwd)


class PublicTermsPageTests(unittest.TestCase):
    def test_terms_page_is_publicly_served(self):
        with static_server(ROOT) as port:
            with urlopen(f"http://127.0.0.1:{port}/terms.html") as response:
                body = response.read().decode("utf-8")
                self.assertEqual(response.status, 200)
                self.assertIn("My Green Life - Terms and Conditions", body)

    def test_footer_contains_terms_link_on_public_pages(self):
        public_pages_with_footer = ("index.html", "blog.html", "terms.html")
        for page in public_pages_with_footer:
            with self.subTest(page=page):
                content = (ROOT / page).read_text(encoding="utf-8")
                parser = FooterLinkParser()
                parser.feed(content)
                self.assertIn(("terms.html", "Terms and Conditions"), parser.links)


if __name__ == "__main__":
    unittest.main()
