/* ========================
   Amaea — Interactivity
   ======================== */

// ── Mobile sidebar ───────────────────────────────────────────────
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  sidebar?.classList.toggle('open');
  overlay?.classList.toggle('open');
}
function closeSidebar() {
  document.querySelector('.sidebar')?.classList.remove('open');
  document.getElementById('sidebar-overlay')?.classList.remove('open');
}
// Close sidebar when nav item clicked on mobile
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= 900) closeSidebar();
    });
  });
});

// ── Toast notifications ──────────────────────────────────────────
function showToast(message, type = 'info', duration = 3000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  container.appendChild(toast);
  requestAnimationFrame(() => { requestAnimationFrame(() => { toast.classList.add('show'); }); });
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

// ── Modals ────────────────────────────────────────────────────────
function openModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) { overlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) { overlay.classList.remove('open'); document.body.style.overflow = ''; }
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

// ── Generate button loading state ─────────────────────────────────
function simulateGenerate(btn, successMsg) {
  const orig = btn.innerHTML;
  btn.innerHTML = `<span class="spinner">↻</span> Generating...`;
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = `✓ ${successMsg || 'Generated'}`;
    btn.style.background = 'var(--success)';
    showToast('Report generated successfully', 'success');
    setTimeout(() => { btn.innerHTML = orig; btn.disabled = false; btn.style.background = ''; }, 3000);
  }, 1800);
}

// ── Sync button ───────────────────────────────────────────────────
function simulateSync(btn, name) {
  const orig = btn.innerHTML;
  btn.innerHTML = `<span class="spinner">↻</span> Syncing...`;
  btn.disabled = true;
  showToast(`Syncing ${name}...`, 'info', 1500);
  setTimeout(() => {
    btn.innerHTML = '✓ Synced';
    showToast(`${name} synced successfully`, 'success');
    setTimeout(() => { btn.innerHTML = orig; btn.disabled = false; }, 2500);
  }, 2200);
}

// ── Filter buttons ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // Filter buttons toggle
  document.querySelectorAll('.filter-bar').forEach(bar => {
    bar.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        bar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  });

  // Notification bell dropdown
  const notifBtn = document.querySelector('.notif-btn');
  const notifMenu = document.querySelector('.notif-menu');
  if (notifBtn && notifMenu) {
    notifBtn.addEventListener('click', e => {
      e.stopPropagation();
      notifMenu.classList.toggle('open');
      notifBtn.querySelector('.notif-dot')?.remove();
    });
    document.addEventListener('click', () => notifMenu.classList.remove('open'));
    notifMenu.addEventListener('click', e => e.stopPropagation());
  }

  // Client rows
  document.querySelectorAll('.data-table tr.clickable').forEach(row => {
    row.addEventListener('click', () => {
      const table = row.closest('table');
      table?.querySelectorAll('tr').forEach(r => r.classList.remove('active-row'));
      row.classList.add('active-row');
      const clientId = row.dataset.clientId;
      if (clientId) swapClientDetail(clientId);
    });
  });

  // Dismissable insight cards
  document.querySelectorAll('.dismiss-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const card = btn.closest('.insight-card');
      card.style.transition = 'all 0.3s var(--ease)';
      card.style.opacity = '0';
      card.style.transform = 'translateX(16px)';
      setTimeout(() => { card.style.maxHeight = '0'; card.style.marginBottom = '0'; card.style.padding = '0'; }, 300);
      showToast('Insight dismissed', 'info', 2000);
    });
  });

  // AI chat
  const chatForm = document.querySelector('.chat-form');
  const chatInput = document.querySelector('.chat-input-field');
  const chatMessages = document.querySelector('.chat-messages');
  if (chatForm && chatInput && chatMessages) {
    chatForm.addEventListener('submit', e => {
      e.preventDefault();
      const msg = chatInput.value.trim();
      if (!msg) return;
      appendUserMsg(chatMessages, msg);
      chatInput.value = '';
      showTyping(chatMessages);
      setTimeout(() => {
        removeTyping(chatMessages);
        appendAIMsg(chatMessages, getAIResponse(msg));
      }, 1400 + Math.random() * 600);
    });
  }

  // All generate buttons
  document.querySelectorAll('[data-action="generate"]').forEach(btn => {
    btn.addEventListener('click', () => simulateGenerate(btn, 'Report Ready'));
  });

  // All sync buttons
  document.querySelectorAll('[data-action="sync"]').forEach(btn => {
    btn.addEventListener('click', () => simulateSync(btn, btn.dataset.name || 'Data'));
  });

  // Upload area
  const uploadArea = document.querySelector('.upload-area');
  if (uploadArea) {
    uploadArea.addEventListener('dragover', e => { e.preventDefault(); uploadArea.style.borderColor = 'var(--plum)'; uploadArea.style.background = 'var(--plum-tint)'; });
    uploadArea.addEventListener('dragleave', () => { uploadArea.style.borderColor = ''; uploadArea.style.background = ''; });
    uploadArea.addEventListener('drop', e => {
      e.preventDefault(); uploadArea.style.borderColor = ''; uploadArea.style.background = '';
      const files = e.dataTransfer.files;
      if (files.length) showToast(`Uploading ${files[0].name}...`, 'info', 2000);
      setTimeout(() => showToast('File uploaded successfully', 'success'), 2200);
    });
    uploadArea.addEventListener('click', () => { showToast('File browser opened', 'info', 1500); });
  }

  // Connect integration buttons
  document.querySelectorAll('[data-action="connect"]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const name = btn.dataset.name || 'System';
      openModal('connect-modal');
      const modalTitle = document.querySelector('#connect-modal .modal-title');
      if (modalTitle) modalTitle.textContent = `Connect ${name}`;
    });
  });

});

