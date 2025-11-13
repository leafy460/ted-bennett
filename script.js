/* script.js — functionality for Case File website
   Handles:
   - Section navigation
   - Timeline add/export
   - Quote add
   - Tip form (demo local save)
*/

/* ---------------- Navigation ---------------- */
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.target;
    showSection(target);
  });
});

function showSection(id) {
  document.querySelectorAll('.page-section').forEach(sec => {
    sec.classList.remove('active');
  });
  const section = document.getElementById(id);
  if (section) {
    section.classList.add('active');
    section.focus();
  }
}

// Shortcut button inside Summary → Timeline
const toTimeline = document.getElementById('toTimeline');
if (toTimeline) {
  toTimeline.addEventListener('click', () => showSection('timeline'));
}

/* ---------------- Timeline ---------------- */
const timelineList = document.getElementById('timeline-list');
const addTimeline = document.getElementById('addTimeline');
const exportTimeline = document.getElementById('exportTimeline');

// Add timeline item
if (addTimeline) {
  addTimeline.addEventListener('click', () => {
    const text = prompt('Enter a new timeline event:');
    if (!text) return;

    const li = document.createElement('li');
    li.innerHTML = `<strong>${new Date().toLocaleDateString()}:</strong> ${escapeHtml(text)}`;
    timelineList.appendChild(li);
    saveTimeline();
  });
}

// Export timeline to JSON
if (exportTimeline) {
  exportTimeline.addEventListener('click', () => {
    const events = Array.from(timelineList.children).map(li => li.innerText);
    const blob = new Blob([JSON.stringify(events, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'timeline.json';
    a.click();
    URL.revokeObjectURL(url);
  });
}

// Save & restore timeline locally
function saveTimeline() {
  const items = Array.from(timelineList.children).map(li => li.innerHTML);
  localStorage.setItem('timelineItems', JSON.stringify(items));
}
function loadTimeline() {
  const raw = localStorage.getItem('timelineItems');
  if (!raw) return;
  try {
    const items = JSON.parse(raw);
    timelineList.innerHTML = '';
    items.forEach(html => {
      const li = document.createElement('li');
      li.innerHTML = html;
      timelineList.appendChild(li);
    });
  } catch (e) {
    console.warn('Failed to load timeline:', e);
  }
}
loadTimeline();

/* ---------------- Quotes ---------------- */
const addQuote = document.getElementById('addQuote');
if (addQuote) {
  addQuote.addEventListener('click', () => {
    const quote = prompt('Enter a short quote (25 words max):');
    if (!quote) return;

    const block = document.createElement('blockquote');
    block.innerHTML = `<p>"${escapeHtml(quote)}"</p><footer>— User added</footer>`;
    document.getElementById('quotes').appendChild(block);
    saveQuotes();
  });
}

function saveQuotes() {
  const quotes = Array.from(document.querySelectorAll('#quotes blockquote')).map(b => b.innerHTML);
  localStorage.setItem('quotesData', JSON.stringify(quotes));
}
function loadQuotes() {
  const raw = localStorage.getItem('quotesData');
  if (!raw) return;
  try {
    const quotes = JSON.parse(raw);
    const quotesSection = document.getElementById('quotes');
    quotes.forEach(html => {
      const block = document.createElement('blockquote');
      block.innerHTML = html;
      quotesSection.appendChild(block);
    });
  } catch (e) {
    console.warn('Failed to load quotes:', e);
  }
}
loadQuotes();

/* ---------------- Tip Form ---------------- */
const submitTip = document.getElementById('submitTip');
const clearTip = document.getElementById('clearTip');

if (submitTip) {
  submitTip.addEventListener('click', () => {
    const name = document.getElementById('tipName').value.trim();
    const contact = document.getElementById('tipContact').value.trim();
    const message = document.getElementById('tipMessage').value.trim();

    if (!message) {
      alert('Message is required.');
      return;
    }

    const tips = JSON.parse(localStorage.getItem('tipsData') || '[]');
    tips.push({
      name,
      contact,
      message,
      date: new Date().toLocaleString()
    });
    localStorage.setItem('tipsData', JSON.stringify(tips));

    alert('Tip saved locally (demo only).');
    document.getElementById('tipForm').reset();
  });
}

if (clearTip) {
  clearTip.addEventListener('click', () => {
    document.getElementById('tipForm').reset();
  });
}

/* ---------------- Helpers ---------------- */
function escapeHtml(str) {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
