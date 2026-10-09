(() => {
// Kolam House: shared, dependency-free frontend behaviours.
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const media = (key, fallback) => window.KOLAM_IMAGE_SLOTS?.[page]?.[key] || fallback;
const arrow = '<span class="arrow" aria-hidden="true">↗</span>';
const params = new URLSearchParams(location.search);
const page = location.pathname.split('/').pop() || 'index.html';
let toastTimer;
function toast(message) {
  const element = $('#toast');
  element.textContent = message;
  element.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { element.hidden = true; }, 6000);
}
function savePreference(key, value) { try { localStorage.setItem(key, value); } catch {} }
const themeButton = $('#theme-toggle');
function syncThemeLabel() {
  themeButton.setAttribute('aria-label', `Switch to ${document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'} theme`);
}
syncThemeLabel();
themeButton.addEventListener('click', () => {
  const value = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = value;
  savePreference('kolam-theme', value);
  syncThemeLabel();
});
const rtlButton = $('#rtl-toggle');
function syncDirectionLabel() {
  const rtl = document.documentElement.dir === 'rtl';
  rtlButton.setAttribute('aria-pressed', String(rtl));
  rtlButton.setAttribute('aria-label', `Switch to ${rtl ? 'left-to-right' : 'right-to-left'} layout`);
}
syncDirectionLabel();
rtlButton.addEventListener('click', () => {
  const value = document.documentElement.dir === 'rtl' ? 'ltr' : 'rtl';
  document.documentElement.dir = value;
  savePreference('kolam-dir', value);
  syncDirectionLabel();
});
const menuButton = $('#menu-toggle');
const navigation = $('#main-nav');
function closeMenu() {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  menuButton.textContent = '☰';
}
menuButton.addEventListener('click', () => {
  const open = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  menuButton.textContent = open ? '×' : '☰';
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    if (navigation.classList.contains('open')) { closeMenu(); menuButton.focus(); }
    $$('.nav-drop[open]').forEach(item => { item.open = false; $('summary', item).focus(); });
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) { closeMenu(); $$('.nav-drop[open]').forEach(item => { item.open = false; }); }
});
matchMedia('(min-width:1024px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
const topButton = $('#to-top');
addEventListener('scroll', () => topButton.classList.toggle('visible', scrollY > 500), { passive: true });
topButton.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'instant' : 'smooth' }); $('.brand').focus({ preventScroll: true }); });

// Align corresponding content within each visual card row, including after filters/fonts/images change.
let alignmentFrame;
const alignmentRules = [
  ['.product-card', ['.product-body h3', '.product-meta', '.product-desc']],
  ['.article-card', ['.article-meta', 'h3', 'p']],
  ['.collection-card', ['.card-bottom h3', '.card-bottom p']],
  ['.benefit', ['h3', 'p']], ['.step', ['h3', 'p']],
  ['.pricing-card', ['h3', '.price', 'p']]
];
function alignContentRows() {
  $$('.grid-3,.grid-4').forEach(grid => {
    alignmentRules.forEach(([cardSelector, fields]) => {
      const cards = [...grid.children].filter(card => card.matches(cardSelector));
      if (!cards.length) return;
      cards.forEach(card => fields.forEach(selector => { const field = $(selector, card); if (field) field.style.minHeight = ''; }));
      const rows = [];
      cards.forEach(card => {
        const top = card.getBoundingClientRect().top;
        let row = rows.find(row => Math.abs(row.top - top) < 4);
        if (!row) { row = {top, cards: []}; rows.push(row); }
        row.cards.push(card);
      });
      rows.filter(row => row.cards.length > 1).forEach(row => fields.forEach(selector => {
        const fieldsInRow = row.cards.map(card => $(selector, card)).filter(Boolean);
        const height = Math.ceil(Math.max(0, ...fieldsInRow.map(field => field.getBoundingClientRect().height)));
        if (height) fieldsInRow.forEach(field => { field.style.minHeight = `${height}px`; });
      }));
    });
  });
}
function scheduleAlignment() {
  cancelAnimationFrame(alignmentFrame);
  alignmentFrame = requestAnimationFrame(alignContentRows);
}
addEventListener('resize', scheduleAlignment, {passive:true});
addEventListener('load', scheduleAlignment);
document.addEventListener('load', event => { if (event.target.tagName === 'IMG') scheduleAlignment(); }, true);
document.fonts?.ready.then(scheduleAlignment);

