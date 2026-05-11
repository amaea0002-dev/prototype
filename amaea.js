/* ============================================================
   Amaea v2 — Interactivity
   ============================================================ */

// ── Theme ─────────────────────────────────────────────────────
(function () {
  const t = localStorage.getItem('amaea-theme') || 'light';
  if (t === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
})();

window.addEventListener('load', () => {
  requestAnimationFrame(() => document.body.classList.add('theme-ready'));
});

function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  localStorage.setItem('amaea-theme', isDark ? 'light' : 'dark');
}

document.addEventListener('DOMContentLoaded', () => {
  // Wire pill toggle
  document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);

  // ── Menu button: desktop = collapse, mobile = open/close ──────
  document.querySelectorAll('.menu-btn').forEach(btn => {
    btn.removeAttribute('onclick');
    btn.addEventListener('click', () => {
      if (window.innerWidth > 960) toggleSidebarCollapse();
      else toggleSidebar();
    });
  });

  // ── User switcher ─────────────────────────────────────────────
  const USERS = {
    hasna: { name: 'Hasna Sahul Hameed', firstName: 'Hasna', role: 'CEO & Co-founder', initial: 'H', bg: 'linear-gradient(135deg,#4C2C4B,#8B6189)' },
    milan: { name: 'Milan Sajiv',         firstName: 'Milan', role: 'CTO & Co-founder', initial: 'M', bg: 'linear-gradient(135deg,#1a4080,#4292c6)' }
  };

  let currentUser = localStorage.getItem('amaea-proto-user') || 'hasna';

  function applyUser(key) {
    const u = USERS[key];
    if (!u) return;
    currentUser = key;
    localStorage.setItem('amaea-proto-user', key);

    const avatar     = document.getElementById('sb-avatar');
    const nameEl     = document.getElementById('sb-user-name');
    const roleEl     = document.getElementById('sb-user-role');
    const topbarAv   = document.getElementById('topbar-avatar');
    const greetingEl = document.getElementById('page-greeting-name');

    if (avatar)     { avatar.textContent = u.initial; avatar.style.background = u.bg; }
    if (nameEl)     nameEl.textContent = u.name;
    if (roleEl)     roleEl.textContent = u.role;
    if (topbarAv)   { topbarAv.textContent = u.initial; topbarAv.style.background = u.bg; }
    if (greetingEl) greetingEl.textContent = u.firstName;

    document.querySelectorAll('.sb-user-tick').forEach(el => el.style.opacity = '0');
    const tick = document.getElementById('tick-' + key);
    if (tick) tick.style.opacity = '1';
  }

  applyUser(currentUser);

  const userArea  = document.getElementById('sb-user-area');
  const userPanel = document.getElementById('sb-user-panel');

  userArea?.addEventListener('click', (e) => {
    e.stopPropagation();
    userPanel?.classList.toggle('open');
  });

  document.querySelectorAll('.sb-user-option').forEach(btn => {
    btn.addEventListener('click', () => {
      applyUser(btn.dataset.user);
      userPanel?.classList.remove('open');
    });
  });

  document.addEventListener('click', () => userPanel?.classList.remove('open'));
});

