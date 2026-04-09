(function() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const listEl = document.getElementById('blogList');
  const detailEl = document.getElementById('blogDetail');
  const tagsEl = document.getElementById('blogTags');
  const searchEl = document.getElementById('blogSearch');

  /** @type {{ posts: any[] }} */
  let data = { posts: [] };
  /** @type {Record<string,string>} */
  let imageMap = {};

  function cleanupPath(p) {
    let out = String(p || '');
    // strip leading domain if somehow remains
    out = out.replace(/^https?:\/\/[^\s]+\/(?:images\/)?/i, '');
    // normalize leading slashes and prefixes
    if (out.startsWith('/')) out = out.slice(1);
    out = out.replace(/^images\/+/, '');
    out = out.replace(/^blogs\/+/, '');
    while (out.includes('//')) out = out.replace('//', '/');
    return `images/blogs/${out}`;
  }

  function getLocalImagePath(filenameOrUrl) {
    const s = String(filenameOrUrl || '');
    if (!s) return '';
    if (/^https?:/i.test(s)) {
      const mapped = imageMap[s];
      if (mapped) return cleanupPath(mapped);
      return cleanupPath(s.split('/').pop());
    }
    if (s.startsWith('/images/') || s.startsWith('images/')) return cleanupPath(s);
    return cleanupPath(s);
  }

  function uniqueTags(posts) {
    const set = new Set();
    posts.forEach(p => (p.tags || []).forEach(t => set.add(t)));
    return Array.from(set).sort((a,b) => a.localeCompare(b));
  }

  function formatDate(iso) {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch { return ''; }
  }

  function buildCard(post) {
    const heroCandidate = post.primary_image?.filename || post.primary_image?.url || (post.image_filenames?.[0] || null);
    const heroSrc = heroCandidate ? getLocalImagePath(heroCandidate) : '';
    const tagHtml = (post.tags || []).slice(0, 4).map(t => `<button class=\"blog-tag\" data-tag=\"${t}\">${t}</button>`).join('');
    const imgHtml = heroSrc ? `<a class=\"read-more\" href=\"#\" data-slug=\"${post.slug}\"><img loading=\"lazy\" src=\"${heroSrc}\" alt=\"\"></a>` : '';
    const titleHtml = `<h3><a class=\"read-more\" href=\"#\" data-slug=\"${post.slug}\">${post.title}</a></h3>`;
    return `
      <article class=\"blog-card\">
        ${imgHtml}
        <div class=\"card-body\">
          ${titleHtml}
          <div class=\"meta\">${formatDate(post.date)} • ${post.author || ''}</div>
          <div class=\"tags\">${tagHtml}</div>
          <a class=\"btn btn-ghost read-more\" href=\"#\" data-slug=\"${post.slug}\">Read more</a>
        </div>
      </article>`;
  }

  function buildDetail(post) {
    const heroCandidate = post.primary_image?.filename || post.primary_image?.url || (post.image_filenames?.[0] || null);
    const heroSrc = heroCandidate ? getLocalImagePath(heroCandidate) : '';
    const tags = (post.tags || []).map(t => `<button class=\"blog-tag\" data-tag=\"${t}\">${t}</button>`).join('');
    let body = String(post.content || '');
    body = body.replace(/src=\"([^\"]+)\"/g, (m, url) => `src=\"${getLocalImagePath(url)}\"`);
    body = body.replace(/data-src=\"([^\"]+)\"/g, (m, url) => `src=\"${getLocalImagePath(url)}\"`);

    return `
      ${heroSrc ? `<img class=\"detail-hero\" src=\"${heroSrc}\" alt=\"\">` : ''}
      <h1>${post.title}</h1>
      <div class=\"meta\">${formatDate(post.date)} • ${post.author || ''}</div>
      <div class=\"detail-tags\">${tags}</div>
      <div class=\"detail-body\">${body}</div>
      <div style=\"margin-top:12px\"><a href=\"blog.html\" class=\"btn btn-ghost\">Back to list</a></div>`;
  }

  function renderList(filterTag, q) {
    detailEl.classList.add('hidden');
    listEl.innerHTML = '';
    let posts = data.posts || [];
    if (filterTag) posts = posts.filter(p => (p.tags || []).includes(filterTag));
    if (q) {
      const n = q.toLowerCase();
      posts = posts.filter(p => p.title.toLowerCase().includes(n) || (p.excerpt||'').toLowerCase().includes(n));
    }
    const cards = posts.map(buildCard).join('');
    listEl.innerHTML = cards || '<p class="calc-empty">No posts found.</p>';
  }

  function renderTags(activeTag) {
    const tags = uniqueTags(data.posts);
    const html = ['All'].concat(tags).map(t => `<button class=\"blog-tag${!activeTag && t==='All' ? ' active' : (activeTag===t?' active':'')}\" data-tag=\"${t==='All'?'':t}\">${t}</button>`).join('');
    tagsEl.innerHTML = html;
  }

  function attachEvents() {
    tagsEl.addEventListener('click', (e) => {
      const btn = /** @type {HTMLElement} */(e.target.closest('.blog-tag'));
      if (!btn) return;
      tagsEl.querySelectorAll('.blog-tag').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tag = btn.getAttribute('data-tag') || '';
      renderList(tag || '', searchEl.value);
    });

    listEl.addEventListener('click', (e) => {
      const a = /** @type {HTMLElement} */(e.target.closest('a.read-more'));
      const t = /** @type {HTMLElement} */(e.target.closest('.blog-tag'));
      if (t) {
        const tag = t.getAttribute('data-tag');
        if (tag) { renderTags(tag); renderList(tag, searchEl.value); }
        return;
      }
      if (!a) return;
      e.preventDefault();
      const slug = a.getAttribute('data-slug');
      const post = (data.posts || []).find(p => p.slug === slug);
      if (!post) return;
      detailEl.innerHTML = buildDetail(post);
      detailEl.classList.remove('hidden');
      window.scrollTo({ top: detailEl.offsetTop - 20, behavior: 'smooth' });
    });

    searchEl.addEventListener('input', () => {
      const activeBtn = tagsEl.querySelector('.blog-tag.active');
      const tag = activeBtn ? (activeBtn.getAttribute('data-tag') || '') : '';
      renderList(tag, searchEl.value);
    });
  }

  async function loadJson(path) {
    const res = await fetch(path, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed ${path}`);
    return await res.json();
  }

  function normalizeToLocalImages() {
    (data.posts || []).forEach((p) => {
      if (p.primary_image) {
        if (p.primary_image.filename && !p.primary_image.url) {
          p.primary_image.url = getLocalImagePath(p.primary_image.filename);
        } else if (p.primary_image.url) {
          p.primary_image.url = getLocalImagePath(p.primary_image.url);
        }
      }
      if (Array.isArray(p.images_used)) {
        p.images_used = p.images_used.map((img) => ({
          ...img,
          url: getLocalImagePath(img.url || img.filename || ''),
        }));
      }
    });
  }

  async function init() {
    try {
      [data, imageMap] = await Promise.all([
        loadJson('blog_posts.json'),
        loadJson('blog_images.json')
      ]);
    } catch (e) {
      console.error(e);
      listEl.innerHTML = '<p class="calc-empty">Unable to load blog posts.</p>';
      return;
    }
    normalizeToLocalImages();
    renderTags('');
    renderList('', '');
    attachEvents();
  }

  init();
})();
