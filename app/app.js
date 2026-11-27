/* Birthday Gallery app - shared by every client page. Do not edit. */
(function(){
  document.body.insertAdjacentHTML('afterbegin', `
<div class="bgimg" id="bgimg"></div>
<div class="veil" id="veil"></div>

<button id="musicBtn" aria-label="Music on or off">
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--main)"><path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/></svg>
</button>
<audio id="song" loop preload="auto"></audio>

<!-- COVER -->
<section id="cover">
  <div class="kick" id="inviteLine"></div>
  <img class="avatar" id="coverPhoto" alt="">
  <h1 class="name" id="coverName"></h1>
  <p class="title" id="coverTitle"></p>
  <p class="date" id="coverDate"></p>
  <button class="btn" id="openBtn">Tap to open</button>
  <div class="hint" id="musicHint">music will play</div>
</section>

<!-- MAIN -->
<main id="main"><div class="wrap">
  <div class="demo" id="demo" style="display:none">Demo mode: paste UPLOAD_LINK in SETTINGS to turn on real uploads.</div>
  <img class="top-photo" id="mainPhoto" alt="">
  <h1 class="name" id="mainName"></h1>
  <p class="title" id="mainTitle"></p>
  <p class="msg" id="mainMsg"></p>

  <div class="card">
    <h2>Share your photos</h2>
    <p class="small">Pick photos or short videos from your phone. No login needed.</p>
    <button class="btn wide" id="uploadBtn">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>
      Upload photos
    </button>
    <input type="file" id="fileInput" accept="image/*,video/*" multiple>
    <div class="bar" id="bar"><i id="barFill"></i></div>
    <div id="status" role="status"></div>
  </div>

  <div class="card">
    <h2>Gallery</h2>
    <div class="count" id="count"></div>
    <div class="grid" id="grid"></div>
    <div class="empty" id="empty">No photos yet. Be the first to upload!</div>
  </div>

  <div class="card">
    <h2>Birthday wishes</h2>
    <form id="wishForm">
      <label for="wName">Your name</label>
      <input type="text" id="wName" maxlength="40" autocomplete="name">
      <label for="wMsg">Your wish</label>
      <textarea id="wMsg" maxlength="300"></textarea>
      <button class="btn ghost wide" type="submit">Send wish</button>
    </form>
    <div id="wishStatus" class="count" style="margin-top:8px" role="status"></div>
    <div id="wishes"></div>
  </div>

  <div class="foot">Made with love for <span id="footName"></span></div>
</div></main>
`);
})();
(function(){
  const S = SETTINGS;
  const $ = id => document.getElementById(id);
  const DEMO = !S.UPLOAD_LINK;
  const MAX_MB = 25;

  // ---------- apply settings ----------
  document.body.className = (S.THEME || 'blush').toLowerCase();
  if (S.BG_COLOR) document.documentElement.style.setProperty('--bg', S.BG_COLOR);
  if (S.BG_IMAGE) $('bgimg').style.backgroundImage = 'url("' + encodeURI(S.BG_IMAGE) + '")';
  else $('veil').style.display = 'none';
  document.title = S.NAME + "'s " + S.TITLE;
  $('inviteLine').textContent = S.INVITE_LINE;
  ['coverName','mainName'].forEach(i => $(i).textContent = S.NAME);
  ['coverTitle','mainTitle'].forEach(i => $(i).textContent = S.TITLE);
  $('coverDate').textContent = S.DATE;
  $('mainMsg').textContent = S.MESSAGE;
  $('footName').textContent = S.NAME;
  ['coverPhoto','mainPhoto'].forEach(i => {
    if (S.PHOTO) { $(i).src = S.PHOTO; $(i).alt = S.NAME; $(i).onerror = () => $(i).style.display = 'none'; }
    else $(i).style.display = 'none';
  });
  if (DEMO) $('demo').style.display = 'block';

  // ---------- music ----------
  const song = $('song');
  let hasSong = !!S.SONG;
  if (hasSong) { song.src = S.SONG; song.onerror = () => { hasSong = false; $('musicBtn').style.display = 'none'; }; }
  else $('musicHint').style.display = 'none';

  $('openBtn').onclick = () => {
    $('cover').style.display = 'none';
    $('main').style.display = 'block';
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

  // ---------- network helpers ----------
  function post(obj){
    return fetch(S.UPLOAD_LINK, { method:'POST', body: JSON.stringify(obj) }).then(r => r.json());
  }
  function get(action){
    return fetch(S.UPLOAD_LINK + '?action=' + action).then(r => r.json());
  }

  // ---------- gallery ----------
  function thumb(id){ return 'https://drive.google.com/thumbnail?id=' + encodeURIComponent(id) + '&sz=w600'; }
  function view(id){ return 'https://drive.google.com/file/d/' + encodeURIComponent(id) + '/view'; }

  function renderGallery(items){
    const grid = $('grid');
    grid.textContent = '';
    $('empty').style.display = items.length ? 'none' : 'block';
    $('count').textContent = items.length ? items.length + (items.length === 1 ? ' photo' : ' photos & videos') : '';
    items.forEach(it => {
      const a = document.createElement('a');
      a.target = '_blank'; a.rel = 'noopener';
      if (it.demo) { a.href = '#'; a.style.background = it.demo; a.onclick = e => e.preventDefault(); }
      else {
        a.href = view(it.id);
        const img = document.createElement('img');
        img.loading = 'lazy'; img.alt = 'Guest photo'; img.src = thumb(it.id);
        a.appendChild(img);
      }
      if (it.video) {
        const p = document.createElement('div'); p.className = 'play';
        p.innerHTML = '<span><svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg></span>';
        a.appendChild(p);
      }
      grid.appendChild(a);
    });
  }

  function loadGallery(){
    if (DEMO) {
      const c = ['#F7C6D3','#CDE7F5','#FFE5A6','#D9CCF5','#CFEBD9','#F9D7C3','#F4C6D2','#E8D9F7','#FFD6E2'];
      renderGallery(c.map((d,i) => ({ demo:d, video: i===4 })));
      return;
    }
    get('list').then(r => { if (r.ok) renderGallery(r.items); }).catch(() => {});
  }

  // ---------- upload ----------
  $('uploadBtn').onclick = () => $('fileInput').click();
  $('fileInput').onchange = async e => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (!files.length) return;
    const status = $('status'), bar = $('bar'), fill = $('barFill');
    bar.style.display = 'block';
    let done = 0, failed = 0;
    for (let i = 0; i < files.length; i++) {
      status.textContent = 'Uploading ' + (i + 1) + ' of ' + files.length + '...';
      fill.style.width = Math.round(i / files.length * 100) + '%';
      try {
        const payload = await prepare(files[i]);
        if (DEMO) { await new Promise(r => setTimeout(r, 600)); done++; continue; }
        const r = await post(payload);
        if (r.ok) done++; else { failed++; console.warn(r.error); }
      } catch (err) { failed++; console.warn(err); }
    }
    fill.style.width = '100%';
    status.textContent = failed
      ? done + ' uploaded, ' + failed + ' could not upload (too big or no signal). Try again.'
      : 'Thank you! ' + done + (done === 1 ? ' photo' : ' photos') + ' added.';
    setTimeout(() => { bar.style.display = 'none'; fill.style.width = '0'; }, 1500);
    loadGallery();
  };

  // shrink big photos so uploads are fast; videos go as they are (max 25 MB)
  function prepare(file){
    return new Promise((resolve, reject) => {
      const isImg = /^image\/(jpeg|png|webp|heic|heif)$/i.test(file.type);
      if (!isImg) {
        if (file.size > MAX_MB * 1024 * 1024) return reject('File too big');
        const fr = new FileReader();
        fr.onload = () => resolve({ name: file.name, mime: file.type || 'video/mp4', data: fr.result.split(',')[1] });
        fr.onerror = reject; fr.readAsDataURL(file); return;
      }
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const max = 2048, s = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        const data = c.toDataURL('image/jpeg', 0.85).split(',')[1];
        resolve({ name: file.name.replace(/\.\w+$/, '') + '.jpg', mime: 'image/jpeg', data });
      };
      img.onerror = () => {   // browser cannot read it: send original
        URL.revokeObjectURL(url);
        if (file.size > MAX_MB * 1024 * 1024) return reject('File too big');
        const fr = new FileReader();
        fr.onload = () => resolve({ name: file.name, mime: file.type, data: fr.result.split(',')[1] });
        fr.onerror = reject; fr.readAsDataURL(file);
      };
      img.src = url;
    });
  }

  // ---------- wishes ----------
  function renderWishes(items){
    const box = $('wishes'); box.textContent = '';
    items.forEach(w => {
      const d = document.createElement('div'); d.className = 'wish';
      const b = document.createElement('b'); b.textContent = w.name;
      const t = document.createElement('div'); t.textContent = w.message;
      d.appendChild(b); d.appendChild(t); box.appendChild(d);
    });
  }
  function loadWishes(){
    if (DEMO) { renderWishes([{name:'Aunty Mai',message:'Happy birthday sayang! Stay sweet and pretty.'},{name:'Lisa',message:'Best party ever! Love you!'}]); return; }
    get('wishes').then(r => { if (r.ok) renderWishes(r.items); }).catch(() => {});
  }
  $('wishForm').onsubmit = e => {
    e.preventDefault();
    const name = $('wName').value.trim() || 'Guest', message = $('wMsg').value.trim();
    if (!message) { $('wishStatus').textContent = 'Please write a wish first.'; return; }
    $('wishStatus').textContent = 'Sending...';
    const finish = () => { $('wMsg').value = ''; $('wishStatus').textContent = 'Thank you for your wish!'; loadWishes(); };
    if (DEMO) return finish();
    post({ type:'wish', name, message })
      .then(r => r.ok ? finish() : ($('wishStatus').textContent = 'Could not send. Try again.'))
      .catch(() => $('wishStatus').textContent = 'No signal. Try again.');
  };
})();