// ── AI Chat helpers ───────────────────────────────────────────────
const responses = {
  default: "I've analysed your compliance data and can help with that. Based on the current records, the most pressing area is the 18 overdue annual reviews — would you like me to prioritise those?",
  review: "There are currently 18 overdue annual reviews. The highest risk cases are Sarah Thompson (CLI-0047) and David Okonkwo (CLI-0203), both in the vulnerable customer category and overdue by over 14 months. I recommend booking these two this week.",
  risk: "Your top 3 risk areas right now are: (1) Overdue annual reviews — 18 clients, (2) Missing suitability documentation — 34 files, and (3) Vulnerable customer Consumer Duty assessments — 8 missing. The first two carry the highest regulatory risk before your next FCA inspection.",
  report: "Your RMAR submission is due in 25 days. I've pre-populated the required data from Intelliflo and SharePoint. The report is ready for your review — would you like me to generate a draft now?",
  document: "34 client files have documentation gaps. The most common missing items are: suitability letters (18), Consumer Duty assessments (8), and expired risk profile assessments (8). I can generate batch request letters to send to these clients if you'd like.",
  health: "Your compliance health score is 82 out of 100. The main factors pulling it down are documentation completeness (61%) and annual review completion (74%). Your strongest area is suitability assessments at 91%, which is above the industry average."
};

function getAIResponse(msg) {
  const lower = msg.toLowerCase();
  if (lower.includes('review') || lower.includes('annual')) return responses.review;
  if (lower.includes('risk') || lower.includes('urgent') || lower.includes('priority')) return responses.risk;
  if (lower.includes('report') || lower.includes('rmar') || lower.includes('fca')) return responses.report;
  if (lower.includes('document') || lower.includes('missing') || lower.includes('file')) return responses.document;
  if (lower.includes('score') || lower.includes('health') || lower.includes('status')) return responses.health;
  return responses.default;
}

function appendUserMsg(container, text) {
  const msg = document.createElement('div');
  msg.className = 'ai-msg user-msg fade-up';
  msg.innerHTML = `<div class="user-bubble">${text}</div>`;
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}

function appendAIMsg(container, text) {
  const msg = document.createElement('div');
  msg.className = 'ai-msg fade-up';
  msg.innerHTML = `<div class="ai-avatar">AI</div><div class="ai-bubble">${text}</div>`;
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}

function showTyping(container) {
  const typing = document.createElement('div');
  typing.className = 'ai-msg typing-indicator fade-up';
  typing.innerHTML = `<div class="ai-avatar">AI</div><div class="ai-bubble typing"><span></span><span></span><span></span></div>`;
  container.appendChild(typing);
  container.scrollTop = container.scrollHeight;
}

function removeTyping(container) {
  container.querySelector('.typing-indicator')?.remove();
}

