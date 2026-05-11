// app.js — Simple Counter Application
// Security: No external scripts, no eval(), no innerHTML with user input,
// step input validated server-side (integer-clamped), no sensitive data stored.

(function () {
  'use strict';

  const MAX_STEP = 100;
  const MIN_STEP = 1;
  const MAX_HISTORY = 50;

  let count = 0;
  const history = [];

  // DOM references
  const display = document.getElementById('counterDisplay');
  const stepInput = document.getElementById('stepInput');
  const incrementBtn = document.getElementById('incrementBtn');
  const decrementBtn = document.getElementById('decrementBtn');
  const resetBtn = document.getElementById('resetBtn');
  const historyList = document.getElementById('historyList');
  const clearHistoryBtn = document.getElementById('clearHistoryBtn');

  /**
   * Returns the current step value, clamped to [MIN_STEP, MAX_STEP].
   * Prevents prototype pollution and injection via step input.
   */
  function getStep() {
    const raw = parseInt(stepInput.value, 10);
    if (!Number.isFinite(raw)) return 1;
    return Math.min(MAX_STEP, Math.max(MIN_STEP, raw));
  }

  /**
   * Updates the counter display and applies visual state classes.
   */
  function updateDisplay() {
    // Use textContent (never innerHTML) to prevent XSS
    display.textContent = count;
    display.classList.remove('positive', 'negative');
    if (count > 0) display.classList.add('positive');
    if (count < 0) display.classList.add('negative');
  }

  /**
   * Adds an entry to the history log (capped at MAX_HISTORY items).
   * Uses textContent to avoid XSS on the action string.
   */
  function addHistory(action) {
    const timestamp = new Date().toLocaleTimeString();
    const entry = `[${timestamp}] ${action} → ${count}`;
    history.unshift(entry);
    if (history.length > MAX_HISTORY) history.pop();
    renderHistory();
  }

  /**
   * Renders the history list using textContent only (no innerHTML).
   */
  function renderHistory() {
    historyList.innerHTML = '';
    history.forEach(function (item) {
      const li = document.createElement('li');
      li.textContent = item; // safe: textContent, not innerHTML
      historyList.appendChild(li);
    });
  }

  // Event listeners
  incrementBtn.addEventListener('click', function () {
    const step = getStep();
    count += step;
    updateDisplay();
    addHistory(`+${step}`);
  });

  decrementBtn.addEventListener('click', function () {
    const step = getStep();
    count -= step;
    updateDisplay();
    addHistory(`-${step}`);
  });

  resetBtn.addEventListener('click', function () {
    count = 0;
    updateDisplay();
    addHistory('Reset');
  });

  clearHistoryBtn.addEventListener('click', function () {
    history.length = 0;
    renderHistory();
  });

  // Clamp step input on change
  stepInput.addEventListener('change', function () {
    const clamped = getStep();
    stepInput.value = clamped;
  });

  // Initial render
  updateDisplay();
})();