// ── Toasts ────────────────────────────────────────────────────
function showToast(message, type = 'info', duration = 3200) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '✓', error: '✕', info: 'i' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<div class="toast-icon">${icons[type] || 'i'}</div><span>${message}</span>`;
  container.appendChild(toast);
  requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 350);
  }, duration);
}

// ── Modals ────────────────────────────────────────────────────
function openModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.remove('open'); document.body.style.overflow = ''; }
}
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) closeModal(e.target.id);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => closeModal(m.id));
    document.querySelectorAll('.dropdown-menu.open').forEach(d => d.classList.remove('open'));
  }
});

// ── Dropdowns ─────────────────────────────────────────────────
document.addEventListener('click', e => {
  const btn = e.target.closest('[data-dropdown]');
  if (btn) {
    const menu = document.getElementById(btn.dataset.dropdown);
    if (menu) {
      const isOpen = menu.classList.contains('open');
      document.querySelectorAll('.dropdown-menu.open').forEach(d => d.classList.remove('open'));
      if (!isOpen) menu.classList.add('open');
    }
    e.stopPropagation();
    return;
  }
  if (!e.target.closest('.dropdown-menu')) {
    document.querySelectorAll('.dropdown-menu.open').forEach(d => d.classList.remove('open'));
  }
});

// ── Mobile sidebar ─────────────────────────────────────────────
function toggleSidebar() {
  const open = document.querySelector('.sidebar')?.classList.toggle('open');
  document.querySelector('.sb-overlay')?.classList.toggle('open', open);
  document.body.classList.toggle('mobile-nav-open', open);
}
function closeSidebar() {
  document.querySelector('.sidebar')?.classList.remove('open');
  document.querySelector('.sb-overlay')?.classList.remove('open');
  document.body.classList.remove('mobile-nav-open');
}
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => { if (window.innerWidth <= 960) closeSidebar(); });
  });
});

// ── Desktop sidebar collapse ────────────────────────────────────
(function () {
  if (localStorage.getItem('amaea-sb-collapsed') === 'true') {
    document.body.classList.add('sb-collapsed');
  }
})();

function toggleSidebarCollapse() {
  const collapsed = document.body.classList.toggle('sb-collapsed');
  localStorage.setItem('amaea-sb-collapsed', collapsed);
}

// ── Generate simulation ────────────────────────────────────────
function simulateGenerate(btn, successMsg) {
  const orig = btn.innerHTML;
  btn.innerHTML = `<span class="spinner">↻</span> Generating…`;
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = `✓ ${successMsg || 'Generated'}`;
    btn.style.background = 'var(--green)';
    showToast('Report generated successfully', 'success');
    setTimeout(() => { btn.innerHTML = orig; btn.disabled = false; btn.style.background = ''; }, 3500);
  }, 1800);
}

function simulateSync(btn, name) {
  const orig = btn.innerHTML;
  btn.innerHTML = `<span class="spinner">↻</span> Syncing…`;
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = `✓ Synced`;
    btn.style.background = 'var(--green)';
    showToast(`${name} sync complete`, 'success');
    setTimeout(() => { btn.innerHTML = orig; btn.disabled = false; btn.style.background = ''; }, 3000);
  }, 1600);
}

// ── Client data ────────────────────────────────────────────────
const clientData = {
  'CLI-0047': {
    name: 'Margaret Thompson', adviser: 'James Morrison',
    joined: 'Mar 2023', lastReview: 'Mar 2024', nextDue: 'Mar 2025',
    stage: 'Stage 3', status: 'overdue', vuln: 'standard',
    riskProfile: 'Balanced', portfolioValue: '£284,500',
    email: 'm.thompson@email.com', phone: '07700 900123',
    notes: 'Annual Review 2 overdue by 14 months. Missing updated suitability letter.'
  },
  'CLI-0089': {
    name: 'Robert Chen', adviser: 'Alex Williams',
    joined: 'Jun 2022', lastReview: 'Jun 2023', nextDue: 'Jun 2024',
    stage: 'Stage 3', status: 'breach', vuln: 'vulnerable',
    riskProfile: 'Cautious', portfolioValue: '£156,200',
    email: 'r.chen@email.com', phone: '07700 900456',
    notes: 'Vulnerable customer — Consumer Duty enhanced monitoring required. SOA missing.'
  },
  'CLI-0114': {
    name: 'Sarah Fraser', adviser: 'James Morrison',
    joined: 'Jan 2024', lastReview: '—', nextDue: 'Jan 2025',
    stage: 'Stage 1', status: 'compliant', vuln: 'standard',
    riskProfile: 'Growth', portfolioValue: '£92,000',
    email: 's.fraser@email.com', phone: '07700 900789',
    notes: 'New client. Initial work in progress — fact find submitted, awaiting risk assessment.'
  },
  'CLI-0132': {
    name: 'Priya Singh', adviser: 'Kate Davies',
    joined: 'Sep 2023', lastReview: 'Dec 2023', nextDue: 'Dec 2024',
    stage: 'Stage 2', status: 'at-risk', vuln: 'vulnerable',
    riskProfile: 'Cautious', portfolioValue: '£211,000',
    email: 'p.singh@email.com', phone: '07700 900321',
    notes: 'Ad-hoc pension transfer in progress. Vulnerable — health deterioration flagged by adviser.'
  },
  'CLI-0158': {
    name: 'David Williams', adviser: 'Alex Williams',
    joined: 'Nov 2022', lastReview: 'Nov 2023', nextDue: 'Nov 2024',
    stage: 'Stage 3', status: 'compliant', vuln: 'standard',
    riskProfile: 'Balanced', portfolioValue: '£445,800',
    email: 'd.williams@email.com', phone: '07700 900654',
    notes: 'All documentation up to date. Next review due November 2024.'
  },
  'CLI-0163': {
    name: 'Anne Morrison', adviser: 'Kate Davies',
    joined: 'Feb 2023', lastReview: 'Feb 2024', nextDue: 'Feb 2025',
    stage: 'Stage 3', status: 'at-risk', vuln: 'standard',
    riskProfile: 'Balanced', portfolioValue: '£178,300',
    email: 'a.morrison@email.com', phone: '07700 900987',
    notes: 'Suitability letter expired. Due for renewal before next review.'
  },
  'CLI-0178': {
    name: 'James O\'Brien', adviser: 'James Morrison',
    joined: 'Jul 2023', lastReview: '—', nextDue: 'Jul 2024',
    stage: 'Stage 2', status: 'at-risk', vuln: 'standard',
    riskProfile: 'Growth', portfolioValue: '£330,000',
    email: 'j.obrien@email.com', phone: '07700 900147',
    notes: 'ISA consolidation ad-hoc work in progress. Missing client agreement signature.'
  }
};

const milestoneData = {
  'initial-0047': { title: 'Initial Client Engagement', date: 'Mar 2023', status: 'Compliant', docs: [
    { label: 'Client Agreement / Letter of Engagement', status: 'ok' },
    { label: 'Fact Find — Personal Circumstances', status: 'ok' },
    { label: 'Risk Profile Assessment', status: 'ok' },
    { label: 'ID & Anti-Money Laundering Checks', status: 'ok' },
    { label: 'Initial Suitability Report', status: 'ok' }
  ]},
  'adhoc-0047': { title: 'Pension Drawdown Review', date: 'Sep 2023', status: 'Missing document', docs: [
    { label: 'Drawdown Suitability Report', status: 'miss' },
    { label: 'Updated Risk Profile', status: 'ok' },
    { label: 'Flexi-Access Drawdown Illustration', status: 'ok' },
    { label: 'Client Signed Agreement', status: 'ok' },
    { label: 'Transfer Value Analysis', status: 'pend' }
  ]},
  'ar1-0047': { title: 'Annual Review', date: 'Mar 2024', status: 'Compliant', docs: [
    { label: 'Annual Review Suitability Report', status: 'ok' },
    { label: 'Updated Fact Find', status: 'ok' },
    { label: 'Portfolio Valuation & Performance Review', status: 'ok' },
    { label: 'Consumer Duty Outcome Assessment', status: 'ok' },
    { label: 'Signed Client Acknowledgement', status: 'ok' }
  ]},
  'ar2-0047': { title: 'Annual Review — OVERDUE', date: 'Due Mar 2025 · 14 months elapsed', status: 'Breach', docs: [
    { label: 'Annual Review Suitability Report', status: 'miss' },
    { label: 'Updated Fact Find', status: 'miss' },
    { label: 'Portfolio Valuation & Performance Review', status: 'miss' },
    { label: 'Consumer Duty Outcome Assessment', status: 'miss' },
    { label: 'Signed Client Acknowledgement', status: 'pend' }
  ]},
  'initial-0089': { title: 'Initial Client Engagement', date: 'Jun 2022', status: 'Compliant', docs: [
    { label: 'Client Agreement / Letter of Engagement', status: 'ok' },
    { label: 'Fact Find — Personal Circumstances', status: 'ok' },
    { label: 'Vulnerability Assessment', status: 'ok' },
    { label: 'ID & Anti-Money Laundering Checks', status: 'ok' },
    { label: 'Initial Suitability Report', status: 'ok' }
  ]},
  'adhoc-0089': { title: 'Portfolio Restructure', date: 'Jan 2023', status: 'Compliant', docs: [
    { label: 'Suitability Report — Restructure', status: 'ok' },
    { label: 'Updated Vulnerability Check', status: 'ok' },
    { label: 'Consumer Duty Fair Value Assessment', status: 'ok' },
    { label: 'Client Signed Agreement', status: 'ok' }
  ]},
  'ar1-0089': { title: 'Annual Review', date: 'Jun 2023', status: 'Compliant', docs: [
    { label: 'Annual Review Suitability Report', status: 'ok' },
    { label: 'Updated Fact Find', status: 'ok' },
    { label: 'Vulnerability Re-assessment', status: 'ok' },
    { label: 'Consumer Duty Outcome Assessment', status: 'ok' },
    { label: 'Signed Client Acknowledgement', status: 'ok' }
  ]},
  'ar2-0089': { title: 'Annual Review — OVERDUE', date: 'Due Jun 2024 · 11 months elapsed', status: 'Breach', docs: [
    { label: 'Annual Review Suitability Report', status: 'miss' },
    { label: 'Updated Vulnerability Re-assessment', status: 'miss' },
    { label: 'Consumer Duty Outcome Assessment', status: 'miss' },
    { label: 'Portfolio Valuation & Performance Review', status: 'pend' },
    { label: 'Signed Client Acknowledgement', status: 'miss' }
  ]},
  'initial-0114': { title: 'Initial Client Engagement', date: 'Jan 2024', status: 'In Progress', docs: [
    { label: 'Client Agreement / Letter of Engagement', status: 'ok' },
    { label: 'Fact Find — Personal Circumstances', status: 'ok' },
    { label: 'Risk Profile Assessment', status: 'miss' },
    { label: 'ID & Anti-Money Laundering Checks', status: 'ok' },
    { label: 'Initial Suitability Report', status: 'pend' }
  ]},
  'initial-0132': { title: 'Initial Client Engagement', date: 'Sep 2023', status: 'Compliant', docs: [
    { label: 'Client Agreement / Letter of Engagement', status: 'ok' },
    { label: 'Fact Find — Personal Circumstances', status: 'ok' },
    { label: 'Vulnerability Assessment', status: 'ok' },
    { label: 'Risk Profile Assessment', status: 'ok' },
    { label: 'Initial Suitability Report', status: 'ok' }
  ]},
  'adhoc-0132': { title: 'Pension Transfer', date: 'Jan 2024', status: 'Missing document', docs: [
    { label: 'Pension Transfer Suitability Report', status: 'miss' },
    { label: 'Vulnerability Re-assessment', status: 'ok' },
    { label: 'Transfer Value Analysis', status: 'ok' },
    { label: 'Consumer Duty Fair Value Assessment', status: 'miss' },
    { label: 'Client Consent Form', status: 'pend' }
  ]},
  'initial-0158': { title: 'Initial Client Engagement', date: 'Nov 2022', status: 'Compliant', docs: [
    { label: 'Client Agreement / Letter of Engagement', status: 'ok' },
    { label: 'Fact Find — Personal Circumstances', status: 'ok' },
    { label: 'Risk Profile Assessment', status: 'ok' },
    { label: 'ID & Anti-Money Laundering Checks', status: 'ok' },
    { label: 'Initial Suitability Report', status: 'ok' }
  ]},
  'ar1-0158': { title: 'Annual Review', date: 'Nov 2023', status: 'Compliant', docs: [
    { label: 'Annual Review Suitability Report', status: 'ok' },
    { label: 'Updated Fact Find', status: 'ok' },
    { label: 'Portfolio Valuation & Performance Review', status: 'ok' },
    { label: 'Consumer Duty Outcome Assessment', status: 'ok' },
    { label: 'Signed Client Acknowledgement', status: 'ok' }
  ]},
  'initial-0163': { title: 'Initial Client Engagement', date: 'Feb 2023', status: 'Compliant', docs: [
    { label: 'Client Agreement / Letter of Engagement', status: 'ok' },
    { label: 'Fact Find — Personal Circumstances', status: 'ok' },
    { label: 'Risk Profile Assessment', status: 'ok' },
    { label: 'ID & Anti-Money Laundering Checks', status: 'ok' },
    { label: 'Initial Suitability Report', status: 'ok' }
  ]},
  'ar1-0163': { title: 'Annual Review', date: 'Feb 2024', status: 'At Risk', docs: [
    { label: 'Annual Review Suitability Report', status: 'ok' },
    { label: 'Updated Fact Find', status: 'ok' },
    { label: 'Suitability Letter', status: 'miss' },
    { label: 'Consumer Duty Outcome Assessment', status: 'ok' },
    { label: 'Signed Client Acknowledgement', status: 'pend' }
  ]},
  'initial-0178': { title: 'Initial Client Engagement', date: 'Jul 2023', status: 'Compliant', docs: [
    { label: 'Client Agreement / Letter of Engagement', status: 'ok' },
    { label: 'Fact Find — Personal Circumstances', status: 'ok' },
    { label: 'Risk Profile Assessment', status: 'ok' },
    { label: 'ID & Anti-Money Laundering Checks', status: 'ok' },
    { label: 'Initial Suitability Report', status: 'ok' }
  ]},
  'adhoc-0178': { title: 'ISA Consolidation', date: 'Nov 2023', status: 'Missing document', docs: [
    { label: 'ISA Consolidation Suitability Report', status: 'ok' },
    { label: 'Client Agreement Signature', status: 'miss' },
    { label: 'Transfer Authority Form', status: 'ok' },
    { label: 'Updated Risk Profile', status: 'ok' }
  ]}
};

// ── Open milestone modal ───────────────────────────────────────
function openMilestone(key) {
  const d = milestoneData[key];
  if (!d) { showToast('Milestone data unavailable', 'error'); return; }
  const statusColor = d.status === 'Compliant' ? 'green' : d.status === 'Missing document' ? 'amber' : 'red';
  const checkHtml = d.docs.map(doc => `
    <div class="checklist-item">
      <div class="check-icon check-${doc.status}">${doc.status === 'ok' ? '✓' : doc.status === 'miss' ? '✕' : '!'}</div>
      <span>${doc.label}</span>
    </div>`).join('');
  document.getElementById('milestone-modal-title').textContent = d.title;
  document.getElementById('milestone-modal-sub').innerHTML = `${d.date} · <span class="badge badge-${statusColor}">${d.status}</span>`;
  document.getElementById('milestone-modal-docs').innerHTML = checkHtml;
  openModal('milestone-modal');
}

// ── Client detail panel ────────────────────────────────────────
function openClient(id, rowEl) {
  const d = clientData[id];
  if (!d) return;
  document.querySelectorAll('tbody tr').forEach(r => r.classList.remove('row-selected'));
  rowEl?.classList.add('row-selected');
  const vulnBadge = d.vuln === 'vulnerable'
    ? `<span class="badge badge-amber">Vulnerable</span>`
    : d.vuln === 'high'
    ? `<span class="badge badge-red">High Risk</span>`
    : `<span class="badge badge-neutral">Standard</span>`;
  const statusBadge = d.status === 'compliant'
    ? `<span class="badge badge-green">Compliant</span>`
    : d.status === 'overdue'
    ? `<span class="badge badge-amber">Overdue</span>`
    : d.status === 'breach'
    ? `<span class="badge badge-red">Breach</span>`
    : `<span class="badge badge-amber">At Risk</span>`;

  function mkEntry(key, date, title, statusText, color, hasLine) {
    return `<button class="milestone-btn" onclick="openMilestone('${key}')">
      <div class="milestone-dot-col"><div class="m-dot" style="color:var(--${color});background:var(--${color});"></div>${hasLine ? '<div class="m-line"></div>' : ''}</div>
      <div class="milestone-body" style="${hasLine ? '' : 'padding-bottom:0'}">
        <div class="m-type">${date}</div>
        <div class="m-title" style="${color === 'red' ? 'color:var(--red);' : ''}">${title}</div>
        <div class="m-sub"><span style="color:var(--${color});font-weight:600;">${statusText}</span> · Click to review</div>
      </div>
    </button>`;
  }

  const timelines = {
    'CLI-0047': [
      mkEntry('initial-0047', 'Mar 2023', 'Initial Client Engagement',  'Compliant',         'green', true),
      mkEntry('adhoc-0047',   'Sep 2023', 'Pension Drawdown Review',    'Missing document',  'amber', true),
      mkEntry('ar1-0047',     'Mar 2024', 'Annual Review',              'Compliant',         'green', true),
      mkEntry('ar2-0047',     'Due Mar 2025', 'Annual Review — OVERDUE','14 months elapsed', 'red',   false)
    ].join(''),
    'CLI-0089': [
      mkEntry('initial-0089', 'Jun 2022', 'Initial Client Engagement',  'Compliant',         'green', true),
      mkEntry('adhoc-0089',   'Jan 2023', 'Portfolio Restructure',      'Compliant',         'green', true),
      mkEntry('ar1-0089',     'Jun 2023', 'Annual Review',              'Compliant',         'green', true),
      mkEntry('ar2-0089',     'Due Jun 2024', 'Annual Review — OVERDUE','11 months elapsed', 'red',   false)
    ].join(''),
    'CLI-0114': [
      mkEntry('initial-0114', 'Jan 2024', 'Initial Client Engagement',  'In progress',       'amber', false)
    ].join(''),
    'CLI-0132': [
      mkEntry('initial-0132', 'Sep 2023', 'Initial Client Engagement',  'Compliant',         'green', true),
      mkEntry('adhoc-0132',   'Jan 2024', 'Pension Transfer',           'Missing document',  'amber', false)
    ].join(''),
    'CLI-0158': [
      mkEntry('initial-0158', 'Nov 2022', 'Initial Client Engagement',  'Compliant',         'green', true),
      mkEntry('ar1-0158',     'Nov 2023', 'Annual Review',              'Compliant',         'green', false)
    ].join(''),
    'CLI-0163': [
      mkEntry('initial-0163', 'Feb 2023', 'Initial Client Engagement',  'Compliant',         'green', true),
      mkEntry('ar1-0163',     'Feb 2024', 'Annual Review',              'At risk',           'amber', false)
    ].join(''),
    'CLI-0178': [
      mkEntry('initial-0178', 'Jul 2023', 'Initial Client Engagement',  'Compliant',         'green', true),
      mkEntry('adhoc-0178',   'Nov 2023', 'ISA Consolidation',          'Missing document',  'amber', false)
    ].join('')
  };

  const timelineHtml = timelines[id] || `<p style="font-size:0.8rem;color:var(--t3);padding:12px 0;">Journey details available after initial data sync.</p>`;

  document.getElementById('client-detail').innerHTML = `
    <div class="flex items-center justify-between mb-4">
      <div>
        <div style="font-size:0.95rem;font-weight:800;letter-spacing:-0.03em;color:var(--t1);">${d.name}</div>
        <div style="font-size:0.75rem;color:var(--t3);margin-top:2px;">${id} · ${d.adviser}</div>
      </div>
      <div style="display:flex;gap:6px;">${vulnBadge} ${statusBadge}</div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px;">
      <div style="background:var(--surface-2);border-radius:var(--r2);padding:10px;border:1px solid var(--border);">
        <div style="font-size:0.68rem;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:3px;">Risk Profile</div>
        <div style="font-size:0.84rem;font-weight:600;color:var(--t1);">${d.riskProfile}</div>
      </div>
      <div style="background:var(--surface-2);border-radius:var(--r2);padding:10px;border:1px solid var(--border);">
        <div style="font-size:0.68rem;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:3px;">Portfolio Value</div>
        <div style="font-size:0.84rem;font-weight:600;color:var(--t1);">${d.portfolioValue}</div>
      </div>
    </div>
    <div style="font-size:0.7rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;color:var(--t3);margin-bottom:10px;">Client Journey</div>
    ${timelineHtml}
    <div class="compliance-actions">
      <button class="btn btn-secondary btn-sm" onclick="openModal('flag-modal')">Flag Compliance Gap</button>
      <button class="btn btn-secondary btn-sm" onclick="showToast('Escalated to senior compliance officer','info')">Escalate</button>
      <button class="btn btn-primary btn-sm" onclick="showToast('Generating compliance report…','info',2000);setTimeout(()=>showToast('Report ready','success'),2200)">Generate Report</button>
    </div>`;
}

// ── AI chat ────────────────────────────────────────────────────
const aiPatterns = [
  {
    match: ['margaret', 'thompson', 'cli-0047'],
    reply: `Margaret Thompson (CLI-0047) is your most urgent case. She's 14 months past her annual review deadline — the longest elapsed in your book. Her Stage 2 pension drawdown file (Sep 2023) is also missing the suitability report. Adviser James Morrison owns this client. I'd escalate this immediately: FCA supervision visits typically start with the oldest outstanding reviews.`
  },
  {
    match: ['robert', 'chen', 'cli-0089'],
    reply: `Robert Chen (CLI-0089) is a vulnerable client with an annual review 11 months overdue and an incomplete suitability file. Under Consumer Duty, vulnerable clients require documented evidence of fair outcomes — missing both the review and the suitability report is a double breach. Adviser Alex Williams should be actioned on this as the highest-priority vulnerable client.`
  },
  {
    match: ['priya', 'singh', 'cli-0132'],
    reply: `Priya Singh (CLI-0132) was flagged vulnerable following reported health deterioration. She has an active pension transfer (Stage 2 ad-hoc work) in progress with adviser Kate Davies. Her suitability report for the transfer is outstanding. Given her vulnerability status, Consumer Duty requires this to be completed before the pension transfer is executed.`
  },
  {
    match: ['overdue', 'missed review', 'late review'],
    reply: `18 clients are currently outside the FCA's 12-month annual review window. The breakdown: Margaret Thompson at 14 months (CLI-0047), Robert Chen at 11 months (CLI-0089), Anne Morrison at 3 months (CLI-0163), plus 15 others between 1–3 months overdue. At the current rate of 3 new breaches per week, you'll be at 25+ by end of June if no action is taken. I'd recommend triaging by elapsed time and vulnerability status.`
  },
  {
    match: ['vulnerable', 'consumer duty vulnerable'],
    reply: `You have 9 vulnerable clients. 4 are fully compliant, 3 have incomplete documentation, and 2 have overdue reviews. The 2 with overdue reviews — Robert Chen (CLI-0089) and Priya Singh (CLI-0132) — are your highest Consumer Duty exposure. FCA examiners specifically interrogate vulnerable client treatment during visits. I'd recommend completing documentation for all 9 before the Consumer Duty assessment due 31 July.`
  },
  {
    match: ['rmar', 'retail mediation', 'regulatory return'],
    reply: `Your RMAR is due 31 May — 25 days away. I've pre-populated Sections A and C from Intelliflo and SharePoint. Section B has 3 gaps: (1) complaint volumes, awaiting input from the adviser team, (2) product mix breakdown — the ISA/pension split needs verification against Intelliflo, (3) vulnerable client percentage — requires manual entry. I'd suggest resolving these by 20 May to leave a week for final review before submission.`
  },
  {
    match: ['consumer duty', 'duty assessment', 'fair value', 'fair outcome'],
    reply: `Your Consumer Duty annual assessment is due 31 July. Current position: Products & Services — strong. Price & Value — strong. Consumer Understanding — moderate (documentation at 61% drags this down). Consumer Support — weak (9 vulnerable clients need documented outcomes). Your overall score is 82/100. Resolving the 34 documentation gaps and 18 overdue reviews would push this to approximately 91. I'd focus on vulnerable client outcomes first as that's where FCA scrutiny is highest.`
  },
  {
    match: ['suitability', 'soa', 'suitability report', 'suitability letter'],
    reply: `34 suitability documents are missing or expired. 8 are for vulnerable clients — higher-priority under Consumer Duty. The oldest gap is CLI-0047's Pension Drawdown SOA from September 2023 (still outstanding after 20 months). I'd recommend a systematic sweep: overdue clients first, then vulnerable clients, then the remaining standard clients. Completing these would lift your documentation score from 61% to above 80%.`
  },
  {
    match: ['deadline', 'due date', 'upcoming', 'when is'],
    reply: `Three key deadlines: (1) RMAR — 31 May, 25 days away, 3 data gaps remaining. (2) Annual Compliance Review — 15 June, internal board presentation, draft at 40%. (3) Consumer Duty Assessment — 31 July, assessment at 78%. The RMAR is most time-critical. If you clear it this week I can pre-populate the full report by Monday.`
  },
  {
    match: ['pattern', 'trend', 'trajectory', 'forecast'],
    reply: `Three trends to watch: (1) Annual review breaches growing at ~3 per week — projecting 28+ missed by end of June without intervention. (2) Documentation improving slightly (5 SOAs resolved this week) but vulnerable client docs stuck at 44% for three weeks. (3) Stage 2 ad-hoc SLA at 81% vs 90% target — driven by the two active pension transfers which typically take longer. I'd flag the pension transfers to your team for a completion timeline.`
  },
  {
    match: ['health score', 'compliance score', 'how are we doing', 'overall'],
    reply: `Compliance health score: 82/100. The two drags are documentation (61%) and annual reviews (74%). If you close the 18 overdue reviews and resolve the 8 vulnerable client documentation gaps, the score rises to approximately 91. Regulatory deadlines (100%) and suitability assessments (91%) are strong. The board presentation on 15 June should reflect these as positives alongside the action plan for the two weak areas.`
  },
  {
    match: ['james morrison', 'morrison'],
    reply: `James Morrison has 3 active compliance issues: Margaret Thompson (CLI-0047) — annual review 14 months overdue, pension drawdown SOA missing. James O'Brien (CLI-0178) — ISA consolidation Stage 2 missing client agreement signature. Sarah Fraser (CLI-0114) — Stage 1 fact find submitted but risk assessment outstanding. The Thompson case is the most critical by far. I'd recommend a direct conversation with James this week.`
  },
  {
    match: ['alex williams', 'williams'],
    reply: `Alex Williams has 2 clients with compliance issues: Robert Chen (CLI-0089) — vulnerable, annual review 11 months overdue, suitability file incomplete. David Williams (CLI-0158) — Stage 3, all documentation current, next review due November 2024. Robert Chen is the priority — vulnerable status makes this a Consumer Duty issue, not just an AR compliance issue.`
  },
  {
    match: ['kate davies', 'davies', 'kate'],
    reply: `Kate Davies has 2 clients flagged: Priya Singh (CLI-0132) — vulnerable, active pension transfer, suitability report outstanding. Anne Morrison (CLI-0163) — suitability letter expired, due renewal before the next annual review. The Singh case is higher urgency given the live ad-hoc transaction and vulnerable classification.`
  },
  {
    match: ['what should i do', 'priority', 'where do i start', 'recommend'],
    reply: `Based on regulatory exposure, here's your priority order: (1) Escalate CLI-0047 (Thompson) — 14 months overdue, longest elapsed case. (2) Action vulnerable clients CLI-0089 and CLI-0132 — Consumer Duty breach risk. (3) Complete the 3 RMAR data gaps in Section B — due in 25 days. (4) Clear suitability letter backlog for the remaining 26 standard clients. Doing all of this moves your health score from 82 to ~93.`
  }
];