// ── Milestone click ───────────────────────────────────────────────
const milestoneData = {
  'initial-0047': {
    title: 'Stage 1 — Initial Client Work', date: 'Mar 2023',
    status: 'at_risk',
    documents: [
      { name: 'Client Agreement', status: 'complete', date: '14 Mar 2023' },
      { name: 'Consent Form', status: 'complete', date: '14 Mar 2023' },
      { name: 'Applications', status: 'complete', date: '14 Mar 2023' },
      { name: 'Vulnerability Assessment', status: 'complete', date: '14 Mar 2023' },
      { name: 'Work Completed (Pension consolidation)', status: 'complete', date: '28 Mar 2023' },
      { name: 'Suitability Report signed', status: 'expired', date: 'Renewal due' },
    ]
  },
  'adhoc-0047': {
    title: 'Stage 2 — Ad-hoc Work (Drawdown)', date: 'Sep 2023',
    status: 'breached',
    documents: [
      { name: 'Drawdown Application', status: 'missing', date: null },
      { name: 'Client Agreement (updated)', status: 'complete', date: '4 Sep 2023' },
      { name: 'Vulnerability Re-check', status: 'complete', date: '4 Sep 2023' },
      { name: 'ID Re-check', status: 'complete', date: '4 Sep 2023' },
    ]
  },
  'ar1-0047': {
    title: 'Stage 3 — Annual Review 1', date: 'Mar 2024',
    status: 'compliant',
    sla: { held: 'On time (12 months)', report_sent: 'On time (3 days)', report_signed: true },
    documents: [
      { name: 'Annual Review held', status: 'complete', date: '12 Mar 2024' },
      { name: 'Suitability Report sent', status: 'complete', date: '15 Mar 2024' },
      { name: 'Suitability Report signed', status: 'complete', date: '18 Mar 2024' },
      { name: 'Research sheet updated', status: 'complete', date: '12 Mar 2024' },
    ]
  },
  'ar2-0047': {
    title: 'Stage 3 — Annual Review 2', date: 'Mar 2025 — OVERDUE',
    status: 'breached',
    sla: { held: 'Breached — 14 months elapsed', report_sent: 'N/A', report_signed: false },
    documents: [
      { name: 'Annual Review held', status: 'missing', date: null },
      { name: 'Suitability Report sent', status: 'missing', date: null },
      { name: 'Suitability Report signed', status: 'missing', date: null },
      { name: 'Consumer Duty Assessment', status: 'missing', date: null },
    ]
  },
  'initial-0089': {
    title: 'Stage 1 — Initial Client Work', date: 'Jun 2021',
    status: 'compliant',
    documents: [
      { name: 'Client Agreement', status: 'complete', date: '10 Jun 2021' },
      { name: 'Consent Form', status: 'complete', date: '10 Jun 2021' },
      { name: 'Applications', status: 'complete', date: '10 Jun 2021' },
      { name: 'Vulnerability Assessment', status: 'complete', date: '10 Jun 2021' },
      { name: 'Work Completed (ISA & GIA)', status: 'complete', date: '24 Jun 2021' },
    ]
  },
  'ar1-0089': {
    title: 'Stage 3 — Annual Review 1', date: 'Jul 2022',
    status: 'compliant',
    sla: { held: 'On time (13 months)', report_sent: 'On time (4 days)', report_signed: true },
    documents: [
      { name: 'Annual Review held', status: 'complete', date: '8 Jul 2022' },
      { name: 'Suitability Report sent', status: 'complete', date: '12 Jul 2022' },
      { name: 'Suitability Report signed', status: 'complete', date: '15 Jul 2022' },
    ]
  },
  'ar2-0089': {
    title: 'Stage 3 — Annual Review 2', date: 'Jan 2025',
    status: 'compliant',
    sla: { held: 'On time (13 months)', report_sent: 'On time (2 days)', report_signed: true },
    documents: [
      { name: 'Annual Review held', status: 'complete', date: '14 Jan 2025' },
      { name: 'Suitability Report sent', status: 'complete', date: '16 Jan 2025' },
      { name: 'Suitability Report signed', status: 'complete', date: '20 Jan 2025' },
    ]
  },
};

