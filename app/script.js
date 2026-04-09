(function() {
  const navToggle = document.getElementById('navToggle');
  const navList = document.getElementById('primaryNav');
  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const isOpen = navList.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Smooth scroll for anchor links
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (target instanceof Element && target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
      const id = target.getAttribute('href');
      if (id && id.length > 1) {
        const el = document.querySelector(id);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  });

  // Set current year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Reconstruct email to deter simple crawlers
  const emailLink = document.getElementById('emailLink');
  if (emailLink) {
    const user = emailLink.getAttribute('data-user') || '';
    const domain = emailLink.getAttribute('data-domain') || '';
    const sld = emailLink.getAttribute('data-sld') || '';
    const tld = emailLink.getAttribute('data-tld') || '';
    const addr = `${user}@${domain}.${sld}.${tld}`;
    emailLink.setAttribute('href', `mailto:${addr}`);
    emailLink.textContent = addr;
  }

  // Social links (updated handles)
  const fbLink = document.getElementById('fbLink');
  const igLink = document.getElementById('igLink');
  if (fbLink) fbLink.href = 'https://facebook.com/mygreenlife';
  if (igLink) igLink.href = 'https://instagram.com/mygreenlife01';

  // Ingredients Calculator
  const searchInput = document.getElementById('calcSearch');
  const resultsEl = document.getElementById('calcResults');
  const modeInputs = document.querySelectorAll('input[name="calcMode"]');
  const suggestEl = document.getElementById('calcSuggest');
  const categoriesEl = document.getElementById('calcCategories');
  const pickerEl = document.getElementById('calcPicker');

  let catalog = null;
  const ingredientById = new Map();
  const productById = new Map();

  function normalizeText(text) { return (text || '').toString().toLowerCase(); }
  function renderEmpty(message) { resultsEl.innerHTML = `<p class="calc-empty">${message}</p>`; }

  function renderProductToIngredients(product) {
    const ingIds = (catalog.indexes.byProduct[product.id] || []);
    if (ingIds.length === 0) { resultsEl.innerHTML = `<h3 class="calc-heading">${product.name}</h3><p class="calc-empty">No mapped ingredients.</p>`; return; }
    const items = ingIds.map((id) => ingredientById.get(id)).filter(Boolean);
    const list = items.map((ing) => {
      const aliases = (ing.aliases || []).slice(0, 2).join(', ');
      const aliasText = aliases ? ` <small>(${aliases})</small>` : '';
      const desc = ing.description ? `<span class="calc-desc">${ing.description}</span>` : '';
      return `<li><div class="calc-pill"><span><strong>${ing.name}</strong>${aliasText}</span></div>${desc}</li>`;
    }).join('');
    resultsEl.innerHTML = `<h3 class="calc-heading">${product.name} • Ingredients</h3><ul class="calc-list single">${list}</ul>`;
  }

  function renderIngredientToProducts(ingredient) {
    const prdIds = (catalog.indexes.byIngredient[ingredient.id] || []);
    if (prdIds.length === 0) { resultsEl.innerHTML = `<h3 class="calc-heading">${ingredient.name}</h3><p class="calc-empty">No mapped products.</p>`; return; }
    const items = prdIds.map((id) => productById.get(id)).filter(Boolean);
    const desc = ingredient.description ? `<span class="calc-desc">${ingredient.description}</span>` : '';
    const list = items.map((prd) => `<li><div class="calc-pill"><span class="badge">product</span><span>${prd.name}</span></div></li>`).join('');
    resultsEl.innerHTML = `<h3 class="calc-heading">${ingredient.name} • Products</h3>${desc}<ul class="calc-list single">${list}</ul>`;
  }

  function getMode() {
    const checked = Array.from(modeInputs).find((r) => r.checked);
    return checked ? checked.value : 'product';
  }

  function searchAndRender(query) {
    if (!catalog) return;
    const q = normalizeText(query);
    if (!q) { renderEmpty('Start typing to search or pick from the dropdown.'); hideSuggest(); return; }
    const mode = getMode();
    if (mode === 'product') {
      const hit = catalog.products.find((p) => normalizeText(p.name).includes(q) || normalizeText(p.slug).includes(q));
      if (hit) { renderProductToIngredients(hit); } else { renderEmpty('No matching product.'); }
    } else {
      const hit = catalog.ingredients.find((i) => normalizeText(i.name).includes(q) || normalizeText(i.slug).includes(q) || (i.aliases || []).some(a => normalizeText(a).includes(q)));
      if (hit) { renderIngredientToProducts(hit); } else { renderEmpty('No matching ingredient.'); }
    }
  }

  function showSuggest(items) {
    if (!suggestEl) return;
    if (!items || items.length === 0) { hideSuggest(); return; }
    const html = items.map((it) => `<div class="calc-suggest-item" role="option" data-id="${it.id}" data-kind="${it.kind}">${it.icon || ''}<span>${it.label}</span></div>`).join('');
    suggestEl.innerHTML = `<div class="label">Suggestions</div>${html}`;
    suggestEl.classList.remove('hidden');
  }
  function hideSuggest() { if (suggestEl) suggestEl.classList.add('hidden'); }

  function buildSuggestions(query) {
    const q = normalizeText(query);
    const mode = getMode();
    if (!q) return [];
    if (mode === 'product') {
      return catalog.products.filter((p) => normalizeText(p.name).includes(q) || normalizeText(p.slug).includes(q)).slice(0, 8).map((p) => ({ id: p.id, label: p.name, kind: 'product' }));
    }
    return catalog.ingredients.filter((i) => normalizeText(i.name).includes(q) || normalizeText(i.slug).includes(q) || (i.aliases || []).some(a => normalizeText(a).includes(q))).slice(0, 8).map((i) => ({ id: i.id, label: i.name, kind: 'ingredient' }));
  }

  function populateCategories() {
    if (!categoriesEl) return;
    const cats = Array.from(new Set((catalog.products || []).map(p => p.category))).sort();
    const chips = ['All'].concat(cats).map((c, idx) => `<button class="calc-chip${idx===0?' active':''}" data-cat="${c}">${c}</button>`).join('');
    categoriesEl.innerHTML = chips;
  }

  function populatePicker() {
    if (!pickerEl) return;
    const mode = getMode();
    const activeChip = categoriesEl ? categoriesEl.querySelector('.calc-chip.active') : null;
    const cat = activeChip ? activeChip.getAttribute('data-cat') : 'All';
    let optionsHtml = '<option value="">Pick from the list…</option>';
    if (mode === 'product') {
      const items = cat && cat !== 'All' ? catalog.products.filter(p => p.category === cat) : catalog.products;
      optionsHtml += items.map(p => `<option value="product:${p.id}">${p.name}</option>`).join('');
    } else {
      optionsHtml += catalog.ingredients.map(i => `<option value="ingredient:${i.id}">${i.name}</option>`).join('');
    }
    pickerEl.innerHTML = optionsHtml;
  }

  function selectItem(kind, id) {
    hideSuggest();
    if (kind === 'product') {
      const p = productById.get(id);
      if (p) { searchInput.value = p.name; renderProductToIngredients(p); }
    } else {
      const i = ingredientById.get(id);
      if (i) { searchInput.value = i.name; renderIngredientToProducts(i); }
    }
  }

  async function loadCatalog() {
    const isFile = location.protocol === 'file:';
    const inlineEl = document.getElementById('catalog-data');
    if (isFile && inlineEl) { try { return JSON.parse(inlineEl.textContent || '{}'); } catch { } }
    try {
      const res = await fetch('mgl_catalog.json', { cache: 'no-store' });
      if (!res.ok) throw new Error(`Failed to load: ${res.status}`);
      return await res.json();
    } catch (e) {
      if (inlineEl) { try { return JSON.parse(inlineEl.textContent || '{}'); } catch { } }
      throw e;
    }
  }

  async function initCatalog() {
    if (!searchInput || !resultsEl) return;
    try {
      const data = await loadCatalog();
      catalog = data;
      for (const ing of catalog.ingredients) ingredientById.set(ing.id, ing);
      for (const prd of catalog.products) productById.set(prd.id, prd);
      renderEmpty('Start typing to search or pick from the dropdown.');

      populateCategories();
      populatePicker();

      // Wire events
      searchInput.addEventListener('input', (e) => {
        const v = /** @type {HTMLInputElement} */ (e.target).value;
        const suggestions = buildSuggestions(v);
        if (suggestions.length > 0) showSuggest(suggestions); else hideSuggest();
        searchAndRender(v);
      });
      modeInputs.forEach((r) => r.addEventListener('change', () => {
        hideSuggest();
        populatePicker();
        searchAndRender(searchInput.value);
      }));
      pickerEl && pickerEl.addEventListener('change', (e) => {
        const val = /** @type {HTMLSelectElement} */ (e.target).value;
        if (!val) return;
        const [kind, id] = val.split(':');
        selectItem(kind, id);
      });
      categoriesEl && categoriesEl.addEventListener('click', (e) => {
        const btn = /** @type {HTMLElement} */(e.target.closest('.calc-chip'));
        if (!btn) return;
        categoriesEl.querySelectorAll('.calc-chip').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        populatePicker();
      });

      // Suggestion click
      if (suggestEl) {
        suggestEl.addEventListener('click', (e) => {
          const el = /** @type {HTMLElement} */(e.target.closest('.calc-suggest-item'));
          if (!el) return;
          const id = el.getAttribute('data-id');
          const kind = el.getAttribute('data-kind');
          if (id && kind) selectItem(kind, id);
        });
      }

      document.addEventListener('click', (e) => {
        if (!suggestEl) return;
        const within = suggestEl.contains(e.target) || (e.target === searchInput);
        if (!within) hideSuggest();
      });
    } catch (err) {
      console.error(err);
      resultsEl.innerHTML = `<p class="calc-empty">Unable to load the catalog right now.</p>`;
    }
  }

  initCatalog();
})();
