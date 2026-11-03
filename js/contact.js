// Contact form validation (front-end)
(function () {
  var form = document.getElementById('contact-form');
  var msg = document.getElementById('contact-msg');
  function setErr(id, t) {
    form.querySelector('.err[data-for="' + id + '"]').textContent = t || '';
    document.getElementById(id).classList.toggle('invalid', !!t);
  }
  function check() {
    var ok = true;
    var name = document.getElementById('c-name').value.trim();
    var email = document.getElementById('c-email').value.trim();
    var phone = document.getElementById('c-phone').value.replace(/[\s\-()]/g, '');
    var subj = document.getElementById('c-subject').value;
    var text = document.getElementById('c-msg').value.trim();
    if (name.length < 2) { setErr('c-name', 'Please enter your full name.'); ok = false; } else setErr('c-name');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { setErr('c-email', 'Please enter a valid email address.'); ok = false; } else setErr('c-email');
    if (phone && !/^(\+27|0)\d{9}$/.test(phone)) { setErr('c-phone', 'Enter a valid phone number, e.g. 082 123 4567.'); ok = false; } else setErr('c-phone');
    if (!subj) { setErr('c-subject', 'Please choose a topic.'); ok = false; } else setErr('c-subject');
    if (text.length < 10) { setErr('c-msg', 'Please write a message of at least 10 characters.'); ok = false; } else setErr('c-msg');
    return ok;
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!check()) { msg.className = 'form-msg bad'; msg.textContent = 'Please fix the highlighted fields and try again.'; return; }
    msg.className = 'form-msg ok';
    msg.textContent = 'Thank you, ' + document.getElementById('c-name').value.trim().split(' ')[0] + '! Your message has been sent. We will reply as soon as possible.';
    form.reset();
  });
  Array.prototype.forEach.call(form.querySelectorAll('input,select,textarea'), function (el) {
    el.addEventListener('input', function () { setErr(el.id); });
  });
})();