function openMilestone(key) {
  const data = milestoneData[key];
  if (!data) return;

  const statusColour = data.status === 'compliant' ? 'var(--success)'
    : data.status === 'at_risk' ? 'var(--warning)' : 'var(--danger)';
  const statusLabel = data.status === 'compliant' ? 'Compliant'
    : data.status === 'at_risk' ? 'Attention Required' : 'Compliance Breach';
  const statusClass = data.status === 'compliant' ? 'badge-green'
    : data.status === 'at_risk' ? 'badge-amber' : 'badge-red';

  const docRows = data.documents.map(doc => {
    const icon = doc.status === 'complete' ? '✓' : doc.status === 'expired' ? '!' : '✕';
    const cls = doc.status === 'complete' ? 'ok' : doc.status === 'expired' ? 'pending' : 'missing';
    const dateStr = doc.date ? `<div style="font-size:0.7rem;color:var(--text-3);margin-top:1px;">${doc.date}</div>` : `<div style="font-size:0.7rem;color:var(--danger);margin-top:1px;">Not on file</div>`;
    return `<div style="display:flex;align-items:flex-start;gap:9px;padding:10px 0;border-bottom:1px solid var(--border);">
      <div class="doc-check ${cls}" style="width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:0.65rem;font-weight:700;">${icon}</div>
      <div style="flex:1;"><div style="font-weight:500;font-size:0.845rem;">${doc.name}</div>${dateStr}</div>
    </div>`;
  }).join('');

  const slaHtml = data.sla ? `<div style="background:var(--bg);border-radius:9px;padding:13px 14px;margin-bottom:16px;">
    <div style="font-size:0.72rem;font-weight:700;color:var(--text-3);text-transform:uppercase;letter-spacing:0.7px;margin-bottom:8px;">SLA Performance</div>
    <div style="font-size:0.82rem;display:flex;flex-direction:column;gap:5px;">
      <div class="flex-between"><span style="color:var(--text-2);">Review held</span><span style="font-weight:600;color:${data.sla.held.includes('Breach') ? 'var(--danger)' : 'var(--success)'}">${data.sla.held}</span></div>
      <div class="flex-between"><span style="color:var(--text-2);">Suitability report sent</span><span style="font-weight:600;">${data.sla.report_sent}</span></div>
      <div class="flex-between"><span style="color:var(--text-2);">Report signed by client</span><span style="font-weight:600;color:${data.sla.report_signed ? 'var(--success)' : 'var(--danger)'}">${data.sla.report_signed ? 'Yes' : 'Not signed'}</span></div>
    </div>
  </div>` : '';

  const overlay = document.getElementById('milestone-modal');
  overlay.querySelector('.modal-title').textContent = data.title;
  overlay.querySelector('.milestone-date').textContent = data.date;
  overlay.querySelector('.milestone-status').className = `badge ${statusClass} milestone-status`;
  overlay.querySelector('.milestone-status').textContent = statusLabel;
  overlay.querySelector('.milestone-sla').innerHTML = slaHtml;
  overlay.querySelector('.milestone-docs').innerHTML = docRows;
  openModal('milestone-modal');
}