const aiDefaultReply = `I'm monitoring 247 clients across all FCA compliance requirements. Right now your top 3 priorities are: (1) 18 overdue annual reviews — CLI-0047 (Thompson) is the most urgent at 14 months. (2) 9 vulnerable clients under Consumer Duty — 5 need immediate action. (3) RMAR due in 25 days with 3 data gaps remaining. Ask me about a specific client, adviser, deadline, or compliance area — I can give you a detailed breakdown.`;

function getAIResponse(msg) {
  const lower = msg.toLowerCase();
  for (const { match, reply } of aiPatterns) {
    if (match.some(kw => lower.includes(kw))) return reply;
  }
  return aiDefaultReply;
}

function sendMessage(inputId, containerid) {
  const input = document.getElementById(inputId);
  const container = document.getElementById(containerid);
  const msg = input.value.trim();
  if (!msg) return;
  input.value = '';

  const now = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  container.innerHTML += `<div class="msg msg-user"><div class="msg-bubble">${msg}</div><div class="msg-time">${now}</div></div>`;
  container.scrollTop = container.scrollHeight;

  setTimeout(() => {
    const reply = getAIResponse(msg);
    container.innerHTML += `<div class="msg msg-ai"><div class="msg-bubble">${reply}</div><div class="msg-time">Amaea AI · ${now}</div></div>`;
    container.scrollTop = container.scrollHeight;
  }, 900);
}

