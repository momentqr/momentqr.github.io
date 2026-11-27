/* Momentqr page texts (English / Bahasa Melayu) and event types. Shared. Do not edit. */
(function(){
  const EVENTS = {
    birthday:   { en: { kick: 'Happy Birthday',          wishes: 'Birthday wishes' },        ms: { kick: 'Selamat Hari Jadi',       wishes: 'Ucapan hari jadi' } },
    wedding:    { en: { kick: 'Happy Wedding Day',       wishes: 'Wishes for the couple' },  ms: { kick: 'Selamat Pengantin Baru',  wishes: 'Ucapan untuk pengantin' } },
    aqiqah:     { en: { kick: 'Aqiqah Celebration',      wishes: 'Doa & wishes' },           ms: { kick: 'Majlis Aqiqah',           wishes: 'Doa & ucapan' } },
    babyshower: { en: { kick: 'Baby Shower',             wishes: 'Wishes for baby' },        ms: { kick: 'Majlis Baby Shower',      wishes: 'Ucapan untuk si kecil' } },
    graduation: { en: { kick: 'Congratulations, Graduate', wishes: 'Congratulation messages' }, ms: { kick: 'Tahniah Graduan',      wishes: 'Ucapan tahniah' } },
    custom:     { en: { kick: '',                        wishes: 'Wishes' },                 ms: { kick: '',                        wishes: 'Ucapan' } }
  };
  const UI = {
    en: {
      tapOpen: 'Tap to open', musicHint: 'music will play', shareTitle: 'Share your photos',
      shareSub: 'Take a photo or pick from your phone. No login needed.', take: 'Take photo', choose: 'Choose from gallery',
      yourName: 'Your name (optional)', gallery: 'Gallery', empty: 'No photos yet. Be the first!',
      photos: n => n + (n === 1 ? ' photo' : ' photos & videos'), wishName: 'Your name', wishText: 'Your wish', send: 'Send wish',
      uploading: (i, n) => 'Uploading ' + i + ' of ' + n + '...', thanks: n => 'Thank you! ' + n + ' added to the gallery.', tooBig: 'That video is too long. Please keep videos under about 20 seconds (25 MB).',
      partFail: (d, f) => d + ' uploaded, ' + f + ' could not upload (too big or no signal). Try again.',
      closed: 'Uploads are closed. Thank you for all the photos!', wishThanks: 'Thank you for your wish!', wishEmpty: 'Please write a wish first.',
      wishSending: 'Sending...', wishFail: 'Could not send. Try again.', noSignal: 'No signal. Try again.',
      madeFor: 'Made with love for', by: 'by', video: 'Video', openVideo: 'Open video', close: 'Close',
      tvScan: 'Scan to add<br>your photos', tvEmpty: 'Scan the QR code to share your photos.<br>They will appear here!', tvNew: 'New photo!',
      demo: 'Demo mode: uploads are not saved.',
      record: 'Record video (15s)', watchAll: 'Watch all', tapWatch: 'Tap to watch', findYours: 'Find your photo, tap to watch from there:', swipe: 'Swipe up for the next one', retake: 'Retake', sendVideo: 'Send video',
      loadingVideo: 'Loading video...', videoFail: 'Video could not play here.'
    },
    ms: {
      tapOpen: 'Tekan untuk buka', musicHint: 'muzik akan dimainkan', shareTitle: 'Kongsi gambar anda',
      shareSub: 'Ambil gambar atau pilih dari telefon. Tiada log masuk.', take: 'Ambil gambar', choose: 'Pilih dari galeri',
      yourName: 'Nama anda (pilihan)', gallery: 'Galeri', empty: 'Belum ada gambar. Jadilah yang pertama!',
      photos: n => n + ' gambar & video', wishName: 'Nama anda', wishText: 'Ucapan anda', send: 'Hantar ucapan',
      uploading: (i, n) => 'Memuat naik ' + i + ' daripada ' + n + '...', thanks: n => 'Terima kasih! ' + n + ' ditambah ke galeri.', tooBig: 'Video terlalu panjang. Sila hadkan video kurang 20 saat (25 MB).',
      partFail: (d, f) => d + ' berjaya, ' + f + ' gagal (terlalu besar atau tiada isyarat). Cuba lagi.',
      closed: 'Muat naik telah ditutup. Terima kasih atas semua gambar!', wishThanks: 'Terima kasih atas ucapan anda!', wishEmpty: 'Sila tulis ucapan dahulu.',
      wishSending: 'Menghantar...', wishFail: 'Gagal dihantar. Cuba lagi.', noSignal: 'Tiada isyarat. Cuba lagi.',
      madeFor: 'Dengan kasih untuk', by: 'oleh', video: 'Video', openVideo: 'Buka video', close: 'Tutup',
      tvScan: 'Imbas untuk<br>kongsi gambar', tvEmpty: 'Imbas kod QR untuk kongsi gambar.<br>Gambar akan muncul di sini!', tvNew: 'Gambar baru!',
      demo: 'Mod demo: gambar tidak disimpan.',
      record: 'Rakam video (15s)', watchAll: 'Tonton semua', tapWatch: 'Tekan untuk tonton', findYours: 'Cari gambar anda, tekan untuk tonton dari situ:', swipe: 'Leret ke atas untuk seterusnya', retake: 'Rakam semula', sendVideo: 'Hantar video',
      loadingVideo: 'Memuatkan video...', videoFail: 'Video tidak dapat dimainkan.'
    }
  };
  window.MQ_TEXT = function(S){
    const lang = (S && S.LANG) === 'ms' ? 'ms' : 'en';
    const ev = EVENTS[(S && S.EVENT) || 'birthday'] || EVENTS.birthday;
    const t = Object.assign({}, UI[lang], ev[lang]);
    if (S && S.HEADLINE) t.kick = S.HEADLINE;
    t.lang = lang;
    return t;
  };
  window.MQ_EVENTS = EVENTS;
})();