let observer;
if (typeof IntersectionObserver === 'function' && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
  document.documentElement.classList.add('js-motion');
  observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); }
  }), { threshold: 0.06 });
}
function observeReveals() { $$('main > section, main > .trust-strip').forEach(section => section.classList.add('reveal')); scheduleAlignment(); $$('main img').forEach(img => { img.classList.add('image-motion'); if (img.getAttribute('src')?.includes('/placeholders/')) img.alt = 'Image slot'; }); $$('.reveal:not(.revealed)').forEach(element => observer ? observer.observe(element) : element.classList.add('revealed')); }
observeReveals();

// Native browser constraint validation plus accessible inline feedback.
$$('.demo-form').forEach(form => {
  form.noValidate = true;
  $$('input:not([type=file]),select,textarea', form).forEach(input => {
    if (!input.id) return;
    const error = document.createElement('p');
    error.id = `${input.id}-error`;
    error.className = 'field-error';
    error.setAttribute('aria-live', 'polite');
    const wrapper = input.closest('.field') || input.closest('.field-check');
    if (wrapper) {
      wrapper.append(error);
      input.setAttribute('aria-describedby', [input.getAttribute('aria-describedby'), error.id].filter(Boolean).join(' '));
    }
    input.addEventListener('input', () => { input.removeAttribute('aria-invalid'); error.textContent = ''; if (input.id === 'confirm-password') input.setCustomValidity(''); });
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const confirmation = $('#confirm-password', form);
    if (confirmation) confirmation.setCustomValidity(confirmation.value !== $('#password', form).value ? 'The passwords do not match.' : '');
    let firstInvalid;
    $$('input,select,textarea', form).forEach(input => {
      const error = input.id ? $(`#${input.id}-error`, form) : null;
      if (!input.checkValidity()) {
        input.setAttribute('aria-invalid', 'true');
        if (error) error.textContent = input.validationMessage;
        firstInvalid ||= input;
      } else { input.removeAttribute('aria-invalid'); if (error) error.textContent = ''; }
    });
    const status = $('.form-status', form);
    if (firstInvalid) { status.textContent = 'Please check the highlighted fields.'; if (form.dataset.kind === 'newsletter') toast('Please enter a valid email address.'); firstInvalid.focus(); return; }
    const messages = {
      contact: 'Your enquiry has not been sent. Online submissions are currently unavailable.',
      custom: 'Your enquiry has not been sent. Online submissions are currently unavailable. Your reference image remains on your device.',
      newsletter: 'Newsletter signup is currently unavailable. Your email has not been subscribed.',
      login: 'Login is currently unavailable. You have not been signed in and your password has not been saved.',
      register: 'Registration is currently unavailable. No account was created and your password has not been saved.'
    };
    const message = messages[form.dataset.kind];
    status.textContent = message;
    if (form.dataset.kind === 'newsletter') toast(message);
  });
});
$$('.password-toggle[data-target]').forEach(button => button.addEventListener('click', () => {
  const input = document.getElementById(button.dataset.target);
  const showing = input.type === 'password';
  input.type = showing ? 'text' : 'password';
  button.textContent = showing ? 'Hide' : 'Show';
  button.setAttribute('aria-label', `${showing ? 'Hide' : 'Show'} password`);
}));
$('#forgot-password')?.addEventListener('click', () => toast('Password recovery is currently unavailable.'));
let fileObjectURL;
$('#reference-image')?.addEventListener('change', event => {
  const input = event.target, file = input.files[0], preview = $('#file-preview'), error = $('#file-error');
  if (fileObjectURL) URL.revokeObjectURL(fileObjectURL);
  preview.hidden = true;
  preview.removeAttribute('src');
  error.textContent = '';
  input.setCustomValidity('');
  if (!file) return;
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
    error.textContent = 'Choose a JPG, PNG or WebP image no larger than 5 MB.';
    input.setCustomValidity(error.textContent);
    return;
  }
  fileObjectURL = URL.createObjectURL(file);
  preview.src = fileObjectURL;
  preview.hidden = false;
  preview.onerror = () => { preview.hidden = true; error.textContent = 'This file could not be read as an image. Please choose another image.'; input.setCustomValidity(error.textContent); };
});
addEventListener('pagehide', () => { if (fileObjectURL) URL.revokeObjectURL(fileObjectURL); });

