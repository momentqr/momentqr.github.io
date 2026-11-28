/* Momentqr guest page. Shared by every client. Do not edit. */
(function(){
  const S = (typeof SETTINGS !== 'undefined' ? SETTINGS : window.SETTINGS) || {};
  const T = window.MQ_TEXT ? window.MQ_TEXT(S) : {};
  const DEMO = !S.UPLOAD_LINK;
  const MAX_MB = 25, MAX_FILES = 10;
  const CLOSED = S.OPEN === false;
  const esc = t => String(t == null ? '' : t).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const ico = p => '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
  const camIcon = ico('<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>');
  const vidIcon = ico('<rect x="2" y="6" width="14" height="12" rx="2"/><path d="M16 10l6-3v10l-6-3"/>');
  const picIcon = ico('<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-8 8"/>');
  const dlIcon = ico('<path d="M12 4v11"/><path d="M7 10l5 5 5-5"/><path d="M5 20h14"/>');
  const shIcon = ico('<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.9l7.6-4.4M8.2 13.1l7.6 4.4"/>');
  const wishIcon = ico('<path d="M4 5h16v11H9l-5 4z"/>');
  const galIcon = ico('<rect x="3" y="3" width="8" height="10" rx="2"/><rect x="13" y="3" width="8" height="6" rx="2"/><rect x="3" y="15" width="8" height="6" rx="2"/><rect x="13" y="11" width="8" height="10" rx="2"/>');
  const heart = on => '<svg width="22" height="22" viewBox="0 0 24 24" fill="' + (on ? '#FF3B6B' : 'none') + '" stroke="' + (on ? '#FF3B6B' : 'currentColor') + '" stroke-width="2.2" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7-4.4-9.2-8.6C1.3 8.4 3 5 6.4 5c2 0 3.4 1.1 4.1 2.4h3C14.2 6.1 15.6 5 17.6 5 21 5 22.7 8.4 21.2 11.4 19 15.6 12 20 12 20z"/></svg>';

  document.body.insertAdjacentHTML('afterbegin', `
<div class="bgimg" id="bgimg"></div>
<div class="veil" id="veil"></div>
<button id="musicBtn" aria-label="Music on or off">
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--main)" aria-hidden="true"><path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/></svg>
</button>
<audio id="song" loop preload="auto"></audio>
<section id="cover">
  <div class="bullets" id="bullets" aria-hidden="true"></div>
  <div class="kick" id="inviteLine"></div>
  <img class="avatar" id="coverPhoto" alt="">
  <h1 class="name" id="coverName"></h1>
  <p class="title" id="coverTitle"></p>
  <p class="date" id="coverDate"></p>
  <button class="btn" id="openBtn">${esc(T.tapOpen)}</button>
  <div class="hint" id="musicHint">${esc(T.musicHint)}</div>
</section>
<main id="main">
  <header class="phead">
    <img class="phead-av" id="mainPhoto" alt="">
    <div class="phead-tx"><h1 id="mainName"></h1><div id="mainSub"></div></div>
  </header>
  <div class="demo" id="demo" hidden>${esc(T.demo)}</div>
  <div class="ended" id="ended" hidden><b>${esc(T.endedTitle)}</b><span>${esc(T.endedSub)}</span></div>

  <section class="pane" id="paneWishes" hidden aria-labelledby="tabW">
    <div class="kick" id="mainKick"></div>
    <p class="msg" id="mainMsg"></p>
    <div class="card" id="wishCard">
      <h2>${esc(T.wishes)}</h2>
      <form id="wishForm">
        <label for="wName">${esc(T.wishName)}</label>
        <input type="text" id="wName" maxlength="40" autocomplete="name">
        <label for="wMsg">${esc(T.wishText)}</label>
        <textarea id="wMsg" maxlength="300"></textarea>
        <div class="emo" id="emo" aria-label="${esc(T.addEmoji)}"></div>
        <button class="btn wide" type="submit">${esc(T.send)}</button>
      </form>
      <div id="wishStatus" class="count" role="status"></div>
    </div>
    <div id="wishes"></div>
    <div class="empty" id="wishEmpty" hidden>${esc(T.noWishes)}</div>
  </section>

  <section class="pane" id="paneGallery" aria-labelledby="tabG">
    <div class="chips" id="chips" role="group" aria-label="${esc(T.filter)}">
      <button type="button" data-f="all" class="on" aria-pressed="true">${esc(T.fAll)}</button>
      <button type="button" data-f="photo" aria-pressed="false">${esc(T.fPhotos)}</button>
      <button type="button" data-f="video" aria-pressed="false">${esc(T.fVideos)}</button>
      <button type="button" data-f="mine" aria-pressed="false">${esc(T.fMine)}</button>
      <button type="button" data-f="fav" aria-pressed="false">&#10084;&#65039; ${esc(T.fFav)}</button>
    </div>
    <div class="fnote" id="fnote"></div>
    <div class="mas" id="mas"><div class="mcol"></div><div class="mcol"></div></div>
    <div class="empty" id="empty" hidden></div>
    <div class="foot">${esc(T.madeFor)} <span id="footName"></span></div>
  </section>
  <button type="button" class="newpill" id="newPill" hidden></button>
  <button type="button" class="fab" id="addBtn"><span aria-hidden="true">+</span> ${esc(T.add)}</button>
  <nav class="tabbar" aria-label="Sections">
    <button type="button" id="tabW" aria-controls="paneWishes" aria-selected="false">${wishIcon}<span>${esc(T.tabWishes)}</span><em id="wishN"></em></button>
    <button type="button" id="tabG" aria-controls="paneGallery" aria-selected="true" class="on">${galIcon}<span>${esc(T.gallery)}</span></button>
  </nav>
</main>

<div class="sheet-wrap" id="sheet" hidden>
  <div class="sheet-dim" id="sheetDim"></div>
  <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheetTitle">
    <div class="sheet-grip" aria-hidden="true"></div>
    <h2 id="sheetTitle">${esc(T.shareTitle)}</h2>
    <div class="welcome" id="welcome" hidden></div>
    <div id="sheetForm">
      <label class="gname" for="guestName">${esc(T.yourName)}</label>
      <input type="text" id="guestName" maxlength="30" autocomplete="name">
      <div class="twobtn">
        <button type="button" class="btn wide" id="takeBtn">${camIcon} ${esc(T.take)}</button>
        <button type="button" class="btn wide" id="recBtn">${vidIcon} ${esc(T.record)}</button>
        <button type="button" class="btn wide ghost" id="chooseBtn">${picIcon} ${esc(T.choose)}</button>
      </div>
      <p class="small">${esc(T.upTo10)}</p>
    </div>
    <div id="sheetProg" hidden>
      <b id="progText"></b>
      <div class="bar"><i id="barFill"></i></div>
      <p class="small">${esc(T.keepOpen)}</p>
    </div>
    <div id="status" role="status"></div>
    <button type="button" class="sheet-cancel" id="sheetClose">${esc(T.cancel)}</button>
  </div>
</div>
<input type="file" id="camInput" accept="image/*" capture="environment">
<input type="file" id="vidInput" accept="video/*" capture="environment">
<input type="file" id="fileInput" accept="image/*,video/*" multiple>
<div class="toast" id="toast" role="status"></div>

<div class="feed" id="feed" role="dialog" aria-modal="true" aria-label="Photo and video viewer" hidden>
  <div class="feed-list" id="feedList"></div>
  <div class="feed-pos" id="feedPos"></div>
  <button class="feed-close" id="feedClose" aria-label="${esc(T.close)}">&times;</button>
  <button class="feed-sound" id="feedSound" aria-label="Sound on or off">&#128263;</button>
  <div class="feed-hint" id="feedHint">${esc(T.swipe)}</div>
  <button class="feed-arrow feed-left" id="feedPrev" aria-label="Previous">&#8249;</button>
  <button class="feed-arrow feed-right" id="feedNext" aria-label="Next">&#8250;</button>
  <div class="feed-actions">
    <button type="button" class="fa-heart" id="feedFav" aria-pressed="false" aria-label="${esc(T.fFav)}"></button>
    <button type="button" class="fa-dl" id="feedDl">${dlIcon}<span id="feedDlText">${esc(T.dlPhoto)}</span></button>
    <button type="button" class="fa-share" id="feedShare">${shIcon}<span>${esc(T.share)}</span></button>
  </div>
</div>
<div class="rec" id="rec" role="dialog" aria-modal="true" aria-label="Record a video" hidden>
  <video id="recLive" playsinline muted autoplay></video>
  <video id="recPlay" playsinline controls hidden></video>
  <div class="rec-top"><button class="rec-x" id="recClose" aria-label="${esc(T.close)}">&times;</button><span class="rec-time" id="recTime">0:15</span><button class="rec-flip" id="recFlip" aria-label="Switch camera">&#8645;</button></div>
  <div class="rec-bottom">
    <button class="rec-dot" id="recDot" aria-label="Start recording"><span></span></button>
    <div class="rec-after" id="recAfter" hidden><button class="btn ghost" id="recRetake">${esc(T.retake)}</button><button class="btn" id="recSend">${esc(T.sendVideo)}</button></div>
  </div>
  <div class="rec-msg" id="recMsg" role="status"></div>
</div>`);

  const $ = id => document.getElementById(id);
  const store = {
    get(k, d){ try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch(e){ return d; } },
    set(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} }
  };
  const KEY = (S.CODE || 'demo');
  let mine = new Set(store.get('mq_mine_' + KEY, []));
  let favs = new Set(store.get('mq_fav_' + KEY, []));
  const saveMine = () => store.set('mq_mine_' + KEY, Array.from(mine).slice(-300));
  const saveFavs = () => store.set('mq_fav_' + KEY, Array.from(favs).slice(-500));
  let toastT = null;
  function toast(msg){ const t = $('toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 2600); }

  // ---------- apply settings ----------
  document.body.className = (S.THEME || 'blush').toLowerCase();
  if (S.BG_COLOR) document.documentElement.style.setProperty('--bg', S.BG_COLOR);
  if (S.BG_IMAGE) $('bgimg').style.backgroundImage = 'url("' + encodeURI(S.BG_IMAGE) + '")';
  else $('veil').style.display = 'none';
  document.title = (S.NAME || '') + (S.TITLE ? "'s " + S.TITLE : '');
  document.documentElement.lang = T.lang || 'en';
  $('inviteLine').textContent = S.INVITE_LINE || T.kick || '';
  $('mainKick').textContent = T.kick || '';
  ['coverName','mainName'].forEach(i => $(i).textContent = S.NAME || '');
  $('coverTitle').textContent = S.TITLE || '';
  $('coverDate').textContent = S.DATE || '';
  $('mainMsg').textContent = S.MESSAGE || '';
  if (!S.MESSAGE) $('mainMsg').style.display = 'none';
  $('footName').textContent = S.NAME || '';
  ['coverPhoto','mainPhoto'].forEach(i => {
    const im = $(i);
    if (S.PHOTO) { im.src = S.PHOTO; im.alt = S.NAME || '';
      im.onerror = () => { if (S.PHOTO_ID && !im.dataset.mq) mqImg(im, S.PHOTO_ID, 'big'); else im.style.display = 'none'; }; }
    else im.style.display = 'none';
  });
  if (DEMO) $('demo').hidden = false;
  const savedName = store.get('mq_guest_name', '') || (function(){ try { return localStorage.getItem('mq_guest') || ''; } catch(e){ return ''; } })();
  if (savedName) { $('guestName').value = savedName; $('wName').value = savedName; }
  if (CLOSED) { $('ended').hidden = false; $('addBtn').hidden = true; $('wishForm').hidden = true; }
  ['🎂','🎉','❤️','🥳','🎁','🙏','✨'].forEach(e => {
    const b = document.createElement('button'); b.type = 'button'; b.textContent = e; b.setAttribute('aria-label', T.addEmoji + ' ' + e);
    b.onclick = () => { const m = $('wMsg'); const p = m.selectionStart == null ? m.value.length : m.selectionStart; m.value = (m.value.slice(0, p) + e + m.value.slice(p)).slice(0, 300); m.focus(); };
    $('emo').appendChild(b);
  });

  // ---------- network ----------
  const q = () => (S.CODE ? '&code=' + encodeURIComponent(S.CODE) : '');
  function post(obj){ if (S.CODE) obj.code = S.CODE; return fetch(S.UPLOAD_LINK, { method:'POST', body: JSON.stringify(obj) }).then(r => r.json()); }
  function get(action){ return fetch(S.UPLOAD_LINK + '?action=' + action + q()).then(r => r.json()); }
  function b64Blob(data, mime){ const bin = atob(data), u8 = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i); return new Blob([u8], { type: mime }); }

  // load a picture through the script when Google blocks the public link
  function mqImg(img, id, size, onFail){
    if (DEMO || !id || img.dataset.mq === id + size) return onFail && onFail();
    img.dataset.mq = id + size;
    fetch(S.UPLOAD_LINK + '?action=img&id=' + encodeURIComponent(id) + '&size=' + (size || 'small') + q())
      .then(r => r.json()).then(r => { if (r.ok) img.src = 'data:' + r.mime + ';base64,' + r.data; else if (onFail) onFail(); }).catch(() => onFail && onFail());
  }
  window.mqImg = mqImg;

  // ---------- music ----------
  const song = $('song');
  let hasSong = !!S.SONG;
  if (hasSong) { song.src = S.SONG; song.onerror = () => { hasSong = false; $('musicBtn').style.display = 'none'; }; }
  else $('musicHint').style.display = 'none';
  window.setSong = url => { if (!url) return; hasSong = true; song.src = url; $('musicHint').style.display = ''; };

  $('openBtn').onclick = () => {
    $('cover').style.display = 'none';
    $('main').style.display = 'block';
    stopBullets();
    window.scrollTo(0, 0);
    if (hasSong) {
      song.play().then(() => { $('musicBtn').style.display = 'flex'; })
                 .catch(() => { $('musicBtn').style.display = 'flex'; $('musicBtn').classList.add('off'); });
    }
    loadGallery(); loadWishes();
    setInterval(loadGallery, 20000);
    setInterval(loadWishes, 45000);
  };
  $('musicBtn').onclick = () => {
    if (song.paused) { song.play(); $('musicBtn').classList.remove('off'); }
    else { song.pause(); $('musicBtn').classList.add('off'); }
  };

  // ---------- tabs ----------
  let tab = 'g';
  function setTab(t){
    tab = t;
    $('paneWishes').hidden = t !== 'w'; $('paneGallery').hidden = t !== 'g';
    $('tabW').classList.toggle('on', t === 'w'); $('tabG').classList.toggle('on', t === 'g');
    $('tabW').setAttribute('aria-selected', t === 'w'); $('tabG').setAttribute('aria-selected', t === 'g');
    $('addBtn').style.display = (t === 'g' && !CLOSED) ? '' : 'none';
    if (t !== 'g') $('newPill').hidden = true;
    window.scrollTo(0, 0);
  }
  $('tabW').onclick = () => setTab('w');
  $('tabG').onclick = () => { if (tab === 'g') { window.scrollTo({ top: 0, behavior: 'smooth' }); showPending(); } else setTab('g'); };

  // ---------- gallery (2 columns, mixed heights) ----------
  const thumb = (id, w) => 'https://drive.google.com/thumbnail?id=' + encodeURIComponent(id) + '&sz=w' + (w || 600);
  const RAT = [1.33, 1, 1.25, 1.5, 1.15];
  function ratio(it){ if (it.video) return 1.6; let h = 0; const s = String(it.id); for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return RAT[Math.abs(h) % RAT.length]; }
  let gallery = [], shown = [], filter = 'all', pending = null, loaded = false;
  const tiles = new Map();
  function tileFor(it){
    let b = tiles.get(it.id);
    if (b) return b;
    b = document.createElement('button');
    b.className = 'tile'; b.type = 'button';
    b.style.aspectRatio = '1 / ' + ratio(it);
    b.setAttribute('aria-label', (it.video ? T.video : T.photo) + (it.by ? ' ' + T.by + ' ' + it.by : ''));
    if (it.demo) b.style.background = it.demo;
    else {
      const img = document.createElement('img');
      img.loading = 'lazy'; img.alt = '';
      img.onerror = () => mqImg(img, it.id, 'small', () => { if (it.video) { img.remove(); b.classList.add('vtile'); } });
      img.onload = () => { if (img.naturalWidth < 20) mqImg(img, it.id, 'small'); };
      img.src = thumb(it.id, 500);
      b.appendChild(img);
    }
    if (it.video) { const p = document.createElement('span'); p.className = 'vbadge'; p.innerHTML = '<svg width="11" height="11" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>' + esc(T.video); b.appendChild(p); }
    const hf = document.createElement('span'); hf.className = 'tile-fav'; hf.innerHTML = '&#10084;&#65039;'; b.appendChild(hf);
    if (it.by) { const n = document.createElement('span'); n.className = 'tile-by'; n.textContent = T.by + ' ' + it.by; b.appendChild(n); }
    b.onclick = () => openFeed(shown.indexOf(it.id) >= 0 ? shownItems().findIndex(x => x.id === it.id) : 0);
    tiles.set(it.id, b);
    return b;
  }
  function pass(it){
    if (filter === 'photo') return !it.video;
    if (filter === 'video') return !!it.video;
    if (filter === 'mine') return mine.has(it.id);
    if (filter === 'fav') return favs.has(it.id);
    return true;
  }
  const shownItems = () => gallery.filter(pass);
  function draw(){
    const items = shownItems();
    shown = items.map(i => i.id);
    const cols = $('mas').children, h = [0, 0];
    cols[0].textContent = ''; cols[1].textContent = '';
    items.forEach(it => {
      const k = h[0] <= h[1] ? 0 : 1;
      const t = tileFor(it); t.classList.toggle('faved', favs.has(it.id));
      cols[k].appendChild(t); h[k] += ratio(it) + 0.12;
    });
    const n = gallery.length;
    $('mainSub').textContent = [S.TITLE, n ? T.photos(n) : ''].filter(Boolean).join(' · ');
    const em = $('empty');
    em.hidden = !!items.length;
    em.textContent = filter === 'mine' ? T.emptyMine : filter === 'fav' ? T.emptyFav : (filter === 'all' ? T.empty : T.emptyFilter);
    $('fnote').textContent = filter === 'fav' && items.length ? T.favNote : (filter === 'mine' && items.length ? T.mineN(items.length) : '');
  }
  function renderGallery(items, fresh){
    const known = new Set(gallery.map(i => i.id));
    const added = items.filter(i => !known.has(i.id)).length;
    const same = items.length === gallery.length && !added;
    if (same && !fresh && loaded) return;
    loaded = true;
    // someone uploaded while this guest is scrolled down: keep the page still, show the pill
    if (gallery.length && added && !fresh && tab === 'g' && window.scrollY > 250 && $('feed').hidden) {
      pending = items;
      $('newPill').textContent = '↑ ' + T.newPhotos(items.filter(i => !known.has(i.id)).length);
      $('newPill').hidden = false;
      return;
    }
    gallery = items; pending = null; $('newPill').hidden = true;
    draw();
  }
  function showPending(){ if (pending) { gallery = pending; pending = null; draw(); } $('newPill').hidden = true; }
  $('newPill').onclick = () => { showPending(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  window.addEventListener('scroll', () => { if (window.scrollY < 80 && pending) showPending(); }, { passive: true });
  $('chips').addEventListener('click', e => {
    const b = e.target.closest('button[data-f]'); if (!b) return;
    filter = b.dataset.f;
    $('chips').querySelectorAll('button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
    showPending(); draw();
  });
  function loadGallery(){
    if (DEMO) {
      const c = ['#F7C6D3','#CDE7F5','#FFE5A6','#D9CCF5','#CFEBD9','#F9D7C3','#F4C6D2','#E8D9F7','#FFD6E2'];
      const by = ['Lisa','Amir','Mei','','Sara','Aunty Mai','','Hafiz','Nurul'];
      if (!gallery.length) renderGallery(c.map((d, i) => ({ demo: d, video: i === 4, id: 'd' + i, by: by[i] })), true);
      return;
    }
    get('list').then(r => { if (r.ok) renderGallery(r.items); }).catch(() => {});
  }

  // ---------- full-screen viewer: swipe left/right, swipe down to close ----------
  let lastFocus = null, soundOn = false, feedObs = null, feedItems = [], cur = 0;
  const videoCache = {};
  function loadVideo(it){
    if (videoCache[it.id]) return Promise.resolve(videoCache[it.id]);
    if (DEMO) return Promise.reject();
    return fetch(S.UPLOAD_LINK + '?action=video&id=' + encodeURIComponent(it.id) + q()).then(r => r.json()).then(r => {
      if (!r.ok) throw r.error;
      return (videoCache[it.id] = URL.createObjectURL(b64Blob(r.data, r.mime)));
    });
  }
  function slide(it, idx){
    const sl = document.createElement('section'); sl.className = 'feed-item'; sl._idx = idx; sl._item = it;
    const bg = document.createElement('div'); bg.className = 'feed-bg'; sl.appendChild(bg);
    if (it.demo) { const d = document.createElement('div'); d.className = 'feed-demo'; d.style.background = it.demo; sl.appendChild(d); }
    else if (it.video) {
      const v = document.createElement('video'); v.className = 'feed-media'; v.playsInline = true; v.loop = true; v.muted = !soundOn; v.preload = 'none';
      v.setAttribute('playsinline', ''); v.poster = thumb(it.id, 800);
      sl.appendChild(v); sl._video = v;
      const load = document.createElement('div'); load.className = 'feed-load'; load.textContent = T.loadingVideo; sl.appendChild(load); sl._load = load;
      v.onclick = () => { setSound(!soundOn); };
    } else {
      const im = document.createElement('img'); im.className = 'feed-media'; im.alt = '';
      im.onerror = () => mqImg(im, it.id, 'big');
      im.onload = () => { if (im.naturalWidth < 20) return mqImg(im, it.id, 'big'); bg.style.backgroundImage = 'url("' + im.src + '")'; };
      im.loading = 'lazy'; im.src = thumb(it.id, 1600); sl.appendChild(im);
    }
    const info = document.createElement('div'); info.className = 'feed-info';
    const nm = document.createElement('b'); nm.textContent = S.NAME || ''; info.appendChild(nm);
    if (it.by) { const by = document.createElement('div'); by.textContent = T.by + ' ' + it.by; info.appendChild(by); }
    sl.appendChild(info);
    return sl;
  }
  function paintActions(){
    const it = feedItems[cur]; if (!it) return;
    $('feedPos').textContent = (cur + 1) + ' / ' + feedItems.length;
    const on = favs.has(it.id);
    $('feedFav').innerHTML = heart(on); $('feedFav').setAttribute('aria-pressed', on);
    $('feedDlText').textContent = it.video ? T.dlVideo : T.dlPhoto;
  }
  function activate(sl){
    cur = sl._idx; paintActions();
    document.querySelectorAll('.feed-item video').forEach(v => { if (v !== sl._video) v.pause(); });
    if (!sl._video) return;
    const v = sl._video;
    const play = () => { v.muted = !soundOn; v.play().catch(() => { v.muted = true; v.play().catch(() => {}); }); };
    if (v.src) return play();
    sl._load.style.display = 'flex';
    loadVideo(sl._item).then(url => { v.src = url; sl._load.style.display = 'none'; play(); })
      .catch(() => { sl._load.textContent = T.videoFail; });
  }
  function setSound(on){
    soundOn = on; $('feedSound').innerHTML = on ? '&#128266;' : '&#128263;';
    document.querySelectorAll('.feed-item video').forEach(v => v.muted = !on);
    if (on && !song.paused) { song.pause(); $('musicBtn').classList.add('off'); }
  }
  $('feedSound').onclick = () => setSound(!soundOn);
  function openFeed(i){
    feedItems = shownItems(); if (!feedItems.length) return;
    i = Math.max(0, Math.min(i, feedItems.length - 1)); cur = i;
    lastFocus = document.activeElement;
    const list = $('feedList'); list.textContent = '';
    feedItems.forEach((it, k) => list.appendChild(slide(it, k)));
    $('feed').hidden = false; document.body.style.overflow = 'hidden';
    if (feedObs) feedObs.disconnect();
    feedObs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting && e.intersectionRatio > .6) activate(e.target); }), { root: list, threshold: [.6] });
    list.querySelectorAll('.feed-item').forEach(el => feedObs.observe(el));
    list.scrollLeft = list.clientWidth * i;
    requestAnimationFrame(() => { list.scrollLeft = list.clientWidth * i; });
    paintActions();
    $('feedHint').classList.add('on'); setTimeout(() => $('feedHint').classList.remove('on'), 2500);
    $('feedClose').focus();
  }
  function closeFeed(){
    document.querySelectorAll('.feed-item video').forEach(v => v.pause());
    if (feedObs) feedObs.disconnect();
    const f = $('feed'); f.hidden = true; f.style.transform = ''; f.style.opacity = '';
    document.body.style.overflow = ''; $('feedList').textContent = '';
    draw();
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  }
  $('feedClose').onclick = closeFeed;
  $('feedPrev').onclick = () => { const l = $('feedList'); l.scrollBy({ left: -l.clientWidth, behavior: 'smooth' }); };
  $('feedNext').onclick = () => { const l = $('feedList'); l.scrollBy({ left: l.clientWidth, behavior: 'smooth' }); };
  $('feed').addEventListener('keydown', e => {
    const l = $('feedList');
    if (e.key === 'Escape') closeFeed();
    if (e.key === 'ArrowRight') { e.preventDefault(); l.scrollBy({ left: l.clientWidth, behavior: 'smooth' }); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); l.scrollBy({ left: -l.clientWidth, behavior: 'smooth' }); }
  });
  // swipe down to close
  let sx = 0, sy = 0, down = false;
  $('feedList').addEventListener('touchstart', e => { if (e.touches.length !== 1) return; sx = e.touches[0].clientX; sy = e.touches[0].clientY; down = true; }, { passive: true });
  $('feedList').addEventListener('touchmove', e => {
    if (!down) return; const dx = e.touches[0].clientX - sx, dy = e.touches[0].clientY - sy;
    if (dy > 10 && dy > Math.abs(dx) * 1.3) { const f = $('feed'); f.style.transform = 'translateY(' + dy + 'px)'; f.style.opacity = String(Math.max(.4, 1 - dy / 600)); }
  }, { passive: true });
  $('feedList').addEventListener('touchend', e => {
    if (!down) return; down = false;
    const t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy, f = $('feed');
    if (dy > 110 && dy > Math.abs(dx) * 1.3) closeFeed();
    else { f.style.transform = ''; f.style.opacity = ''; }
  });

  // private favourites: only this phone knows
  $('feedFav').onclick = () => {
    const it = feedItems[cur]; if (!it) return;
    if (favs.has(it.id)) { favs.delete(it.id); toast(T.favOff); } else { favs.add(it.id); toast(T.favOn); }
    saveFavs(); paintActions();
  };

  // download + share
  async function fileOf(it){
    if (it.demo) throw 'demo';
    if (it.video) { const url = await loadVideo(it); const b = await fetch(url).then(r => r.blob()); return new File([b], fname(it, b.type), { type: b.type }); }
    const r = await fetch(S.UPLOAD_LINK + '?action=img&id=' + encodeURIComponent(it.id) + '&size=big' + q()).then(r => r.json());
    if (!r.ok) throw r.error;
    const b = b64Blob(r.data, r.mime); return new File([b], fname(it, r.mime), { type: r.mime });
  }
  function fname(it, mime){
    const ext = /mp4/.test(mime) ? 'mp4' : /webm/.test(mime) ? 'webm' : /quicktime/.test(mime) ? 'mov' : /png/.test(mime) ? 'png' : 'jpg';
    return ((S.NAME || 'party') + '-' + (it.by ? it.by + '-' : '') + String(it.id).slice(-5)).replace(/[^\w-]+/g, '_') + '.' + ext;
  }
  let busy = false;
  $('feedDl').onclick = async () => {
    const it = feedItems[cur]; if (!it || busy) return;
    if (it.demo) return toast(T.demoOnly);
    busy = true; toast(T.preparing);
    try {
      const f = await fileOf(it);
      const a = document.createElement('a'); a.href = URL.createObjectURL(f); a.download = f.name;
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 30000);
      toast(T.saved);
    } catch (e) { toast(T.dlFail); }
    busy = false;
  };
  $('feedShare').onclick = async () => {
    const it = feedItems[cur]; if (!it || busy) return;
    const link = location.href.split('#')[0], text = (S.NAME || '') + (S.TITLE ? ' · ' + S.TITLE : '');
    if (!it.demo && navigator.canShare) {
      busy = true; toast(T.preparing);
      try {
        const f = await fileOf(it);
        if (navigator.canShare({ files: [f] })) { busy = false; await navigator.share({ files: [f], title: text }); return; }
      } catch (e) { busy = false; if (e && e.name === 'AbortError') return; }
      busy = false;
    }
    if (navigator.share) { try { await navigator.share({ title: text, text: text, url: link }); return; } catch (e) { if (e && e.name === 'AbortError') return; } }
    window.open('https://wa.me/?text=' + encodeURIComponent(text + ' ' + link), '_blank', 'noopener');
  };

  // ---------- + Add sheet ----------
  let sheetFocus = null;
  function openSheet(){
    if (CLOSED) return;
    sheetFocus = document.activeElement;
    const nm = $('guestName').value.trim();
    $('welcome').hidden = !nm; $('welcome').textContent = nm ? T.welcomeBack(nm) : '';
    $('sheetForm').hidden = false; $('sheetProg').hidden = true; $('status').textContent = ''; $('sheetClose').hidden = false;
    $('sheet').hidden = false; document.body.style.overflow = 'hidden';
    setTimeout(() => (nm ? $('takeBtn') : $('guestName')).focus(), 50);
  }
  function closeSheet(){ if (uploading) return; $('sheet').hidden = true; document.body.style.overflow = ''; if (sheetFocus) sheetFocus.focus(); }
  $('addBtn').onclick = openSheet;
  $('sheetClose').onclick = closeSheet;
  $('sheetDim').onclick = closeSheet;
  $('sheet').addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });
  function rememberName(){ const n = $('guestName').value.trim(); store.set('mq_guest_name', n); if (n && !$('wName').value) $('wName').value = n; }
  $('guestName').addEventListener('change', rememberName);

  // ---------- record short video (in the page) ----------
  const REC_MAX = 15;
  let stream = null, recorder = null, chunks = [], facing = 'environment', recBlob = null, recTimer = null, recLeft = REC_MAX;
  function recMime(){
    const opts = ['video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];
    for (const m of opts) if (window.MediaRecorder && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m)) return m;
    return '';
  }
  function fmt(s){ return '0:' + String(Math.max(0, s)).padStart(2, '0'); }
  async function startCam(){
    if (stream) stream.getTracks().forEach(t => t.stop());
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facing, width: { ideal: 720 }, height: { ideal: 1280 } }, audio: true });
    $('recLive').srcObject = stream; $('recLive').hidden = false; $('recPlay').hidden = true;
  }
  function stopCam(){ if (stream) stream.getTracks().forEach(t => t.stop()); stream = null; }
  async function openRec(){
    rememberName();
    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder && recMime())) return $('vidInput').click();
    $('rec').hidden = false; document.body.style.overflow = 'hidden';
    resetRec();
    try { await startCam(); } catch (e) { closeRec(); $('vidInput').click(); }
  }
  function resetRec(){
    recBlob = null; chunks = []; recLeft = REC_MAX; $('recTime').textContent = fmt(REC_MAX);
    $('recDot').hidden = false; $('recDot').classList.remove('on'); $('recAfter').hidden = true; $('recMsg').textContent = '';
    $('recFlip').hidden = false; $('recPlay').hidden = true; $('recPlay').removeAttribute('src'); $('recLive').hidden = false;
  }
  function closeRec(){ clearInterval(recTimer); if (recorder && recorder.state === 'recording') recorder.stop(); stopCam(); $('rec').hidden = true; document.body.style.overflow = $('sheet').hidden ? '' : 'hidden'; }
  function startRec(){
    chunks = []; const mime = recMime();
    recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 1500000, audioBitsPerSecond: 96000 });
    recorder.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
    recorder.onstop = () => {
      clearInterval(recTimer);
      recBlob = new Blob(chunks, { type: (mime.split(';')[0]) || 'video/webm' });
      stopCam();
      const pv = $('recPlay'); pv.src = URL.createObjectURL(recBlob); pv.hidden = false; $('recLive').hidden = true; pv.play().catch(() => {});
      $('recDot').hidden = true; $('recAfter').hidden = false; $('recFlip').hidden = true;
    };
    recorder.start(250);
    $('recDot').classList.add('on'); $('recDot').setAttribute('aria-label', 'Stop recording'); $('recFlip').hidden = true;
    recLeft = REC_MAX; $('recTime').textContent = fmt(recLeft);
    recTimer = setInterval(() => { recLeft--; $('recTime').textContent = fmt(recLeft); if (recLeft <= 0) recorder.stop(); }, 1000);
  }
  $('recBtn').onclick = openRec;
  $('recClose').onclick = closeRec;
  $('recFlip').onclick = () => { facing = facing === 'environment' ? 'user' : 'environment'; startCam().catch(() => {}); };
  $('recDot').onclick = () => { if (recorder && recorder.state === 'recording') recorder.stop(); else if (stream) startRec(); };
  $('recRetake').onclick = async () => { resetRec(); try { await startCam(); } catch(e){} };
  $('recSend').onclick = async () => {
    if (!recBlob) return;
    const ext = /mp4/.test(recBlob.type) ? 'mp4' : 'webm';
    const file = new File([recBlob], 'video.' + ext, { type: recBlob.type });
    closeRec();
    await uploadFiles([file]);
  };

  // ---------- upload ----------
  $('takeBtn').onclick = () => { rememberName(); $('camInput').click(); };
  $('chooseBtn').onclick = () => { rememberName(); $('fileInput').click(); };
  ['camInput','vidInput','fileInput'].forEach(i => $(i).onchange = handleFiles);

  async function handleFiles(e){
    let files = Array.from(e.target.files || []);
    e.target.value = '';
    if (!files.length) return;
    let extra = '';
    if (files.length > MAX_FILES) { files = files.slice(0, MAX_FILES); extra = T.max10; }
    return uploadFiles(files, extra);
  }
  let uploading = false;
  async function uploadFiles(files, extra){
    if ($('sheet').hidden) openSheet();
    rememberName();
    const guest = $('guestName').value.trim();
    uploading = true;
    $('sheetForm').hidden = true; $('sheetProg').hidden = false; $('sheetClose').hidden = true; $('status').textContent = extra || '';
    const fill = $('barFill');
    let done = 0, failed = 0, lastErr = '', tooBig = 0;
    for (let i = 0; i < files.length; i++) {
      if (!/^image\//.test(files[i].type || '') && files[i].size > MAX_MB * 1024 * 1024) { tooBig++; continue; }
      $('progText').textContent = T.uploading(i + 1, files.length);
      fill.style.width = Math.round((i + .3) / files.length * 100) + '%';
      try {
        const payload = await prepare(files[i]);
        if (DEMO) { await new Promise(r => setTimeout(r, 500)); done++; continue; }
        const r = await post(Object.assign({ type: 'upload', guest }, payload));
        if (r.ok) { done++; if (r.id) { mine.add(r.id); saveMine(); } } else { failed++; lastErr = r.error; }
      } catch (err) { failed++; }
      fill.style.width = Math.round((i + 1) / files.length * 100) + '%';
    }
    fill.style.width = '100%';
    uploading = false;
    const msg = tooBig && !done && !failed ? T.tooBig : (failed ? (/closed/i.test(lastErr) ? T.closed : T.partFail(done, failed)) : T.thanks(done) + (tooBig ? ' ' + T.tooBig : ''));
    if (failed || (tooBig && !done)) {
      $('progText').textContent = msg; $('status').textContent = '';
      $('sheetProg').hidden = false; $('sheetForm').hidden = false; $('sheetClose').hidden = false;
    } else {
      setTimeout(() => { $('sheet').hidden = true; document.body.style.overflow = ''; fill.style.width = '0'; }, 700);
      toast(msg);
    }
    if (tab !== 'g') setTab('g');
    window.scrollTo(0, 0);
    if (!DEMO) get('list').then(r => { if (r.ok) renderGallery(r.items, true); }).catch(() => {});
  }

  function prepare(file){
    return new Promise((resolve, reject) => {
      const isImg = /^image\/(jpeg|png|webp|heic|heif)$/i.test(file.type) || (!file.type && /\.(jpe?g|png|heic)$/i.test(file.name));
      const raw = () => {
        if (file.size > MAX_MB * 1024 * 1024) return reject('File too big');
        const fr = new FileReader();
        fr.onload = () => resolve({ name: file.name, mime: file.type || 'video/mp4', data: fr.result.split(',')[1] });
        fr.onerror = reject; fr.readAsDataURL(file);
      };
      if (!isImg) return raw();
      const url = URL.createObjectURL(file), img = new Image();
      img.onload = () => {
        const max = 2048, s = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        resolve({ name: (file.name || 'photo').replace(/\.\w+$/, '') + '.jpg', mime: 'image/jpeg', data: c.toDataURL('image/jpeg', 0.85).split(',')[1] });
      };
      img.onerror = () => { URL.revokeObjectURL(url); raw(); };
      img.src = url;
    });
  }

  // ---------- wishes ----------
  let wishList = [];
  function renderWishes(items){
    wishList = items;
    const box = $('wishes'); box.textContent = '';
    items.forEach(w => {
      const d = document.createElement('div'); d.className = 'wish';
      const b = document.createElement('b'); b.textContent = w.name;
      const t = document.createElement('div'); t.textContent = w.message;
      d.appendChild(b); d.appendChild(t); box.appendChild(d);
    });
    $('wishN').textContent = items.length ? items.length : '';
    $('wishEmpty').hidden = !!items.length;
  }
  function loadWishes(){
    if (DEMO) { if (!wishList.length) renderWishes([{ name: 'Aunty Mai', message: 'Happy birthday sayang! Stay sweet and pretty. 🎂' }, { name: 'Lisa', message: 'Best party ever! Love you! ❤️' }, { name: 'Uncle Rizal', message: 'Semoga dimurahkan rezeki!' }]); return Promise.resolve(); }
    return get('wishes').then(r => { if (r.ok) renderWishes(r.items); }).catch(() => {});
  }
  $('wishForm').onsubmit = e => {
    e.preventDefault();
    const name = $('wName').value.trim() || 'Guest', message = $('wMsg').value.trim();
    if (!message) { $('wishStatus').textContent = T.wishEmpty; return; }
    $('wishStatus').textContent = T.wishSending;
    if (!$('guestName').value.trim() && name !== 'Guest') { $('guestName').value = name; store.set('mq_guest_name', name); }
    const finish = () => { $('wMsg').value = ''; $('wishStatus').textContent = T.wishThanks; if (DEMO) renderWishes([{ name, message }].concat(wishList)); else loadWishes(); };
    if (DEMO) return finish();
    post({ type: 'wish', name, message })
      .then(r => r.ok ? finish() : ($('wishStatus').textContent = /closed/i.test(r.error) ? T.closed : T.wishFail))
      .catch(() => $('wishStatus').textContent = T.noSignal);
  };

  // ---------- bullet wishes on the cover ----------
  let bulletTimer = null, bi = 0, lane = 0;
  function bullet(){
    if (!wishList.length) return;
    const w = wishList[bi++ % wishList.length];
    const el = document.createElement('div'); el.className = 'bullet';
    const b = document.createElement('b'); b.textContent = w.name + ': ';
    el.appendChild(b); el.appendChild(document.createTextNode(w.message.length > 60 ? w.message.slice(0, 58) + '...' : w.message));
    el.style.top = [3, 10, 84, 17, 91, 77][lane++ % 6] + '%';   // keep clear of the name in the middle
    el.style.animationDuration = (9 + Math.random() * 4) + 's';
    $('bullets').appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }
  function stopBullets(){ clearInterval(bulletTimer); $('bullets').textContent = ''; }
  setTab('g');
  loadWishes().then(() => { if ($('cover').style.display !== 'none' && wishList.length) { bullet(); bulletTimer = setInterval(bullet, 2200); } });
})();
