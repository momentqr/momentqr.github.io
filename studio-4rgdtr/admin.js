/* Momentqr Studio - shared login, menu and helpers for all admin pages. */
(function(){
  const API = window.MOMENTQR_API;
  const ROOT = new URL('../', location.href).href;
  const page = (document.body.dataset.page || '');
  let PIN = '';
  // remember the PIN on this computer for 12 hours (all Studio tabs); "Lock" forgets it
  try { const m = JSON.parse(localStorage.getItem('mq_pin') || 'null'); if (m && m.t > Date.now() - 12 * 3600e3) PIN = m.p; else localStorage.removeItem('mq_pin'); } catch(e){}

  // header + menu
  document.body.insertAdjacentHTML('afterbegin', `
<div id="lock" role="dialog" aria-modal="true" aria-labelledby="lockTitle" ${PIN ? 'style="display:none"' : ''}>
  <form id="lockForm">
    <h2 id="lockTitle">Momentqr Studio</h2>
    <label for="pin" style="font-size:14px;color:#555">Enter PIN</label>
    <input type="password" id="pin" inputmode="numeric" autocomplete="off" maxlength="12">
    <button class="btn main" type="submit" id="pinBtn">Unlock</button>
    <div class="msg err" id="pinMsg" role="status"></div>
  </form>
</div>
<header>
  <h1>Momentqr Studio</h1>
  <div class="hbtns"><a href="../" target="_blank" rel="noopener">Home page</a><button type="button" id="logout">Lock</button></div>
</header>
<nav class="tabs" aria-label="Studio pages">
  <a href="./" ${page === 'dash' ? 'class="on" aria-current="page"' : ''}>Dashboard</a>
  <a href="client.html" ${page === 'client' ? 'class="on" aria-current="page"' : ''}>+ New / Edit client</a>
  <a href="photos.html" ${page === 'photos' ? 'class="on" aria-current="page"' : ''}>Photos</a>
  <a href="wishes.html" ${page === 'wishes' ? 'class="on" aria-current="page"' : ''}>Wishes</a>
  <a href="business.html" ${page === 'biz' ? 'class="on" aria-current="page"' : ''}>Business</a>
</nav>`);

  const $ = id => document.getElementById(id);
  const readyFns = [];
  function api(body){
    return fetch(API, { method: 'POST', body: JSON.stringify(Object.assign({ type: 'admin', pin: PIN }, body)) })
      .then(r => r.json()).then(r => { if (!r.ok && r.error === 'Wrong PIN') logout(); return r; });
  }
  function logout(){ try { localStorage.removeItem('mq_pin'); } catch(e){} location.reload(); }
  function start(){ $('lock').style.display = 'none'; readyFns.forEach(f => { try { f(); } catch (e) { console.error(e); } }); }

  if (!API) $('pinMsg').textContent = 'Not connected: app/config.js has no script link.';
  $('logout').onclick = logout;
  $('lockForm').onsubmit = e => {
    e.preventDefault(); if (!API) return;
    $('pinBtn').disabled = true; $('pinMsg').textContent = 'Checking...';
    PIN = $('pin').value.trim();
    fetch(API, { method: 'POST', body: JSON.stringify({ type: 'admin', pin: PIN, op: 'check' }) }).then(r => r.json()).then(r => {
      $('pinBtn').disabled = false;
      if (!r.ok) { $('pinMsg').textContent = r.error === 'Wrong PIN' ? 'Wrong PIN' : 'Error: ' + r.error; $('pin').value = ''; return; }
      try { localStorage.setItem('mq_pin', JSON.stringify({ p: PIN, t: Date.now() })); } catch(e){}
      start();
    }).catch(() => { $('pinBtn').disabled = false; $('pinMsg').textContent = 'No connection. Try again.'; });
  };
  if (!PIN) setTimeout(() => $('pin').focus(), 50);

  window.MQA = {
    API, ROOT, api,
    ready(fn){ if (PIN && $('lock').style.display === 'none') setTimeout(fn, 0); else readyFns.push(fn); },
    say(id, t, err){ const el = $(id); if (!el) return; el.textContent = t; el.className = 'msg ' + (err ? 'err' : 'ok'); },
    esc: t => String(t == null ? '' : t).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])),
    thumb: (id, w) => 'https://drive.google.com/thumbnail?id=' + encodeURIComponent(id) + '&sz=w' + (w || 400),
    guestLink: code => ROOT + 'p/?c=' + code,
    tvLink: code => ROOT + 'p/tv.html?c=' + code,
    param: k => new URLSearchParams(location.search).get(k) || '',
    // load picture via script when Drive link is not public
    img(imgEl, code, id, size){
      imgEl.onerror = () => { if (imgEl.dataset.mq) return; imgEl.dataset.mq = 1;
        fetch(API + '?action=img&size=' + (size || 'small') + '&id=' + encodeURIComponent(id) + '&code=' + encodeURIComponent(code))
          .then(r => r.json()).then(r => { if (r.ok) imgEl.src = 'data:' + r.mime + ';base64,' + r.data; }).catch(() => {}); };
      imgEl.src = window.MQA.thumb(id, size === 'big' ? 1600 : 400);
    },
    // client picker shared by photos / wishes pages
    clientPicker(selectId, onPick){
      const sel = $(selectId);
      api({ op: 'listClients' }).then(r => {
        if (!r.ok) return;
        sel.innerHTML = '<option value="">Choose a client...</option>';
        r.items.forEach(c => { const o = document.createElement('option'); o.value = c.code; o.textContent = (c.NAME || '(no name)') + (c.DATE ? ' · ' + c.DATE : ''); sel.appendChild(o); });
        const want = window.MQA.param('code'); if (want) { sel.value = want; onPick(want); }
      });
      sel.onchange = () => { const v = sel.value; history.replaceState(null, '', v ? '?code=' + v : location.pathname); if (v) onPick(v); };
    }
  };
})();