function productCard(p) {
  const size = p.size ? `${p.size}″ · ${Number((p.size * 2.54).toFixed(2))} cm` : 'Accessory set';
  return `<article class="product-card reveal" data-product-id="${p.id}"><a class="product-image" href="product-details.html?id=${p.id}" aria-label="View ${escapeHTML(p.name)}"><img src="${media('product:'+p.id,`assets/images/${p.image}.webp`)}" alt="${escapeHTML(p.name)}" width="512" height="512" loading="lazy"><span class="product-tag">${p.complexity}</span></a><div class="product-body"><span class="eyebrow">${escapeHTML(p.category)}</span><h3><a href="product-details.html?id=${p.id}">${escapeHTML(p.name)}</a></h3><div class="product-meta">${size} &nbsp; · &nbsp; ${p.material}</div><p class="product-desc">${escapeHTML(p.description)}</p><div class="product-bottom"><span class="price">₹${p.price}<small>GUIDE PRICE</small></span><a class="text-link" href="product-details.html?id=${p.id}">View design${arrow}</a></div></div></article>`;
}
function articleCard(p) {
  return `<article class="article-card reveal"><a class="image-wrap" href="blog-details.html?id=${p.id}"><img src="${media('post:'+p.id,`assets/images/${p.image}.webp`)}" alt="${escapeHTML(p.title)}" width="512" height="512" loading="lazy"></a><div class="article-meta">${p.category} &nbsp; · &nbsp; ${p.time} min read</div><h3><a href="blog-details.html?id=${p.id}">${escapeHTML(p.title)}</a></h3><p>${escapeHTML(p.desc)}</p><a class="text-link" href="blog-details.html?id=${p.id}">Read the story${arrow}</a></article>`;
}
async function getData(filename) {
  if (window.KOLAM_DATA?.[filename]) return window.KOLAM_DATA[filename];
  const response = await fetch(`assets/${filename}.json`);
  if (!response.ok) throw new Error('Collection data could not be loaded.');
  return response.json();
}
async function initializeProducts() {
  if (!['products.html', 'product-details.html', 'contact.html'].includes(page)) return;
  const products = await getData('products');
  if (page === 'products.html') {
    const keys = ['category', 'complexity', 'size', 'occasion', 'material', 'price'];
    keys.forEach(key => { if (params.has(key)) $(`#${key}`).value = params.get(key); });
    function render() {
      const search = $('#product-search').value.trim().toLowerCase();
      const f = Object.fromEntries(keys.map(key => [key, $(`#${key}`).value]));
      let filtered = products.filter(p => {
        const categoryMatch = !f.category || p.category === f.category || (f.category === 'Kolam Rangoli Stencils' && ['Kambi Kolam', 'Padi Kolam', 'Pulli Kolam / Dot Kolam'].includes(p.category));
        const priceMatch = !f.price || (f.price === 'Under ₹300' ? p.price < 300 : f.price === '₹300–₹500' ? p.price >= 300 && p.price <= 500 : p.price > 500);
        return categoryMatch && priceMatch && (!f.complexity || p.complexity === f.complexity) && (!f.size || p.size === Number(f.size)) && (!f.occasion || p.occasion === f.occasion) && (!f.material || p.material === f.material) && (!search || `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(search));
      });
      const sort = $('#product-sort').value;
      if (sort === 'price-low') filtered.sort((a,b) => a.price-b.price);
      if (sort === 'price-high') filtered.sort((a,b) => b.price-a.price);
      if (sort === 'name') filtered.sort((a,b) => a.name.localeCompare(b.name));
      $('#results-count').textContent = `${filtered.length} of ${products.length} designs`;
      $('#product-grid').innerHTML = filtered.length ? filtered.map(productCard).join('') : '<div class="empty-state"><h3>No patterns found.</h3><p>Try a different search or clear your filters.</p></div>';
      observeReveals();
    }
    keys.forEach(key => $(`#${key}`).addEventListener('change', render));
    $('#product-search').addEventListener('input', render);
    $('#product-sort').addEventListener('change', render);
    $('#reset-filters').addEventListener('click', () => {
      keys.forEach(key => { $(`#${key}`).value = ''; });
      $('#product-search').value = '';
      $('#product-sort').value = 'featured';
      render();
    });
    render();
  }
  if (page === 'product-details.html') {
    const requested = params.get('id');
    const product = products.find(p => p.id === requested) || products[0];
    if (requested && !products.some(p => p.id === requested)) toast('That design was not found. Showing the first collection design.');
    document.title = `${product.name} | Kolam House`;
    $('meta[name="description"]').content = product.description;
    $('meta[property="og:title"]').content = document.title;
    $('meta[property="og:description"]').content = product.description;
    const canonical = new URL('product-details.html', location.href);
    canonical.searchParams.set('id', product.id);
    $('link[rel="canonical"]').href = canonical.href;
    $('meta[property="og:url"]').content = canonical.href;
    $('#detail-name').textContent = product.name;
    $('#detail-category').textContent = product.category;
    $('#detail-description').textContent = product.description;
    $('#detail-price').innerHTML = `₹${product.price} <small>GUIDE PRICE · QUOTE REQUIRED</small>`;
    $('#detail-material').textContent = product.material;
    $('#detail-complexity').textContent = product.complexity;
    $('#detail-size').textContent = product.size ? `${product.size} inches · ${Number((product.size * 2.54).toFixed(2))} cm` : 'Accessory set; contents to be confirmed';
    $('#detail-occasion').textContent = product.occasion;
    const mainImage = $('#main-product-image');
    mainImage.src = media(`detail:${product.id}`, `assets/images/${product.image}.webp`);
    mainImage.alt = `${product.name}`;
    const firstThumb = $('.thumbnail img');
    firstThumb.src = mainImage.src;
    firstThumb.alt = mainImage.alt;
    $$('.thumbnail').forEach(button => button.addEventListener('click', () => {
      $$('.thumbnail').forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      mainImage.src = $('img', button).src;
      mainImage.alt = $('img', button).alt;
    }));
    const sizes = $('#detail-size-select');
    if (product.size) {
      if (![...sizes.options].some(o => o.value === String(product.size))) sizes.add(new Option(`${product.size}″ · ${product.size * 2.54} cm`, String(product.size)));
      sizes.value = String(product.size);
    } else { sizes.closest('.field').hidden = true; }
    function updateEnquiry() {
      $('#product-enquiry').href = `contact.html?product=${encodeURIComponent(product.id)}&size=${encodeURIComponent(sizes.value)}`;
      $('#size-note').textContent = sizes.value === 'custom' ? 'Share your exact dimensions in a custom enquiry. Final pricing requires a quote.' : `${sizes.value}″ · ${Number((Number(sizes.value) * 2.54).toFixed(2))} cm selected. Price and availability must be confirmed in a quote.`;
    }
    sizes.addEventListener('change', updateEnquiry);
    updateEnquiry();
    $('#related-products').innerHTML = products.filter(p => p.id !== product.id && p.material !== 'Powder').slice(0,3).map(productCard).join('');
    observeReveals();
    const productSchema = document.createElement('script');
    productSchema.type = 'application/ld+json';
    productSchema.textContent = JSON.stringify({'@context':'https://schema.org','@type':'Product',name:product.name,description:`stencil design. ${product.description}`,material:product.material,image:new URL(`assets/images/${product.image}.webp`,location.href).href});
    document.head.append(productSchema);
  }
  if (page === 'contact.html') {
    const product = products.find(p => p.id === params.get('product'));
    if (product) {
      $('#enquiry-category').value = 'Product question';
      $('#subject').value = `Enquiry: ${product.name}`;
      $('#message').value = `I would like to know more about ${product.name}${params.get('size') ? ` in size ${params.get('size')}${params.get('size') === 'custom' ? '' : ' inches'}` : ''}. Please confirm the design, dimensions and quote.`;
    } else if (params.has('subject')) { $('#subject').value = params.get('subject'); $('#enquiry-category').value = 'Bulk enquiry'; }
  }
}

const storyContent = {
 'pongal': [
  ['Begin with a welcoming entrance','Pongal is a Tamil harvest celebration. A kolam at the doorway can be one thoughtful part of the preparations. Learn from family practices or local practitioners instead of assuming every household follows the same pattern.'],
  ['Choose the pattern and scale','Measure the threshold, leave space for visitors and choose a kolam design you feel comfortable making. Layered padi patterns or a simpler dot-based design can offer different starting points.'],
  ['Make space for the celebration','Keep the floor clean and dry. If you add flowers or lamps, place them securely and away from walking routes. Your household’s traditions should guide the details.'],
  ['Return to the everyday','Brush the stencil after use and store it flat. The ritual of making a pattern can continue beyond the festival, at a pace that suits you.']
 ],
 'small-spaces': [
  ['Measure before choosing','A compact entrance can hold a beautiful pattern without feeling crowded. Measure the usable space and leave clearance for doors, feet and any furniture.'],
  ['Let one motif lead','Start with a small floral or dot-based design. One considered motif often reads more clearly than several competing designs in a narrow threshold.'],
  ['Use a border thoughtfully','A slim border can define an edge without occupying the whole floor. Check both length and width before choosing a rectangular stencil.'],
  ['Keep movement comfortable','Avoid creating a pattern where people need to step over it. If the doorway is too small, consider an adjacent corner where the artwork can be enjoyed safely.']
 ],
 'stencil-care': [
  ['Know your material','Wood and MDF do not have identical finishes or moisture tolerance. Ask the supplier about your actual stencil material and follow its care instructions.'],
  ['Remove dry powder gently','Use a soft dry brush after the pattern is complete. Work carefully around fine openings and avoid bending the stencil or pushing tools through delicate cut-outs.'],
  ['Avoid soaking','Do not assume a wooden or MDF stencil can be washed or submerged. Moisture can affect shape and surface. Confirm any cleaning method with the maker first.'],
  ['Store flat and dry','Keep the stencil away from damp floors and direct strain. Protect delicate edges and do not pile heavy objects on a fine pattern.']
 ],
 'padi-story': [
  ['A rhythm of layered lines','Padi kolam is associated with stepped or layered rectilinear compositions. Its visual rhythm differs from the interlaced loops often associated with kambi kolam.'],
  ['Look beyond the outline','A pattern belongs to a wider practice, learned through observation and making. Names and customary uses can vary by family and locality; learn from practitioners in context.'],
  ['Begin with proportion','When exploring a stencil design, notice the spaces between lines as well as the lines themselves. Scale and placement affect how the design appears at a threshold.'],
  ['Keep curiosity close','A stencil is an approachable tool. It can invite you to learn freehand methods, regional meanings and the decisions behind a traditional composition.']
 ],
 'diwali': [
  ['Give colour a place to breathe','Choose a main rangoli motif and a considered palette. Leave some floor visible around the design so the pattern feels intentional rather than crowded.'],
  ['Arrange lamps with care','Use stable lamps on a suitable surface and keep flames away from curtains, clothing and decorations. Maintain a clear walking route for guests.'],
  ['Add your own finishing touch','Petals or a small repeating border can complete a composition. Keep the motif readable and choose materials compatible with the floor.'],
  ['Enjoy the making','A festive entrance does not need to be elaborate. Choose a pattern you can create comfortably and allow time to enjoy the preparation.']
 ],
 'right-size': [
  ['Measure the usable area','Measure the space where the design will sit, rather than the entire room. Check door clearance and the space needed to lift a stencil.'],
  ['Compare inches and centimetres','Multiply inches by 2.54 to convert to centimetres. A 10-inch square is 25.4 cm per side; a 12-inch square is 30.48 cm per side.'],
  ['Check the whole footprint','The stencil frame may extend beyond the pattern itself. Ask the supplier whether listed dimensions describe the outer frame or the finished artwork.'],
  ['Ask about custom dimensions','If standard sizes do not fit, explain your measurements and preferred detail level in an enquiry. Very fine patterns may need adjustment at smaller sizes.']
 ],
 'personal-design': [
  ['Start with the meaning','A name, a celebration or a favourite motif can be the beginning of a personal design. Describe why it matters and where the stencil will be used.'],
  ['Confirm the exact text','Provide name spellings and the preferred script clearly. Review every character in the final artwork before approving production.'],
  ['Understand cuttable detail','Some letter counters and thin connections require bridges or simplified forms in a stencil. Ask the maker to explain these choices before deciding.'],
  ['Share a clear brief','Include size, material, quantity and any event date. Use reference artwork you have permission to share, and confirm costs and timelines directly with the business.']
 ]
};
async function initializeJournal() {
  if (!['blog.html','blog-details.html'].includes(page)) return;
  const posts = await getData('posts');
  if (page === 'blog.html') {
    let category = 'All stories', currentPage = 1;
    function render() {
      const search = $('#blog-search').value.toLowerCase().trim();
      const filtered = posts.filter(p => (category === 'All stories' || p.category === category) && `${p.title} ${p.desc}`.toLowerCase().includes(search));
      const pageCount = Math.ceil(filtered.length / 6);
      currentPage = Math.min(currentPage, pageCount || 1);
      $('#blog-count').textContent = `${filtered.length} ${filtered.length === 1 ? 'story' : 'stories'}`;
      $('#blog-grid').innerHTML = filtered.length ? filtered.slice((currentPage-1)*6,currentPage*6).map(articleCard).join('') : '<div class="empty-state"><h3>No stories found.</h3><p>Try another search or choose all stories.</p></div>';
      $('#blog-pagination').innerHTML = Array.from({length:pageCount},(_,i)=>`<button class="${currentPage === i+1 ? 'active' : ''}" ${currentPage === i+1 ? 'aria-current="page"' : ''} data-page="${i+1}" aria-label="Journal page ${i+1}">${i+1}</button>`).join('');
      $$('#blog-pagination button').forEach(button => button.addEventListener('click', () => { currentPage = Number(button.dataset.page); render(); $('#blog-search').focus(); }));
      observeReveals();
    }
    $$('#blog-filters button').forEach(button => button.addEventListener('click', () => {
      category = button.dataset.category;
      currentPage = 1;
      $$('#blog-filters button').forEach(b => { b.classList.toggle('active', b===button); b.setAttribute('aria-pressed', String(b===button)); });
      render();
    }));
    $('#blog-search').addEventListener('input', () => { currentPage = 1; render(); });
    render();
  } else {
    const requested = params.get('id');
    const post = posts.find(p => p.id === requested) || posts[0];
    if (requested && !posts.some(p => p.id === requested)) toast('That story was not found. Showing our first journal guide.');
    document.title = `${post.title} | Kolam House Journal`;
    $('meta[name="description"]').content = post.desc;
    $('meta[property="og:title"]').content = document.title;
    $('meta[property="og:description"]').content = post.desc;
    const canonical = new URL('blog-details.html', location.href);
    canonical.searchParams.set('id', post.id);
    $('link[rel="canonical"]').href = canonical.href;
    $('meta[property="og:url"]').content = canonical.href;
    $('.page-hero h1').textContent = post.title;
    $('.page-hero>p').textContent = post.desc;
    $('.page-hero>.eyebrow').textContent = `The Kolam Journal · ${post.category}`;
    // Breadcrumb row removed as requested.
    const index = posts.findIndex(p => p.id === post.id);
    const prev = posts[(index-1+posts.length)%posts.length];
    const next = posts[(index+1)%posts.length];
    if (post.id !== 'first-kolam') {
      const sections = storyContent[post.id];
      $('#article-body').innerHTML = `<p class="article-meta">Kolam House Journal · 8 October 2026 · ${post.time} min read</p><img src="${media('article:'+post.id,`assets/images/${post.image}.webp`)}" alt="${escapeHTML(post.title)}" width="512" height="512">` + sections.map(([title,copy],i) => `<h2 id="story-${i}">${escapeHTML(title)}</h2><p>${escapeHTML(copy)}</p>`).join('') + `<div class="article-nav"><a class="text-link" href="blog-details.html?id=${prev.id}">Previous story${arrow}</a><a class="text-link" href="blog-details.html?id=${next.id}">Next story${arrow}</a></div>`;
      $('#article-toc').innerHTML = sections.map(([title],i) => `<a href="#story-${i}">${escapeHTML(title)}</a>`).join('');
    }
    $('#related-posts').innerHTML = posts.filter(p => p.id !== post.id).slice(0,3).map(articleCard).join('');
    const schema = document.createElement('script');
    schema.type = 'application/ld+json';
    schema.textContent = JSON.stringify({'@context':'https://schema.org','@type':'BlogPosting',headline:post.title,description:post.desc,datePublished:'2026-10-08',author:{'@type':'Organization',name:'Kolam House — editorial brand'},image:new URL(`assets/images/${post.image}.webp`,location.href).href});
    document.head.append(schema);
    observeReveals();
  }
}
$('#share-article')?.addEventListener('click', async () => {
  try {
    if (navigator.share) await navigator.share({ title: document.title, url: location.href });
    else if (navigator.clipboard) { await navigator.clipboard.writeText(location.href); toast('Story link copied.'); }
    else toast(`Share this story: ${location.href}`);
  } catch (error) { if (error.name !== 'AbortError') toast('Could not share automatically. Copy this page’s address to share the story.'); }
});
Promise.allSettled([initializeProducts(),initializeJournal()]).then(results => {
  results.forEach(result => { if (result.status === 'rejected') toast('Interactive data could not load. Please refresh the page or serve the site over HTTP.'); });
});

})();
