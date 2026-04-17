/* =============================================
   APARTMENT MAINTENANCE & BILLING PORTAL
   script.js
   ============================================= */

/* ---- PAGE NAVIGATION ---- */
const pageMap = {
  dashboard:   'Dashboard',
  billing:     'Billing',
  payments:    'Payments',
  maintenance: 'Maintenance',
  notices:     'Notices'
};

function goToPage(pageId) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  // Remove active from nav items
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  // Show selected page
  const target = document.getElementById('page-' + pageId);
  if (target) target.classList.add('active');

  // Activate nav item
  const navItem = document.querySelector(`.nav-item[data-page="${pageId}"]`);
  if (navItem) navItem.classList.add('active');

  // Update title
  document.getElementById('pageTitle').textContent = pageMap[pageId] || pageId;

  // Close sidebar on mobile
  if (window.innerWidth <= 768) {
    document.getElementById('sidebar').classList.remove('open');
  }
}

// Nav clicks
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const page = item.getAttribute('data-page');
    if (page) goToPage(page);
  });
});

// Dashboard shortcut links
document.querySelectorAll('.link-btn[data-goto]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    goToPage(btn.getAttribute('data-goto'));
  });
});


/* ---- MOBILE SIDEBAR TOGGLE ---- */
const menuBtn   = document.getElementById('menuBtn');
const sidebar   = document.getElementById('sidebar');

menuBtn.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
  if (
    window.innerWidth <= 768 &&
    !sidebar.contains(e.target) &&
    !menuBtn.contains(e.target)
  ) {
    sidebar.classList.remove('open');
  }
});


/* ---- TOAST NOTIFICATION ---- */
function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}


/* ---- PAYMENT MODAL ---- */
function openPayModal(title, amount) {
  document.getElementById('modalTitle').textContent = 'Pay: ' + title;
  document.getElementById('modalAmount').value = amount;
  document.getElementById('payModal').classList.add('open');
}

function closePayModal() {
  document.getElementById('payModal').classList.remove('open');
}

function confirmPayment() {
  const amount = document.getElementById('modalAmount').value;
  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    showToast('Please enter a valid amount.');
    return;
  }
  closePayModal();
  showToast('✓ Payment of ₹' + Number(amount).toLocaleString('en-IN') + ' submitted successfully!');
}

// Close modal on overlay click
document.getElementById('payModal').addEventListener('click', function(e) {
  if (e.target === this) closePayModal();
});


/* ---- PAYMENT FORM (Payments page) ---- */
function submitPayment(e) {
  e.preventDefault();

  const name   = document.getElementById('cardName').value.trim();
  const number = document.getElementById('cardNumber').value.trim();
  const expiry = document.getElementById('cardExpiry').value.trim();
  const cvv    = document.getElementById('cardCvv').value.trim();
  const amount = document.getElementById('payAmount').value;

  if (!name || !number || !expiry || !cvv) {
    showToast('Please fill in all card details.');
    return;
  }

  if (number.replace(/\s/g, '').length < 13) {
    showToast('Please enter a valid card number.');
    return;
  }

  if (!amount || Number(amount) <= 0) {
    showToast('Please enter a valid amount.');
    return;
  }

  showToast('✓ Payment of ₹' + Number(amount).toLocaleString('en-IN') + ' processed!');
  document.getElementById('payForm').reset();
}


/* ---- CARD NUMBER FORMATTING ---- */
const cardNumberInput = document.getElementById('cardNumber');
if (cardNumberInput) {
  cardNumberInput.addEventListener('input', function () {
    let val = this.value.replace(/\D/g, '').substring(0, 16);
    this.value = val.replace(/(.{4})/g, '$1 ').trim();
  });
}

const cardExpiryInput = document.getElementById('cardExpiry');
if (cardExpiryInput) {
  cardExpiryInput.addEventListener('input', function () {
    let val = this.value.replace(/\D/g, '').substring(0, 4);
    if (val.length >= 3) {
      val = val.substring(0, 2) + ' / ' + val.substring(2);
    }
    this.value = val;
  });
}


/* ---- MAINTENANCE REQUEST FORM ---- */
let reqCount = 3; // existing requests count

function submitRequest(e) {
  e.preventDefault();

  const category = document.getElementById('reqCategory').value;
  const title    = document.getElementById('reqTitle').value.trim();
  const details  = document.getElementById('reqDetails').value.trim();
  const priority = document.getElementById('reqPriority').value;

  if (!category) {
    showToast('Please select a category.');
    return;
  }

  if (!title) {
    showToast('Please enter a description.');
    return;
  }

  reqCount++;
  const reqId = '#REQ-00' + (40 + reqCount);
  const today = new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });

  const iconMap = {
    'Plumbing':       { cls: 'plumb', icon: '🔧' },
    'Electrical':     { cls: 'elec',  icon: '⚡' },
    'HVAC / Heating': { cls: 'hvac',  icon: '❄️' },
    'Appliance':      { cls: 'plumb', icon: '🔌' },
    'Pest control':   { cls: 'pest',  icon: '🐜' },
    'Structural':     { cls: 'elec',  icon: '🏗' },
    'Other':          { cls: 'other', icon: '📋' }
  };

  const info = iconMap[category] || { cls: 'other', icon: '📋' };

  const newReq = document.createElement('div');
  newReq.className = 'req-row-full';
  newReq.setAttribute('data-status', 'open');
  newReq.innerHTML = `
    <div class="req-top">
      <div class="req-icon ${info.cls}">${info.icon}</div>
      <div class="req-info">
        <span class="req-title">${escapeHtml(title)}</span>
        <span class="req-meta">${reqId} · ${today} · ${category}</span>
      </div>
      <span class="pill open">Open</span>
    </div>
    <p class="req-desc">${escapeHtml(details || 'No additional details provided.')}</p>
    <div class="req-footer">
      <span>⏳ Awaiting assignment</span>
      <span>Priority: ${priority}</span>
    </div>
  `;

  const reqList = document.getElementById('reqListFull');
  reqList.insertBefore(newReq, reqList.firstChild);

  document.getElementById('reqForm').reset();
  showToast('✓ Request ' + reqId + ' submitted successfully!');
}


/* ---- BILL TABLE FILTER ---- */
const billFilter = document.getElementById('billFilter');
if (billFilter) {
  billFilter.addEventListener('change', function () {
    const val = this.value;
    document.querySelectorAll('#billTable tbody tr').forEach(row => {
      const status = row.getAttribute('data-status');
      if (val === 'all' || status === val) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });
}


/* ---- MAINTENANCE REQUEST FILTER ---- */
const reqFilter = document.getElementById('reqFilter');
if (reqFilter) {
  reqFilter.addEventListener('change', function () {
    const val = this.value;
    document.querySelectorAll('#reqListFull .req-row-full').forEach(row => {
      const status = row.getAttribute('data-status');
      if (val === 'all' || status === val) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });
}


/* ---- NOTIFICATION BUTTON ---- */
document.getElementById('notifBtn').addEventListener('click', () => {
  showToast('📬 3 unread notifications — water maintenance, rent due, and new notice.');
});


/* ---- UTILITY: ESCAPE HTML ---- */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#39;');
}


/* ---- INIT ---- */
document.addEventListener('DOMContentLoaded', () => {
  goToPage('dashboard');
});