// ── Client detail swap ────────────────────────────────────────────
const clientData = {
  'CLI-0047': {
    name: 'Sarah J. Thompson', initials: 'ST', id: 'CLI-0047', age: 68,
    adviser: 'James Morrison', status: 'At Risk', statusClass: 'badge-red',
    ai: "Sarah's annual review is 14 months overdue. As a vulnerable customer (aged 68), this presents elevated regulatory risk. Her 2023 suitability letter needs renewal, and no Consumer Duty outcome assessment exists in the file.",
    risk: 82, riskColor: 'var(--danger)'
  },
  'CLI-0112': {
    name: 'Rajesh K. Patel', initials: 'RP', id: 'CLI-0112', age: 54,
    adviser: 'Alex Williams', status: 'Due Soon', statusClass: 'badge-amber',
    ai: "Rajesh's annual review is due in the next 30 days. His suitability documentation is current. No immediate risk flags, but the review should be booked promptly to avoid breaching the FCA 12-month requirement.",
    risk: 45, riskColor: 'var(--warning)'
  },
  'CLI-0089': {
    name: 'Claire M. Henderson', initials: 'CH', id: 'CLI-0089', age: 61,
    adviser: 'James Morrison', status: 'Compliant', statusClass: 'badge-green',
    ai: "Claire's compliance file is fully up to date. Her annual review was completed in January 2025 and all documentation is current. No action required at this time.",
    risk: 22, riskColor: 'var(--success)'
  },
  'CLI-0203': {
    name: 'David E. Okonkwo', initials: 'DO', id: 'CLI-0203', age: 47,
    adviser: 'Alex Williams', status: 'At Risk', statusClass: 'badge-red',
    ai: "David's annual review is 15 months overdue. Two key documents are missing from his file: the Consumer Duty assessment and a current suitability letter. Immediate action required.",
    risk: 70, riskColor: 'var(--danger)'
  },
  'CLI-0156': {
    name: 'Margaret A. Fraser', initials: 'MF', id: 'CLI-0156', age: 72,
    adviser: 'Kate Davies', status: 'Compliant', statusClass: 'badge-green',
    ai: "Margaret's file is in good order. Her annual review was completed in April 2025 and all documentation is current and valid. As a client aged 72, her Consumer Duty assessment is on file and up to date.",
    risk: 18, riskColor: 'var(--success)'
  },
  'CLI-0067': {
    name: 'Amrit Singh', initials: 'AS', id: 'CLI-0067', age: 39,
    adviser: 'James Morrison', status: 'Docs Missing', statusClass: 'badge-amber',
    ai: "Amrit's annual review is current but two documents are missing from his file: a renewed suitability letter and an updated risk profile assessment. These should be requested and completed before his next review in December 2025.",
    risk: 35, riskColor: 'var(--warning)'
  },
  'CLI-0178': {
    name: 'Catherine R. Williams', initials: 'CW', id: 'CLI-0178', age: 58,
    adviser: 'Kate Davies', status: 'Compliant', statusClass: 'badge-green',
    ai: "Catherine's compliance file is fully up to date. Her annual review was completed in March 2025 and all documentation including suitability report and risk profile are current. No action required.",
    risk: 15, riskColor: 'var(--success)'
  }
};

function swapClientDetail(clientId) {
  const panel = document.getElementById('client-detail-panel');
  if (!panel || !clientData[clientId]) return;
  const c = clientData[clientId];

  // Vulnerability data
  const vulnMap = {
    'CLI-0047': { label: 'Vulnerable', cls: 'vuln-vulnerable' },
    'CLI-0203': { label: 'Vulnerable', cls: 'vuln-vulnerable' },
    'CLI-0156': { label: 'Vulnerable', cls: 'vuln-vulnerable' },
    'CLI-0112': { label: 'Standard',  cls: 'vuln-standard' },
    'CLI-0089': { label: 'Standard',  cls: 'vuln-standard' },
    'CLI-0067': { label: 'Standard',  cls: 'vuln-standard' },
    'CLI-0178': { label: 'Standard',  cls: 'vuln-standard' },
  };
  const vuln = vulnMap[clientId] || { label: 'Standard', cls: 'vuln-standard' };

  panel.style.opacity = '0';
  panel.style.transform = 'translateY(6px)';
  setTimeout(() => {
    panel.querySelector('.client-name-display').textContent = c.name;
    panel.querySelector('.client-initials').textContent = c.initials;
    panel.querySelector('.client-id-display').textContent = `${c.id} · Adviser: ${c.adviser} · Age ${c.age}`;
    panel.querySelector('.client-status-badge').className = `badge ${c.statusClass} client-status-badge`;
    panel.querySelector('.client-status-badge').textContent = c.status;
    const vb = panel.querySelector('.client-vuln-badge');
    if (vb) { vb.className = `vuln-badge ${vuln.cls} client-vuln-badge`; vb.textContent = vuln.label; }
    panel.querySelector('.ai-summary-text').textContent = c.ai;
    const riskBar = panel.querySelector('.client-risk-fill');
    if (riskBar) { riskBar.style.width = c.risk + '%'; riskBar.style.background = c.riskColor; }
    const riskLabel = panel.querySelector('.client-risk-label');
    if (riskLabel) { riskLabel.textContent = `${c.riskColor === 'var(--danger)' ? 'High' : c.riskColor === 'var(--warning)' ? 'Medium' : 'Low'} — ${c.risk}`; riskLabel.style.color = c.riskColor; }
    panel.style.opacity = '1';
    panel.style.transform = 'translateY(0)';
  }, 180);
  panel.style.transition = 'all 0.2s var(--ease)';
}
