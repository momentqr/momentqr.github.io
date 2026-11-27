/* Momentqr guest page. Shared by every client. Do not edit. */
(function(){
  const S = (typeof SETTINGS !== 'undefined' ? SETTINGS : window.SETTINGS) || {};
  const T = window.MQ_TEXT ? window.MQ_TEXT(S) : {};
  const DEMO = !S.UPLOAD_LINK;
  const MAX_MB = 25;
  const esc = t => String(t == null ? '' : t).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const camIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>';
  const vidIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="6" width="14" height="12" rx="2"/><path d="M16 10l6-3v10l-6-3"/></svg>';
  const picIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-8 8"/></svg>';

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
<main id="main"><div class="wrap">
  <div class="demo" id="demo" style="display:none">${esc(T.demo)}</div>
  <div class="kick" id="mainKick"></div>
  <img class="top-photo" id="mainPhoto" alt="">
  <h1 class="name" id="mainName"></h1>
  <p class="title" id="mainTitle"></p>
  <p class="msg" id="mainMsg"></p>

  <div class="card" id="uploadCard">
    <h2>${esc(T.shareTitle)}</h2>
    <p class="small" id="shareSub">${esc(T.shareSub)}</p>
    <div id="uploadControls">
      <label class="gname" for="guestName">${esc(T.yourName)}</label>
      <input type="text" id="guestName" maxlength="30" autocomplete="name">
      <div class="twobtn">
        <button class="btn wide" id="takeBtn">${camIcon} ${esc(T.take)}</button>
        <button class="btn wide" id="recBtn">${vidIcon} ${esc(T.record)}</button>
        <button class="btn wide ghost" id="chooseBtn">${picIcon} ${esc(T.choose)}</button>
      </div>
    </div>
    <input type="file" id="camInput" accept="image/*" capture="environment">
    <input type="file" id="vidInput" accept="video/*" capture="environment">
    <input type="file" id="fileInput" accept="image/*,video/*" multiple>
    <div class="bar" id="bar"><i id="barFill"></i></div>
    <div id="status" role="status"></div>
  </div>

  <div class="card">
    <h2>${esc(T.gallery)}</h2>
    <div class="count" id="count" hidden></div>
    <button type="button" class="gal-hero" id="watchAll" style="display:none">
      <span class="gal-bg" id="galBg"></span><span class="gal-shade"></span>
      <span class="gal-play" aria-hidden="true">&#9654;</span>
      <span class="gal-n" id="galN"></span>
      <span class="gal-sub">${esc(T.tapWatch)}</span>
    </button>
    <p class="gal-find" id="galFind" hidden>${esc(T.findYours)}</p>
    <div class="grid small" id="grid"></div>
    <div class="empty" id="empty">${esc(T.empty)}</div>
  </div>

  <div class="card">
    <h2>${esc(T.wishes)}</h2>
    <form id="wishForm">
      <label for="wName">${esc(T.wishName)}</label>
      <input type="text" id="wName" maxlength="40" autocomplete="name">
      <label for="wMsg">${esc(T.wishText)}</label>
      <textarea id="wMsg" maxlength="300"></textarea>
      <button class="btn ghost wide" type="submit">${esc(T.send)}</button>
    </form>
    <div id="wishStatus" class="count" style="margin-top:8px" role="status"></div>
    <div id="wishes"></div>
  </div>
  <div class="foot">${esc(T.madeFor)} <span id="footName"></span></div>
</div></main>

<div class="feed" id="feed" role="dialog" aria-modal="true" aria-label="Photo and video viewer" hidden>
  <div class="feed-list" id="feedList"></div>
  <button class="feed-close" id="feedClose" aria-label="${esc(T.close)}">&times;</button>
  <button class="feed-sound" id="feedSound" aria-label="Sound on or off">&#128263;</button>
  <div class="feed-hint" id="feedHint">${esc(T.swipe)}</div>
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
  ['coverTitle','mainTitle'].forEach(i => $(i).textContent = S.TITLE || '');
  $('coverDate').textContent = S.DATE || '';
  $('mainMsg').textContent = S.MESSAGE || '';
  $('footName').textContent = S.NAME || '';
  ['coverPhoto','mainPhoto'].forEach(i => {
    const im = $(i);
    if (S.PHOTO) { im.src = S.PHOTO; im.alt = S.NAME || '';
      im.onerror = () => { if (S.PHOTO_ID && !im.dataset.mq) mqImg(im, S.PHOTO_ID, 'big'); else im.style.display = 'none'; }; }
    else im.style.display = 'none';
  });
  if (DEMO) $('demo').style.display = 'block';
  try { const g = localStorage.getItem('mq_guest'); if (g) { $('guestName').value = g; $('wName').value = g; } } catch(e){}

  if (S.OPEN === false) {
    $('shareSub').textContent = T.closed;
    $('uploadControls').style.display = 'none';
    $('wishForm').style.display = 'none';
  }

  // ---------- network ----------
  const q = () => (S.CODE ? '&code=' + encodeURIComponent(S.CODE) : '');
  function post(obj){ if (S.CODE) obj.code = S.CODE; return fetch(S.UPLOAD_LINK, { method:'POST', body: JSON.stringify(obj) }).then(r => r.json()); }
  function get(action){ return fetch(S.UPLOAD_LINK + '?action=' + action + q()).then(r => r.json()); }

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
    setInterval(loadGallery, 30000);
  };
  $('musicBtn').onclick = () => {
    if (song.paused) { song.play(); $('musicBtn').classList.remove('off'); }
    else { song.pause(); $('musicBtn').classList.add('off'); }
  };

  // ---------- gallery ----------
  const thumb = (id, w) => 'https://drive.google.com/thumbnail?id=' + encodeURIComponent(id) + '&sz=w' + (w || 600);
  let gallery = [];
  function renderGallery(items){
    gallery = items;
    const grid = $('grid'); grid.textContent = '';
    $('empty').style.display = items.length ? 'none' : 'block';
    $('count').textContent = items.length ? T.photos(items.length) : '';
    $('watchAll').style.display = items.length ? '' : 'none';
    $('galN').textContent = items.length ? T.photos(items.length) : '';
    $('galFind').hidden = !items.length;
    const first = items[0], bg = $('galBg');
    if (first && first.demo) { bg.style.backgroundImage = ''; bg.style.background = first.demo; }
    else if (first && bg.dataset.id !== first.id) {
      bg.dataset.id = first.id;
      const im = new Image();
      im.onload = () => { if (im.naturalWidth > 20) bg.style.backgroundImage = 'url("' + im.src + '")'; else mqImg(im, first.id, 'small'); };
      im.onerror = () => mqImg(im, first.id, 'small');
      im.src = thumb(first.id, 600);
    }
    items.forEach((it, idx) => {
      const b = document.createElement('button');
      b.className = 'tile'; b.type = 'button';
      b.setAttribute('aria-label', (it.video ? T.video : 'Photo') + (it.by ? ' ' + T.by + ' ' + it.by : ''));
      if (it.demo) b.style.background = it.demo;
      else {
        const img = document.createElement('img');
        img.loading = 'lazy'; img.alt = '';
        img.onerror = () => mqImg(img, it.id, 'small', () => { if (it.video) { img.remove(); b.classList.add('vtile'); } });
        img.onload = () => { if (img.naturalWidth < 20) mqImg(img, it.id, 'small'); };
        img.src = thumb(it.id, 400);
        b.appendChild(img);
      }
      if (it.video) { const p = document.createElement('span'); p.className = 'play'; p.innerHTML = '<span><svg width="14" height="14" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></span>'; b.appendChild(p); }
      b.onclick = () => openLb(idx);
      grid.appendChild(b);
    });
  }
  function loadGallery(){
    if (DEMO) {
      const c = ['#F7C6D3','#CDE7F5','#FFE5A6','#D9CCF5','#CFEBD9','#F9D7C3','#F4C6D2','#E8D9F7','#FFD6E2'];
      if (!gallery.length) renderGallery(c.map((d, i) => ({ demo: d, video: i === 4, id: 'd' + i })));
      return;
    }
    get('list').then(r => { if (r.ok) renderGallery(r.items); }).catch(() => {});
  }

  // ---------- TikTok-style viewer ----------
  let lastFocus = null, soundOn = false, feedObs = null;
  const videoCache = {};
  function loadVideo(it){
    if (videoCache[it.id]) return Promise.resolve(videoCache[it.id]);
    if (DEMO) return Promise.reject();
    return fetch(S.UPLOAD_LINK + '?action=video&id=' + encodeURIComponent(it.id) + q()).then(r => r.json()).then(r => {
      if (!r.ok) throw r.error;
      const bin = atob(r.data), u8 = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
      return (videoCache[it.id] = URL.createObjectURL(new Blob([u8], { type: r.mime })));
    });
  }
  function slide(it){
    const sl = document.createElement('section'); sl.className = 'feed-item';
    const bg = document.createElement('div'); bg.className = 'feed-bg'; sl.appendChild(bg);
    if (it.demo) { const d = document.createElement('div'); d.className = 'feed-demo'; d.style.background = it.demo; sl.appendChild(d); }
    else if (it.video) {
      const v = document.createElement('video'); v.className = 'feed-media'; v.playsInline = true; v.loop = true; v.muted = !soundOn; v.preload = 'none';
      v.setAttribute('playsinline', ''); v.poster = thumb(it.id, 800);
      sl.appendChild(v); sl._video = v; sl._item = it;
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
    if (it.video) { const tag = document.createElement('span'); tag.className = 'feed-tag'; tag.textContent = T.video; info.appendChild(tag); }
    sl.appendChild(info);
    return sl;
  }
  function activate(sl){
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
    lastFocus = document.activeElement;
    const list = $('feedList'); list.textContent = '';
    gallery.forEach(it => list.appendChild(slide(it)));
    $('feed').hidden = false; document.body.style.overflow = 'hidden';
    if (feedObs) feedObs.disconnect();
    feedObs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting && e.intersectionRatio > .6) activate(e.target); }), { root: list, threshold: [.6] });
    list.querySelectorAll('.feed-item').forEach(el => feedObs.observe(el));
    list.scrollTop = list.clientHeight * i;
    requestAnimationFrame(() => { list.scrollTop = list.clientHeight * i; });
    $('feedHint').classList.add('on'); setTimeout(() => $('feedHint').classList.remove('on'), 2500);
    $('feedClose').focus();
  }
  function closeFeed(){
    document.querySelectorAll('.feed-item video').forEach(v => v.pause());
    if (feedObs) feedObs.disconnect();
    $('feed').hidden = true; document.body.style.overflow = ''; $('feedList').textContent = '';
    if (lastFocus) lastFocus.focus();
  }
  const openLb = openFeed;
  $('feedClose').onclick = closeFeed;
  $('watchAll').onclick = () => openFeed(0);
  $('feed').addEventListener('keydown', e => {
    const l = $('feedList');
    if (e.key === 'Escape') closeFeed();
    if (e.key === 'ArrowDown') { e.preventDefault(); l.scrollBy({ top: l.clientHeight, behavior: 'smooth' }); }
    if (e.key === 'ArrowUp') { e.preventDefault(); l.scrollBy({ top: -l.clientHeight, behavior: 'smooth' }); }
  });

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
  function closeRec(){ clearInterval(recTimer); if (recorder && recorder.state === 'recording') recorder.stop(); stopCam(); $('rec').hidden = true; document.body.style.overflow = ''; }
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
  $('vidInput').onchange = e => handleFiles(e);

  // ---------- upload ----------
  $('takeBtn').onclick = () => $('camInput').click();
  $('chooseBtn').onclick = () => $('fileInput').click();
  $('guestName').addEventListener('change', () => { try { localStorage.setItem('mq_guest', $('guestName').value.trim()); } catch(e){} });
  $('camInput').onchange = e => handleFiles(e);
  $('fileInput').onchange = e => handleFiles(e);

  async function handleFiles(e){
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (!files.length) return;
    return uploadFiles(files);
  }
  async function uploadFiles(files){
    const guest = $('guestName').value.trim();
    try { localStorage.setItem('mq_guest', guest); } catch(err){}
    const status = $('status'), bar = $('bar'), fill = $('barFill');
    bar.style.display = 'block';
    let done = 0, failed = 0, lastErr = '', tooBig = 0;
    for (let i = 0; i < files.length; i++) {
      if (!/^image\//.test(files[i].type || '') && files[i].size > MAX_MB * 1024 * 1024) { tooBig++; continue; }
      status.textContent = T.uploading(i + 1, files.length);
      fill.style.width = Math.round(i / files.length * 100) + '%';
      try {
        const payload = await prepare(files[i]);
        if (DEMO) { await new Promise(r => setTimeout(r, 500)); done++; continue; }
        const r = await post(Object.assign({ type: 'upload', guest }, payload));
        if (r.ok) done++; else { failed++; lastErr = r.error; }
      } catch (err) { failed++; }
    }
    fill.style.width = '100%';
    status.textContent = tooBig && !done && !failed ? T.tooBig : (failed ? (/closed/i.test(lastErr) ? T.closed : T.partFail(done, failed)) : T.thanks(done) + (tooBig ? ' ' + T.tooBig : ''));
    setTimeout(() => { bar.style.display = 'none'; fill.style.width = '0'; }, 1500);
    loadGallery();
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
  }
  function loadWishes(){
    if (DEMO) { renderWishes([{ name: 'Aunty Mai', message: 'Happy birthday sayang! Stay sweet and pretty.' }, { name: 'Lisa', message: 'Best party ever! Love you!' }, { name: 'Uncle Rizal', message: 'Semoga dimurahkan rezeki!' }]); return Promise.resolve(); }
    return get('wishes').then(r => { if (r.ok) renderWishes(r.items); }).catch(() => {});
  }
  $('wishForm').onsubmit = e => {
    e.preventDefault();
    const name = $('wName').value.trim() || 'Guest', message = $('wMsg').value.trim();
    if (!message) { $('wishStatus').textContent = T.wishEmpty; return; }
    $('wishStatus').textContent = T.wishSending;
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
  loadWishes().then(() => { if ($('cover').style.display !== 'none' && wishList.length) { bullet(); bulletTimer = setInterval(bullet, 2200); } });
})();
