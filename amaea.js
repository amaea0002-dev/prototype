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
  document.querySelector('.sidebar')?.classList.toggle('open');
  document.querySelector('.sb-overlay')?.classList.toggle('open');
}
function closeSidebar() {
  document.querySelector('.sidebar')?.classList.remove('open');
  document.querySelector('.sb-overlay')?.classList.remove('open');
}
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => { if (window.innerWidth <= 960) closeSidebar(); });
  });
});

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
  'initial-0047': {
    title: 'Initial Client Engagement', stage: 'Stage 1 · Initial Work', date: 'Mar 2023', status: 'Compliant',
    docs: [
      { label: 'Client Agreement / Letter of Engagement', status: 'ok' },
      { label: 'Fact Find — Personal Circumstances', status: 'ok' },
      { label: 'Risk Profile Assessment', status: 'ok' },
      { label: 'ID & Anti-Money Laundering Checks', status: 'ok' },
      { label: 'Initial Suitability Report', status: 'ok' }
    ]
  },
  'adhoc-0047': {
    title: 'Pension Drawdown Review', stage: 'Stage 2 · Ad-hoc Work', date: 'Sep 2023', status: 'Missing document',
    docs: [
      { label: 'Drawdown Suitability Report', status: 'miss' },
      { label: 'Updated Risk Profile', status: 'ok' },
      { label: 'Flexi-Access Drawdown Illustration', status: 'ok' },
      { label: 'Client Signed Agreement', status: 'ok' },
      { label: 'Transfer Value Analysis (if applicable)', status: 'pend' }
    ]
  },
  'ar1-0047': {
    title: 'Annual Review 1', stage: 'Stage 3 · Annual Review', date: 'Mar 2024', status: 'Compliant',
    docs: [
      { label: 'Annual Review Suitability Report', status: 'ok' },
      { label: 'Updated Fact Find', status: 'ok' },
      { label: 'Portfolio Valuation & Performance Review', status: 'ok' },
      { label: 'Consumer Duty Outcome Assessment', status: 'ok' },
      { label: 'Signed Client Acknowledgement', status: 'ok' }
    ]
  },
  'ar2-0047': {
    title: 'Annual Review 2 — OVERDUE', stage: 'Stage 3 · Annual Review', date: 'Due Mar 2025 (14 months elapsed)', status: 'Breach',
    docs: [
      { label: 'Annual Review Suitability Report', status: 'miss' },
      { label: 'Updated Fact Find', status: 'miss' },
      { label: 'Portfolio Valuation & Performance Review', status: 'miss' },
      { label: 'Consumer Duty Outcome Assessment', status: 'miss' },
      { label: 'Signed Client Acknowledgement', status: 'pend' }
    ]
  },
  'initial-0089': {
    title: 'Initial Client Engagement', stage: 'Stage 1 · Initial Work', date: 'Jun 2022', status: 'Compliant',
    docs: [
      { label: 'Client Agreement / Letter of Engagement', status: 'ok' },
      { label: 'Fact Find — Personal Circumstances', status: 'ok' },
      { label: 'Vulnerability Assessment', status: 'ok' },
      { label: 'ID & Anti-Money Laundering Checks', status: 'ok' },
      { label: 'Initial Suitability Report', status: 'ok' }
    ]
  },
  'adhoc-0089': {
    title: 'Portfolio Restructure', stage: 'Stage 2 · Ad-hoc Work', date: 'Jan 2023', status: 'Compliant',
    docs: [
      { label: 'Suitability Report — Restructure', status: 'ok' },
      { label: 'Updated Vulnerability Check', status: 'ok' },
      { label: 'Consumer Duty Fair Value Assessment', status: 'ok' },
      { label: 'Client Signed Agreement', status: 'ok' }
    ]
  },
  'ar1-0089': {
    title: 'Annual Review 1', stage: 'Stage 3 · Annual Review', date: 'Jun 2023', status: 'Compliant',
    docs: [
      { label: 'Annual Review Suitability Report', status: 'ok' },
      { label: 'Updated Fact Find', status: 'ok' },
      { label: 'Vulnerability Re-assessment', status: 'ok' },
      { label: 'Consumer Duty Outcome Assessment', status: 'ok' },
      { label: 'Signed Client Acknowledgement', status: 'ok' }
    ]
  },
  'ar2-0089': {
    title: 'Annual Review 2 — OVERDUE', stage: 'Stage 3 · Annual Review', date: 'Due Jun 2024 (11 months elapsed)', status: 'Breach',
    docs: [
      { label: 'Annual Review Suitability Report', status: 'miss' },
      { label: 'Updated Vulnerability Re-assessment', status: 'miss' },
      { label: 'Consumer Duty Outcome Assessment', status: 'miss' },
      { label: 'Portfolio Valuation & Performance Review', status: 'pend' },
      { label: 'Signed Client Acknowledgement', status: 'miss' }
    ]
  }
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
  document.getElementById('milestone-modal-sub').innerHTML = `<span style="font-weight:600;color:var(--t2);">${d.stage}</span> · ${d.date} · <span class="badge badge-${statusColor}">${d.status}</span>`;
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

  const timelines = {
    'CLI-0047': `
      <div class="stage-header"><span class="stage-tag" style="color:var(--blue);">Stage 1 · Initial Work</span><div class="stage-line"></div></div>
      <button class="milestone-btn" onclick="openMilestone('initial-0047')">
        <div class="milestone-dot-col"><div class="m-dot" style="color:var(--green);background:var(--green);"></div><div class="m-line"></div></div>
        <div class="milestone-body"><div class="m-type" style="color:var(--blue);">Initial Work</div><div class="m-title">Initial Client Engagement</div><div class="m-sub">Mar 2023 · <span style="color:var(--green);font-weight:600;">Compliant</span> · Click to review documents</div></div>
      </button>
      <div class="stage-header"><span class="stage-tag" style="color:var(--amber);">Stage 2 · Ad-hoc Work</span><div class="stage-line"></div></div>
      <button class="milestone-btn" onclick="openMilestone('adhoc-0047')">
        <div class="milestone-dot-col"><div class="m-dot" style="color:var(--amber);background:var(--amber);"></div><div class="m-line"></div></div>
        <div class="milestone-body"><div class="m-type" style="color:var(--amber);">Ad-hoc</div><div class="m-title">Pension Drawdown</div><div class="m-sub">Sep 2023 · <span style="color:var(--amber);font-weight:600;">Missing document</span> · Click to review</div></div>
      </button>
      <div class="stage-header"><span class="stage-tag" style="color:var(--plum-soft);">Stage 3 · Annual Reviews</span><div class="stage-line"></div></div>
      <button class="milestone-btn" onclick="openMilestone('ar1-0047')">
        <div class="milestone-dot-col"><div class="m-dot" style="color:var(--green);background:var(--green);"></div><div class="m-line"></div></div>
        <div class="milestone-body"><div class="m-type" style="color:var(--plum-soft);">Annual Review 1</div><div class="m-title">Annual Review — March 2024</div><div class="m-sub">Mar 2024 · <span style="color:var(--green);font-weight:600;">Compliant</span> · Click to review</div></div>
      </button>
      <button class="milestone-btn" onclick="openMilestone('ar2-0047')">
        <div class="milestone-dot-col"><div class="m-dot" style="color:var(--red);background:var(--red);"></div></div>
        <div class="milestone-body" style="padding-bottom:0"><div class="m-type" style="color:var(--plum-soft);">Annual Review 2</div><div class="m-title" style="color:var(--red);">Annual Review 2 — OVERDUE</div><div class="m-sub">Due Mar 2025 · <span style="color:var(--red);font-weight:600;">14 months elapsed · Click to see gaps</span></div></div>
      </button>`,
    'CLI-0089': `
      <div class="stage-header"><span class="stage-tag" style="color:var(--blue);">Stage 1 · Initial Work</span><div class="stage-line"></div></div>
      <button class="milestone-btn" onclick="openMilestone('initial-0089')">
        <div class="milestone-dot-col"><div class="m-dot" style="color:var(--green);background:var(--green);"></div><div class="m-line"></div></div>
        <div class="milestone-body"><div class="m-type" style="color:var(--blue);">Initial Work</div><div class="m-title">Initial Client Engagement</div><div class="m-sub">Jun 2022 · <span style="color:var(--green);font-weight:600;">Compliant</span></div></div>
      </button>
      <div class="stage-header"><span class="stage-tag" style="color:var(--amber);">Stage 2 · Ad-hoc Work</span><div class="stage-line"></div></div>
      <button class="milestone-btn" onclick="openMilestone('adhoc-0089')">
        <div class="milestone-dot-col"><div class="m-dot" style="color:var(--green);background:var(--green);"></div><div class="m-line"></div></div>
        <div class="milestone-body"><div class="m-type" style="color:var(--amber);">Ad-hoc</div><div class="m-title">Portfolio Restructure</div><div class="m-sub">Jan 2023 · <span style="color:var(--green);font-weight:600;">Compliant</span></div></div>
      </button>
      <div class="stage-header"><span class="stage-tag" style="color:var(--plum-soft);">Stage 3 · Annual Reviews</span><div class="stage-line"></div></div>
      <button class="milestone-btn" onclick="openMilestone('ar1-0089')">
        <div class="milestone-dot-col"><div class="m-dot" style="color:var(--green);background:var(--green);"></div><div class="m-line"></div></div>
        <div class="milestone-body"><div class="m-type" style="color:var(--plum-soft);">Annual Review 1</div><div class="m-title">Annual Review — June 2023</div><div class="m-sub">Jun 2023 · <span style="color:var(--green);font-weight:600;">Compliant</span></div></div>
      </button>
      <button class="milestone-btn" onclick="openMilestone('ar2-0089')">
        <div class="milestone-dot-col"><div class="m-dot" style="color:var(--red);background:var(--red);"></div></div>
        <div class="milestone-body" style="padding-bottom:0"><div class="m-type" style="color:var(--plum-soft);">Annual Review 2</div><div class="m-title" style="color:var(--red);">Annual Review 2 — OVERDUE</div><div class="m-sub">Due Jun 2024 · <span style="color:var(--red);font-weight:600;">11 months elapsed · Click to see gaps</span></div></div>
      </button>`
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
const aiResponses = {
  'overdue': 'There are currently 18 clients with overdue annual reviews. The longest elapsed is 14 months (CLI-0047). FCA rules require reviews within 12 months — these are now in breach territory. I recommend prioritising the 6 vulnerable clients first.',
  'vulnerable': 'You have 9 vulnerable clients across the book. Under Consumer Duty, you must demonstrate enhanced monitoring and fair outcomes for these clients. 3 currently have incomplete documentation, which is a priority risk.',
  'rmar': 'Your RMAR (Retail Mediation Activities Return) is due 31 May — 25 days away. I\'ve pre-populated the required data from Intelliflo. There are 3 data gaps in section B that need your input before I can generate a submission-ready report.',
  'consumer duty': 'Consumer Duty requires annual assessments of fair value, consumer understanding, consumer support, and products & services outcomes. Your current score is 82/100. The main gap is documentation completeness at 61%.',
  'default': 'I can help you monitor FCA compliance obligations, identify documentation gaps, track client journey milestones, and flag regulatory risks across your book. What would you like to look at?'
};

function getAIResponse(msg) {
  const lower = msg.toLowerCase();
  for (const [key, val] of Object.entries(aiResponses)) {
    if (lower.includes(key)) return val;
  }
  return aiResponses.default;
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
