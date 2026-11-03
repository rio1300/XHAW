// Fee calculator: subtotal -> multi-course discount -> VAT 15% -> final total
(function () {
  var VAT_RATE = 0.15;
  // Discount tiers by number of courses selected
  function discountFor(n) { return n >= 4 ? 15 : n === 3 ? 10 : n === 2 ? 5 : 0; }
  function money(v) { return 'R' + v.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

  var form = document.getElementById('fee-form');
  var boxes = Array.prototype.slice.call(form.querySelectorAll('input[name=course]'));
  var $ = function (id) { return document.getElementById(id); };
  var msg = $('form-msg');

  function selected() { return boxes.filter(function (b) { return b.checked; }); }

  function calculate() {
    var sel = selected();
    var sub = sel.reduce(function (t, b) { return t + Number(b.dataset.fee); }, 0);
    var pct = discountFor(sel.length);
    var disc = sub * pct / 100;
    var after = sub - disc;
    var vat = after * VAT_RATE;
    var total = after + vat;
    $('sum-count').textContent = sel.length;
    $('sum-list').innerHTML = sel.length
      ? sel.map(function (b) { return '<li><span>' + b.dataset.name + '</span><span>' + money(Number(b.dataset.fee)) + '</span></li>'; }).join('')
      : '<li class="empty">No courses selected yet</li>';
    $('sum-sub').textContent = money(sub);
    $('sum-pct').textContent = pct;
    $('sum-disc').textContent = '-' + money(disc).replace('R-', 'R');
    if (disc === 0) $('sum-disc').textContent = money(0);
    $('sum-after').textContent = money(after);
    $('sum-vat').textContent = money(vat);
    $('sum-total').textContent = money(total);
    return { count: sel.length, total: total };
  }

  function custSummary() {
    var n = $('fullName').value.trim(), p = $('phone').value.trim(), e = $('email').value.trim();
    var parts = [n, p, e].filter(Boolean);
    $('sum-cust').textContent = parts.length ? parts.join(' · ') : 'Enter your details above';
  }

  function setErr(id, text) {
    var el = form.querySelector('.err[data-for="' + id + '"]');
    if (el) el.textContent = text || '';
    var inp = $(id);
    if (inp) inp.classList.toggle('invalid', !!text);
  }

  function validate() {
    var ok = true;
    var name = $('fullName').value.trim();
    var phone = $('phone').value.replace(/[\s\-()]/g, '');
    var email = $('email').value.trim();
    if (name.length < 2) { setErr('fullName', 'Please enter your full name.'); ok = false; } else setErr('fullName');
    if (!/^(\+27|0)\d{9}$/.test(phone)) { setErr('phone', 'Enter a valid South African phone number, e.g. 082 123 4567.'); ok = false; } else setErr('phone');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { setErr('email', 'Please enter a valid email address.'); ok = false; } else setErr('email');
    if (!selected().length) { form.querySelector('.err[data-for="courses"]').textContent = 'Please select at least one course.'; ok = false; }
    else form.querySelector('.err[data-for="courses"]').textContent = '';
    return ok;
  }

  boxes.forEach(function (b) { b.addEventListener('change', function () { calculate(); form.querySelector('.err[data-for="courses"]').textContent = ''; msg.textContent = ''; msg.className = 'form-msg'; }); });
  ['fullName', 'phone', 'email'].forEach(function (id) { $(id).addEventListener('input', function () { custSummary(); setErr(id); }); });

  $('calc-btn').addEventListener('click', function () {
    var r = calculate();
    form.querySelector('.err[data-for="courses"]').textContent = r.count ? '' : 'Please select at least one course.';
    if (window.matchMedia('(max-width:760px)').matches) document.querySelector('.summary').scrollIntoView({ behavior: 'smooth' });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var r = calculate();
    if (!validate()) { msg.className = 'form-msg bad'; msg.textContent = 'Please fix the highlighted fields and try again.'; return; }
    msg.className = 'form-msg ok';
    msg.textContent = 'Thank you, ' + $('fullName').value.trim().split(' ')[0] + '! Your booking request for ' + r.count + ' course' + (r.count > 1 ? 's' : '') + ' (' + money(r.total) + ' incl. VAT) has been received. We will contact you shortly.';
  });

  form.addEventListener('reset', function () {
    setTimeout(function () {
      ['fullName', 'phone', 'email'].forEach(function (id) { setErr(id); });
      form.querySelector('.err[data-for="courses"]').textContent = '';
      msg.textContent = ''; msg.className = 'form-msg';
      calculate(); custSummary();
    }, 0);
  });

  // Pre-select a course when arriving from a course page: fees.html?course=puppy-care
  var q = new URLSearchParams(location.search).get('course');
  if (q) boxes.forEach(function (b) { if (b.value === q) b.checked = true; });
  calculate(); custSummary();
})();
