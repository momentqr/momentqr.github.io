/* Momentqr live TV slideshow. Shared by every client. Do not edit. */
(function(){
  const S = (typeof SETTINGS !== 'undefined' ? SETTINGS : window.SETTINGS) || {};
  const T = window.MQ_TEXT ? window.MQ_TEXT(S) : { kick: 'Happy Birthday', tvScan: 'Scan to add<br>your photos', tvEmpty: 'Scan the QR code to share your photos.', tvNew: 'New photo!', by: 'by' };
  const DEMO = !S.UPLOAD_LINK;
  const SLIDE_MS = 7000, REFRESH_MS = 15000;
  const esc = t => String(t == null ? '' : t).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  document.body.className = 'tv ' + (S.THEME || 'blush').toLowerCase();
  if (S.BG_COLOR) document.documentElement.style.setProperty('--bg', S.BG_COLOR);

  document.body.insertAdjacentHTML('afterbegin', `
  <div class="tv-stage">
    <div class="tv-slide" id="slideA"><div class="tv-blur"></div><img alt=""></div>
    <div class="tv-slide" id="slideB"><div class="tv-blur"></div><img alt=""></div>
    <div class="tv-empty" id="empty">
      <div class="tv-kick">${esc(T.kick)}</div>
      <div class="tv-name" id="emptyName"></div>
      <p>${T.tvEmpty}</p>
    </div>
  </div>
  <div class="tv-bullets" id="bullets" aria-live="polite"></div>
  <div class="tv-top"><span class="tv-title" id="title"></span><span class="tv-count" id="count"></span></div>
  <div class="tv-by" id="by"></div>
  <div class="tv-qr"><div id="qr"></div><div class="tv-qr-text">${T.tvScan}</div></div>
  <div class="tv-new" id="newBadge">${esc(T.tvNew)}</div>
  <button class="tv-full" id="fullBtn">Full screen</button>`);

  const $ = id => document.getElementById(id);
  $('title').textContent = (S.NAME || '') + (S.TITLE ? ' · ' + S.TITLE : '');
  $('emptyName').textContent = S.NAME || '';
  const q = () => (S.CODE ? '&code=' + encodeURIComponent(S.CODE) : '');

  try {
    const link = S.GUEST_LINK || new URL('./', location.href).href;
    const m = window.makeQR(link), n = m.length, p = 2; let d = '';
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (m[r][c]) d += 'M' + (c+p) + ' ' + (r+p) + 'h1v1h-1z';
    $('qr').innerHTML = '<svg viewBox="0 0 ' + (n+2*p) + ' ' + (n+2*p) + '" shape-rendering="crispEdges" role="img" aria-label="QR code to the party page"><rect width="100%" height="100%" fill="#fff"/><path d="' + d + '" fill="#000"/></svg>';
  } catch(e) {}

  $('fullBtn').onclick = () => { const el = document.documentElement; (el.requestFullscreen || el.webkitRequestFullscreen || function(){}).call(el); };
  document.addEventListener('fullscreenchange', () => { $('fullBtn').style.display = document.fullscreenElement ? 'none' : ''; });

  // ---------- photos ----------
  let items = [], known = new Set(), queue = [], idx = 0, showA = true, first = true, timer = null;
  const big = id => 'https://drive.google.com/thumbnail?id=' + encodeURIComponent(id) + '&sz=w1920';
  function demoItems(){ return [1,2,3,4,5,6].map(i => ({ id: 'demo' + i, src: '../library/demo/demo' + i + '.jpg', by: ['Aunty Mai','Lisa','Rizal','','Mira','Dan'][i-1] })); }
  function refresh(){
    if (DEMO) { apply(demoItems()); return; }
    fetch(S.UPLOAD_LINK + '?action=list' + q()).then(r => r.json()).then(r => { if (r.ok) apply(r.items.filter(x => !x.video)); }).catch(() => {});
  }
  function apply(list){
    const ids = new Set(list.map(x => x.id));
    queue = queue.filter(x => ids.has(x.id));          // hidden photos leave the queue too
    const fresh = list.filter(x => !known.has(x.id));
    fresh.forEach(x => known.add(x.id));
    items = list;
    if (!first && fresh.length) { queue = fresh.concat(queue); flashNew(); }
    first = false;
    $('count').textContent = list.length ? list.length + ' photos' : '';
    $('empty').style.display = list.length ? 'none' : 'flex';
    if (list.length && !timer) { next(); timer = setInterval(next, SLIDE_MS); }
    if (!list.length && timer) { clearInterval(timer); timer = null; ['slideA','slideB'].forEach(s => $(s).classList.remove('on')); }
  }
  function flashNew(){ const b = $('newBadge'); b.classList.add('on'); setTimeout(() => b.classList.remove('on'), 4000); }
  function next(){
    if (!items.length) return;
    const it = queue.length ? queue.shift() : items[idx++ % items.length];
    const show = showA ? $('slideA') : $('slideB'), hide = showA ? $('slideB') : $('slideA');
    showA = !showA;
    const im = show.querySelector('img'), blur = show.querySelector('.tv-blur');
    const reveal = () => { blur.style.backgroundImage = 'url("' + im.src + '")'; show.classList.add('on'); hide.classList.remove('on'); $('by').textContent = it.by ? (T.by + ' ' + it.by) : ''; };
    im.onload = () => { if (im.naturalWidth < 20 && !it.src) return im.onerror(); reveal(); };
    im.onerror = () => {
      if (it.src || DEMO || im.dataset.mq === it.id) return;
      im.dataset.mq = it.id;
      fetch(S.UPLOAD_LINK + '?action=img&size=big&id=' + encodeURIComponent(it.id) + q())
        .then(r => r.json()).then(r => { if (r.ok) im.src = 'data:' + r.mime + ';base64,' + r.data; }).catch(() => {});
    };
    delete im.dataset.mq;
    im.src = it.src || big(it.id);
  }

  // ---------- bullet wishes ----------
  let wishes = [], w = 0, lane = 0;
  function loadWishes(){
    if (DEMO) { wishes = [{ name: 'Aunty Mai', message: 'Happy birthday sayang!' }, { name: 'Lisa', message: 'Best party ever!' }, { name: 'Rizal', message: 'Semoga panjang umur!' }]; return; }
    fetch(S.UPLOAD_LINK + '?action=wishes' + q()).then(r => r.json()).then(r => { if (r.ok) wishes = r.items; }).catch(() => {});
  }
  function bullet(){
    if (!wishes.length) return;
    const x = wishes[w++ % wishes.length];
    const el = document.createElement('div'); el.className = 'tv-bullet';
    const b = document.createElement('b'); b.textContent = x.name + ': ';
    el.appendChild(b); el.appendChild(document.createTextNode(x.message.length > 80 ? x.message.slice(0, 78) + '...' : x.message));
    el.style.top = ((lane++ % 5) * 19) + '%';
    el.style.animationDuration = (12 + Math.random() * 5) + 's';
    $('bullets').appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }

  refresh(); loadWishes();
  setInterval(refresh, REFRESH_MS);
  setInterval(loadWishes, 30000);
  setInterval(bullet, 3500);
  try { navigator.wakeLock && navigator.wakeLock.request('screen').catch(() => {}); } catch(e) {}
})();
