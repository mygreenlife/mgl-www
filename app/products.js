(function() {
  const PACKSHOT_PATHS = [
    'images/packshots/01 - Full Range/PB250001.JPG',
    'images/packshots/01 - Full Range/PB250003.JPG',
    'images/packshots/Automotive/Car Wash and Wax/CWW100GBT-1.JPG',
    'images/packshots/Automotive/Car Wash and Wax/CWW100GBT-2.JPG',
    'images/packshots/Automotive/Car Wash and Wax/CWW200GBT-2.JPG',
    'images/packshots/Automotive/Car Wash and Wax/CWW500GBT.JPG',
    'images/packshots/Automotive/Car Wash and Wax/CWWGROUP3.JPG',
    'images/packshots/Automotive/Rim & Tyre Cleaner/RTC100GST.JPG',
    'images/packshots/Automotive/Rim & Tyre Cleaner/RTC200GST.JPG',
    'images/packshots/Automotive/Rim & Tyre Cleaner/RTC500GBT.JPG',
    'images/packshots/Automotive/Rim & Tyre Cleaner/RTCGROUP3.JPG',
    'images/packshots/Automotive/Window Wiper Washer Fluid/WWWF100GFFBT.JPG',
    'images/packshots/Automotive/Window Wiper Washer Fluid/WWWF200GFFBT.JPG',
    'images/packshots/Automotive/Window Wiper Washer Fluid/WWWF500GFFBT.JPG',
    'images/packshots/Automotive/Window Wiper Washer Fluid/WWWFGROUP2.JPG',
    'images/packshots/Automotive/Window Wiper Washer Fluid/WWWFGROUP3.JPG',
    'images/packshots/Cleaning/01 - Group product shots/PB250004.JPG',
    'images/packshots/Cleaning/01 - Group product shots/PB250005.JPG',
    'images/packshots/Cleaning/01 - Group product shots/PB250012.JPG',
    'images/packshots/Cleaning/Air Freshner/AFGROUP3DR.JPG',
    'images/packshots/Cleaning/Air Freshner/AFGROUP3MA.JPG',
    'images/packshots/Cleaning/Air Freshner/AFGROUP6.JPG',
    'images/packshots/Cleaning/Air Freshner/Desert Rose/AF100GDRST.JPG',
    'images/packshots/Cleaning/Air Freshner/Desert Rose/AF200GDRST.JPG',
    'images/packshots/Cleaning/Air Freshner/Desert Rose/AF500GDRST.JPG',
    'images/packshots/Cleaning/Air Freshner/Marine/AF100GMAST.JPG',
    'images/packshots/Cleaning/Air Freshner/Marine/AF200GMAST.JPG',
    'images/packshots/Cleaning/Air Freshner/Marine/AF500GMAST.JPG',
    'images/packshots/Cleaning/All purpose cleaner/APC1000PFF-2.JPG',
    'images/packshots/Cleaning/All purpose cleaner/APC2000PFF.JPG',
    'images/packshots/Cleaning/All purpose cleaner/APC200GFFST.JPG',
    'images/packshots/Cleaning/All purpose cleaner/APC500GFFTT.JPG',
    'images/packshots/Cleaning/All purpose cleaner/APCGROUP6.JPG',
    'images/packshots/Cleaning/Bathroom Toilet Cleaner/Eucalyptus/BATC1000PEBT.JPG',
    'images/packshots/Cleaning/Bathroom Toilet Cleaner/Eucalyptus/BATC2000PFF.JPG',
    'images/packshots/Cleaning/Bathroom Toilet Cleaner/Eucalyptus/BATC200GFFST.JPG',
    'images/packshots/Cleaning/Bathroom Toilet Cleaner/Eucalyptus/BATC500GEST.JPG',
    'images/packshots/Cleaning/Bathroom Toilet Cleaner/Eucalyptus/BATCGROUP2i.JPG',
    'images/packshots/Cleaning/Bathroom Toilet Cleaner/Eucalyptus/BATCGROUP6-1.JPG',
    'images/packshots/Cleaning/Bathroom Toilet Cleaner/Eucalyptus/BATGROUP6-2.JPG',
    'images/packshots/Cleaning/Dishwasher Powder/DWP10000PFF.JPG',
    'images/packshots/Cleaning/Dishwasher Powder/DWP1000GFF.JPG',
    'images/packshots/Cleaning/Dishwasher Powder/DWP2000PFF.JPG',
    'images/packshots/Cleaning/Dishwasher Powder/DWP500GFF.JPG',
    'images/packshots/Cleaning/Dishwasher Powder/PB210011.JPG',
    'images/packshots/Cleaning/Dishwasher Powder/PB210012.JPG',
    'images/packshots/Cleaning/Dishwasher Powder/PB210013.JPG',
    'images/packshots/Cleaning/Dishwasher Powder/PB210014.JPG',
    'images/packshots/Cleaning/Dishwasher Powder/PB210015.JPG',
    'images/packshots/Cleaning/Dishwasher Powder/PB210016.JPG',
    'images/packshots/Cleaning/Dishwasher Powder/PB210017.JPG',
    'images/packshots/Cleaning/Dishwashing Liquid/Fresh Citrus/DWL1000PCT-1.JPG',
    'images/packshots/Cleaning/Dishwashing Liquid/Fresh Citrus/DWL1000PCT-2.JPG',
    'images/packshots/Cleaning/Dishwashing Liquid/Fresh Citrus/DWL2000PCT.JPG',
    'images/packshots/Cleaning/Dishwashing Liquid/Fresh Citrus/DWL200GCTPT.JPG',
    'images/packshots/Cleaning/Dishwashing Liquid/Fresh Citrus/DWL500GCTPT.JPG',
    'images/packshots/Cleaning/Dishwashing Liquid/Fresh Citrus/DWLGRTOUP6.JPG',
    'images/packshots/Cleaning/Drain Cleaner & Grey Water Treatment/DRC1000PFFBT-1.JPG',
    'images/packshots/Cleaning/Drain Cleaner & Grey Water Treatment/DRC1000PFFBT-2.JPG',
    'images/packshots/Cleaning/Drain Cleaner & Grey Water Treatment/DRC2000PFF.JPG',
    'images/packshots/Cleaning/Drain Cleaner & Grey Water Treatment/DRC200GFFBT.JPG',
    'images/packshots/Cleaning/Drain Cleaner & Grey Water Treatment/DRC500GFFTT.JPG',
    'images/packshots/Cleaning/Drain Cleaner & Grey Water Treatment/DRCGROUP6.JPG',
    'images/packshots/Cleaning/Leather and Furniture Polish/LFP250PFF.JPG',
    'images/packshots/Cleaning/Multipurpose Sanitiser/MPS1000PFF.JPG',
    'images/packshots/Cleaning/Multipurpose Sanitiser/MPS100GFFST.JPG',
    'images/packshots/Cleaning/Multipurpose Sanitiser/MPS2000PFF.JPG',
    'images/packshots/Cleaning/Multipurpose Sanitiser/MPS200GFFST.JPG',
    'images/packshots/Cleaning/Multipurpose Sanitiser/MPS500GFFTT.JPG',
    'images/packshots/Cleaning/Multipurpose Sanitiser/MPS50GFFST.JPG',
    'images/packshots/Cleaning/Multipurpose Sanitiser/MPSGROUP8.JPG',
    'images/packshots/Cleaning/Oven Cleaner : Degreaser/OVC1000PFFBT.JPG',
    'images/packshots/Cleaning/Oven Cleaner : Degreaser/OVC2000PFF.JPG',
    'images/packshots/Cleaning/Oven Cleaner : Degreaser/OVC200GFFST.JPG',
    'images/packshots/Cleaning/Oven Cleaner : Degreaser/OVC500GFFTT.JPG',
    'images/packshots/Cleaning/Oven Cleaner : Degreaser/OVCGROUP6.JPG',
    'images/packshots/Cleaning/Tile and Floor Cleaner/TFC1000PCHBT.JPG',
    'images/packshots/Cleaning/Tile and Floor Cleaner/TFC2000CHBT.JPG',
    'images/packshots/Cleaning/Tile and Floor Cleaner/TFC200GCHBT.JPG',
    'images/packshots/Cleaning/Tile and Floor Cleaner/TFC500GCHTT.JPG',
    'images/packshots/Cleaning/Tile and Floor Cleaner/TFCGROUP4.JPG',
    'images/packshots/Cleaning/Tile and Floor Cleaner/TFCGROUP6.JPG',
    'images/packshots/Cleaning/Window Cleaner/WC1000PFF.JPG',
    'images/packshots/Cleaning/Window Cleaner/WC2000PFF.JPG',
    'images/packshots/Cleaning/Window Cleaner/WC200GFFBT.JPG',
    'images/packshots/Cleaning/Window Cleaner/WC500GFFTT.JPG',
    'images/packshots/Cleaning/Window Cleaner/WC500PFFBT.JPG',
    'images/packshots/Cleaning/Window Cleaner/WCGROUP2.JPG',
    'images/packshots/Cleaning/Window Cleaner/WCGROUP6.JPG',
    'images/packshots/Laundry/01 - Grourp product shot/Laundry - Glass/PB250022.JPG',
    'images/packshots/Laundry/01 - Grourp product shot/Laundry - Glass/PB250023.JPG',
    'images/packshots/Laundry/01 - Grourp product shot/Laundry - Glass/PB250024.JPG',
    'images/packshots/Laundry/01 - Grourp product shot/Laundry - Mixed/PB250026.JPG',
    'images/packshots/Laundry/Fabric Softner/Lavender/FS1000PLABT.JPG',
    'images/packshots/Laundry/Fabric Softner/Lavender/FS2000PLABT.JPG',
    'images/packshots/Laundry/Fabric Softner/Lavender/FS500GLABT.JPG',
    'images/packshots/Laundry/Fabric Softner/Lavender/FSGROUP5.JPG',
    'images/packshots/Laundry/Fabric Softner/Lavender/LL25000PFFBT.JPG',
    'images/packshots/Laundry/Laundry Liquid/Natural/GROUP5.JPG',
    'images/packshots/Laundry/Laundry Liquid/Natural/LL1000PFFBT.JPG',
    'images/packshots/Laundry/Laundry Liquid/Natural/LL2000PFFBT.JPG',
    'images/packshots/Laundry/Laundry Liquid/Natural/LL25000PFFBT.JPG',
    'images/packshots/Laundry/Laundry Liquid/Natural/LL5000PFFBT.JPG',
    'images/packshots/Laundry/Laundry Liquid/Natural/LL500GN.JPG',
    'images/packshots/Laundry/O2 Bleach Powder/O2BP1000.JPG',
    'images/packshots/Laundry/O2 Bleach Powder/O2BP500.JPG',
    'images/packshots/Laundry/O2 Bleach Powder/O2BPGENERAL.JPG',
    'images/packshots/Laundry/O2 Bleach Powder/O2BPGROUP5-1.JPG',
    'images/packshots/Laundry/O2 Bleach Powder/O2BPGROUP5-2.JPG',
    'images/packshots/Laundry/O2 Bleach Powder/PB210007.JPG',
    'images/packshots/Laundry/O2 Bleach Powder/PB210008.JPG',
    'images/packshots/Laundry/O2 Bleach Powder/PB210009.JPG',
    'images/packshots/Laundry/O2 Bleach Powder/PB210010.JPG',
    'images/packshots/Laundry/O2 Washing Powder/O2WP1000GFF.JPG',
    'images/packshots/Laundry/O2 Washing Powder/O2WP1000PFF.JPG',
    'images/packshots/Laundry/O2 Washing Powder/O2WP2000PFF.JPG',
    'images/packshots/Laundry/O2 Washing Powder/O2WP25000PBN.jpg',
    'images/packshots/Laundry/O2 Washing Powder/O2WP5000PFF.JPG',
    'images/packshots/Laundry/O2 Washing Powder/O2WP500GFF.JPG',
    'images/packshots/Laundry/O2 Washing Powder/O2WPGROUP2.JPG',
    'images/packshots/Laundry/O2 Washing Powder/O2WPGROUP5.JPG',
    'images/packshots/Laundry/O2 Washing Powder/PB210001.JPG',
    'images/packshots/Laundry/Stain Remover/STR100GFFST.JPG',
    'images/packshots/Laundry/Stain Remover/STR200GFFST.JPG',
    'images/packshots/Laundry/Stain Remover/STR500GFFST.JPG',
    'images/packshots/Laundry/Stain Remover/STRGROUP3.JPG',
    'images/packshots/Personal Care/Argan Oil/AO1000PFFBL.JPG',
    'images/packshots/Personal Care/Argan Oil/AO100GFFPT.JPG',
    'images/packshots/Personal Care/Argan Oil/AO200GFFPT.JPG',
    'images/packshots/Personal Care/Argan Oil/AO500GFFPT.JPG',
    'images/packshots/Personal Care/Argan Oil/AOGROUP3.JPG',
    'images/packshots/Personal Care/Body Lotion/BL1000PFFBT.JPG',
    'images/packshots/Personal Care/Body Lotion/BL100GFFPT.JPG',
    'images/packshots/Personal Care/Body Lotion/BL2000PFFBL.JPG',
    'images/packshots/Personal Care/Body Lotion/BL200GFFPT.JPG',
    'images/packshots/Personal Care/Body Lotion/BL500GFFPT.JPG',
    'images/packshots/Personal Care/Body Lotion/BLGROUP5-1.JPG',
    'images/packshots/Personal Care/Body Lotion/BLGROUP5-2.JPG',
    'images/packshots/Personal Care/Conditioner/NC1000PFFPT.JPG',
    'images/packshots/Personal Care/Conditioner/NC100GFFPT.JPG',
    'images/packshots/Personal Care/Conditioner/NC200GFFPT.JPG',
    'images/packshots/Personal Care/Conditioner/NC500GFFPT.JPG',
    'images/packshots/Personal Care/Conditioner/NCGRUOP4.JPG',
    'images/packshots/Personal Care/Conditioner/NCP2000FFPT.JPG',
    'images/packshots/Personal Care/Hair and Body Wash/HBW1000.JPG',
    'images/packshots/Personal Care/Hair and Body Wash/HBW100GST 2.JPG',
    'images/packshots/Personal Care/Hair and Body Wash/HBW100GST.JPG',
    'images/packshots/Personal Care/Hair and Body Wash/HBW2000.JPG',
    'images/packshots/Personal Care/Hair and Body Wash/HBW200GST 2.JPG',
    'images/packshots/Personal Care/Hair and Body Wash/HBW200GST.JPG',
    'images/packshots/Personal Care/Hair and Body Wash/HBW500GST.JPG',
    'images/packshots/Personal Care/Hair and Body Wash/HBWGROUP5.JPG',
    'images/packshots/Personal Care/Hand Lotion/HL1000PFFBT.JPG',
    'images/packshots/Personal Care/Hand Lotion/HL100GFFPT.JPG',
    'images/packshots/Personal Care/Hand Lotion/HL2000PFFTT.JPG',
    'images/packshots/Personal Care/Hand Lotion/HL200GFFPT.JPG',
    'images/packshots/Personal Care/Hand Lotion/HL500GFFPT.JPG',
    'images/packshots/Personal Care/Hand Lotion/HLGROUP5.JPG',
    'images/packshots/Personal Care/Hand Wash/HW1000P.JPG',
    'images/packshots/Personal Care/Hand Wash/HW100G.JPG',
    'images/packshots/Personal Care/Hand Wash/HW2000P.JPG',
    'images/packshots/Personal Care/Hand Wash/HW200G.JPG',
    'images/packshots/Personal Care/Hand Wash/HW5000P.JPG',
    'images/packshots/Personal Care/Hand Wash/HW500G.JPG',
    'images/packshots/Personal Care/Hand Wash/HWGROUP6.JPG',
    'images/packshots/Personal Care/Natual Bubble Bath/BB1000PFFBT-2.JPG',
    'images/packshots/Personal Care/Natual Bubble Bath/BB1000PFFBT.JPG',
    'images/packshots/Personal Care/Natual Bubble Bath/BB100GFFST-2.JPG',
    'images/packshots/Personal Care/Natual Bubble Bath/BB100GFFST.JPG',
    'images/packshots/Personal Care/Natual Bubble Bath/BB2000PFFBT-2.JPG',
    'images/packshots/Personal Care/Natual Bubble Bath/BB2000PFFBT.JPG',
    'images/packshots/Personal Care/Natual Bubble Bath/BB200GFFST-2.JPG',
    'images/packshots/Personal Care/Natual Bubble Bath/BB200GFFST.JPG',
    'images/packshots/Personal Care/Natual Bubble Bath/BB500GFFST-3.JPG',
    'images/packshots/Personal Care/Natual Bubble Bath/BB500GFFST.JPG',
    'images/packshots/Personal Care/Natual Bubble Bath/BBGROUP5.JPG',
    'images/packshots/Personal Care/Natural Shampoo/NSH1000.JPG',
    'images/packshots/Personal Care/Natural Shampoo/NSH2000.JPG',
    'images/packshots/Personal Care/Natural Shampoo/NSH200GST.JPG',
    'images/packshots/Personal Care/Natural Shampoo/NSH500GST.JPG',
    'images/packshots/Personal Care/Natural Shampoo/NSHGROUP5.JPG',
    'images/packshots/Personal Care/Natural Shampoo/PC010002.JPG',
    'images/packshots/Personal Care/Natural Shampoo/SH100GST.JPG',
    'images/packshots/Personal Care/Natural Shower Gel/NSG1000PBT.JPG',
    'images/packshots/Personal Care/Natural Shower Gel/NSG100GST.JPG',
    'images/packshots/Personal Care/Natural Shower Gel/NSG2000PBT.JPG',
    'images/packshots/Personal Care/Natural Shower Gel/NSG200GST.JPG',
    'images/packshots/Personal Care/Natural Shower Gel/NSG500GST.JPG',
    'images/packshots/Personal Care/Natural Shower Gel/SGGROUP5.JPG',
    'images/packshots/Personal Care/Shower Oil/PC010001.JPG',
    'images/packshots/Personal Care/Shower Oil/PC010002.JPG',
    'images/packshots/Personal Care/Shower Oil/PC010003.JPG',
    'images/packshots/Personal Care/Shower Oil/PC010004.JPG'
  ];

  const NAME_FIXES = {
    '01 - Full Range': 'Full Range',
    '01 - Group product shots': 'Group Product Shots',
    '01 - Grourp product shot': 'Group Product Shots',
    'Air Freshner': 'Air Freshener',
    'All purpose cleaner': 'All Purpose Cleaner',
    'Fabric Softner': 'Fabric Softener',
    'Natual Bubble Bath': 'Natural Bubble Bath',
    'Orignials': 'Originals'
  };
  const EXCLUDED_MENU_CATEGORIES = new Set(['Brands', 'Miscelaneous', 'Miscellaneous']);

  const gridEl = document.getElementById('galleryGrid');
  const filterEl = document.getElementById('galleryFilters');
  const searchEl = document.getElementById('gallerySearch');
  const countEl = document.getElementById('galleryCount');
  const modalEl = document.getElementById('imageModal');
  const modalImgEl = document.getElementById('imageModalImg');
  const modalCaptionEl = document.getElementById('imageModalCaption');
  const modalCloseEl = document.getElementById('imageModalClose');

  let activeCategory = 'All';
  let activeSearch = '';

  function prettyName(name) {
    return NAME_FIXES[name] || name;
  }

  function parseEntry(path) {
    const parts = path.split('/');
    const filename = parts[parts.length - 1] || '';
    const folders = parts.slice(2, -1);
    const category = prettyName(folders[0] || 'Other');
    const family = prettyName(folders[1] || category);
    const variant = prettyName((folders.slice(2).join(' / ')) || '');
    return {
      path,
      category,
      family,
      variant,
      filename,
      label: variant || family
    };
  }

  const items = PACKSHOT_PATHS
    .map(parseEntry)
    .filter((item) => !EXCLUDED_MENU_CATEGORIES.has(item.category));
  const categories = ['All'].concat(Array.from(new Set(items.map((item) => item.category))).sort());

  function itemMatches(item) {
    const categoryMatch = activeCategory === 'All' || item.category === activeCategory;
    if (!categoryMatch) return false;
    if (!activeSearch) return true;
    const haystack = `${item.category} ${item.family} ${item.variant} ${item.filename}`.toLowerCase();
    return haystack.includes(activeSearch);
  }

  function renderFilters() {
    if (!filterEl) return;
    filterEl.innerHTML = categories
      .map((category) => `<button type="button" class="gallery-chip${category === activeCategory ? ' active' : ''}" data-category="${category}">${category}</button>`)
      .join('');
  }

  function renderGrid() {
    if (!gridEl || !countEl) return;
    const filtered = items.filter(itemMatches);
    countEl.textContent = `${filtered.length} photo${filtered.length === 1 ? '' : 's'} shown`;

    if (filtered.length === 0) {
      gridEl.innerHTML = '<p class="calc-empty">No photos match your filters.</p>';
      return;
    }

    gridEl.innerHTML = filtered
      .map((item) => `
        <article class="gallery-card">
          <button class="gallery-image-btn" type="button" data-path="${item.path}" data-caption="${item.label} • ${item.category}">
            <img loading="lazy" src="${item.path}" alt="${item.label}">
          </button>
          <div class="gallery-card-body">
            <h3>${item.label}</h3>
            <p>${item.family}${item.variant ? ' • ' + item.variant : ''}</p>
          </div>
        </article>
      `)
      .join('');
  }

  function openModal(src, caption) {
    if (!modalEl || !modalImgEl || !modalCaptionEl) return;
    modalImgEl.src = src;
    modalImgEl.alt = caption;
    modalCaptionEl.textContent = caption;
    if (typeof modalEl.showModal === 'function') {
      modalEl.showModal();
    }
  }

  function closeModal() {
    if (!modalEl || typeof modalEl.close !== 'function') return;
    modalEl.close();
  }

  if (filterEl) {
    filterEl.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const button = target.closest('.gallery-chip');
      if (!button) return;
      const category = button.getAttribute('data-category');
      if (!category) return;
      activeCategory = category;
      renderFilters();
      renderGrid();
    });
  }

  if (searchEl) {
    searchEl.addEventListener('input', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) return;
      activeSearch = target.value.trim().toLowerCase();
      renderGrid();
    });
  }

  if (gridEl) {
    gridEl.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const button = target.closest('.gallery-image-btn');
      if (!button) return;
      const src = button.getAttribute('data-path');
      const caption = button.getAttribute('data-caption') || '';
      if (!src) return;
      openModal(src, caption);
    });
  }

  if (modalCloseEl) {
    modalCloseEl.addEventListener('click', closeModal);
  }

  if (modalEl) {
    modalEl.addEventListener('click', (event) => {
      if (event.target === modalEl) closeModal();
    });
  }

  renderFilters();
  renderGrid();
})();
