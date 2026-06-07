(function() {
  var el = document.getElementById('rwu-ref-share');
  if (!el) return;

  var email   = localStorage.getItem('rwu_email');
  var refCode = localStorage.getItem('rwu_ref_code');
  var base    = 'https://www.remoteworkunion.com';
  var path    = window.location.pathname.replace(/\/$/, '');

  var btn = document.createElement('button');
  btn.className = 'rwu-ref-share-btn';

  if (email && refCode) {
    var shareUrl = base + path + '?ref=' + refCode;
    btn.innerHTML = '🔗 Share with your referral link';
    btn.addEventListener('click', function() {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareUrl).then(done).catch(fallback);
      } else {
        fallback();
      }
      function done() {
        btn.innerHTML = '✓ Copied!';
        setTimeout(function() { btn.innerHTML = '🔗 Share with your referral link'; }, 2000);
      }
      function fallback() {
        var ta = document.createElement('textarea');
        ta.value = shareUrl;
        ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0;';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (_) {}
        document.body.removeChild(ta);
        done();
      }
    });
  } else {
    btn.innerHTML = '🔗 Join to get your referral link';
    btn.addEventListener('click', function() {
      window.location.href = base + '/';
    });
  }

  el.appendChild(btn);
})();