// ── Analytics drilldown ────────────────────────────────────────
function openDrilldown(type) {
  const data = {
    ontime: { title: 'On Time — 156 Annual Reviews', desc: 'Completed within the 12-month FCA requirement window.' },
    missed: { title: 'Missed — 18 Annual Reviews', desc: 'These clients have not received a review within 12 months. Regulatory breach — immediate action required.' },
    inprog: { title: 'In Progress — 73 Annual Reviews', desc: 'Appointments booked or in the process of being arranged. SLA clock still running.' }
  };
  const d = data[type];
  if (!d) return;
  document.getElementById('drilldown-title').textContent = d.title;
  document.getElementById('drilldown-desc').textContent = d.desc;
  openModal('drilldown-modal');
}

// ── Dismiss insight card ───────────────────────────────────────
function dismissInsight(id) {
  const card = document.getElementById(id);
  if (!card) return;
  card.style.transition = 'opacity 0.3s, transform 0.3s, max-height 0.4s, margin 0.4s, padding 0.4s';
  card.style.opacity = '0';
  card.style.transform = 'translateY(-8px)';
  card.style.maxHeight = card.offsetHeight + 'px';
  requestAnimationFrame(() => { card.style.maxHeight = '0'; card.style.marginBottom = '0'; card.style.padding = '0'; });
  setTimeout(() => { card.remove(); showToast('Insight dismissed', 'info', 2000); }, 420);
}
