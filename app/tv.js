/* Birthday Gallery - live TV slideshow. Shared by every client. Do not edit. */
(function(){
  const S = window.SETTINGS || {};
  const DEMO = !S.UPLOAD_LINK;
  const SLIDE_MS = 7000, REFRESH_MS = 15000;
  document.body.className = 'tv ' + (S.THEME || 'blush').toLowerCase();
  if (S.BG_COLOR) document.documentElement.style.setProperty('--bg', S.BG_COLOR);

  document.body.insertAdjacentHTML('afterbegin', `
  <div class="tv-stage" id="stage">
    <div class="tv-slide" id="slideA"><div class="tv-blur"></div><img alt=""></div>
    <div class="tv-slide" id="slideB"><div class="tv-blur"></div><img alt=""></div>
    <div class="tv-empty" id="empty">
      <div class="tv-kick">Happy Birthday</div>
      <div class="tv-name" id="emptyName"></div>
      <p>Scan the QR code to share your photos.<br>They will appear here!</p>
    </div>
  </div>
  <div class="tv-top"><span class="tv-title" id="title"></span><span class="tv-count" id="count"></span></div>
  <div class="tv-qr"><div id="qr"></div><div class="tv-qr-text">Scan to add<br>your photos</div></div>
  <div class="tv-new" id="newBadge">New photo!</div>
  <div class="tv-wish" id="wish" aria-live="polite"></div>
  <button class="tv-full" id="fullBtn">Full screen</button>`);

  const $ = id => document.getElementById(id);
  $('title').textContent = (S.NAME || '') + (S.TITLE ? ' · ' + S.TITLE : '');
  $('emptyName').textContent = S.NAME || '';

  // QR of the guests' page (this folder)
  try {
    const link = new URL('./', location.href).href;
    const m = window.makeQR(link), n = m.length, q = 2; let d = '';
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (m[r][c]) d += 'M' + (c+q) + ' ' + (r+q) + 'h1v1h-1z';
    $('qr').innerHTML = '<svg viewBox="0 0 ' + (n+2*q) + ' ' + (n+2*q) + '" shape-rendering="crispEdges" role="img" aria-label="QR code to the party page"><rect width="100%" height="100%" fill="#fff"/><path d="' + d + '" fill="#000"/></svg>';
  } catch(e) {}

  $('fullBtn').onclick = () => { const el = document.documentElement; (el.requestFullscreen || el.webkitRequestFullscreen || function(){}).call(el); };
  document.addEventListener('fullscreenchange', () => { $('fullBtn').style.display = document.fullscreenElement ? 'none' : ''; });

  // ---------- photos ----------
  let items = [], known = new Set(), queue = [], idx = 0, showA = true, first = true;
  const img = id => 'https://drive.google.com/thumbnail?id=' + encodeURIComponent(id) + '&sz=w1920';

  function demoItems(){
    return [1,2,3,4,5,6].map(i => ({ id: 'demo' + i, src: '../library/demo/demo' + i + '.jpg' }));
  }

  function refresh(){
    if (DEMO) { apply(demoItems()); return; }
    fetch(S.UPLOAD_LINK + '?action=list').then(r => r.json()).then(r => { if (r.ok) apply(r.items.filter(x => !x.video)); }).catch(() => {});
  }
  function apply(list){
    const fresh = list.filter(x => !known.has(x.id));
    fresh.forEach(x => known.add(x.id));
    items = list;
    if (!first && fresh.length) { queue = fresh.concat(queue); flashNew(); }
    first = false;
    $('count').textContent = list.length ? list.length + ' photos' : '';
    $('empty').style.display = list.length ? 'none' : 'flex';
    if (list.length && !timer) { next(); timer = setInterval(next, SLIDE_MS); }
  }
  function flashNew(){ const b = $('newBadge'); b.classList.add('on'); setTimeout(() => b.classList.remove('on'), 4000); }

  let timer = null;
  function next(){
    if (!items.length) return;
    let it = queue.length ? queue.shift() : items[idx++ % items.length];
    const show = showA ? $('slideA') : $('slideB'), hide = showA ? $('slideB') : $('slideA');
    showA = !showA;
    const im = show.querySelector('img'), blur = show.querySelector('.tv-blur');
    const reveal = () => { show.classList.add('on'); hide.classList.remove('on'); };
    if (it.demo) { im.removeAttribute('src'); im.style.background = it.demo; blur.style.background = it.demo; blur.style.backgroundImage = ''; reveal(); return; }
    im.style.background = '';
    im.onload = () => { blur.style.backgroundImage = 'url("' + im.src + '")'; reveal(); };
    im.onerror = () => {};
    im.src = it.src || img(it.id);
  }

  // ---------- wishes ticker ----------
  let wishes = [], w = 0;
  function loadWishes(){
    if (DEMO) { wishes = [{name:'Aunty Mai', message:'Happy birthday sayang!'}, {name:'Lisa', message:'Best party ever!'}]; return; }
    fetch(S.UPLOAD_LINK + '?action=wishes').then(r => r.json()).then(r => { if (r.ok) wishes = r.items; }).catch(() => {});
  }
  function showWish(){
    const box = $('wish');
    if (!wishes.length) { box.classList.remove('on'); return; }
    const x = wishes[w++ % wishes.length];
    box.classList.remove('on');
    setTimeout(() => {
      box.textContent = '';
      const b = document.createElement('b'); b.textContent = x.name + ': ';
      box.appendChild(b); box.appendChild(document.createTextNode(x.message));
      box.classList.add('on');
    }, 600);
  }

  refresh(); loadWishes();
  setInterval(refresh, REFRESH_MS);
  setInterval(loadWishes, 30000);
  setInterval(showWish, 9000);
  // keep the screen awake where supported
  try { navigator.wakeLock && navigator.wakeLock.request('screen').catch(() => {}); } catch(e) {}
})();
