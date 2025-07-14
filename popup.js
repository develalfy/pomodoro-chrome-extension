// Constants
const WORK_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60;  // 5 minutes in seconds

// UI Elements
const timerDisplay = document.getElementById('timer');
const modeLabel = document.getElementById('modeLabel');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');

// Event Listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

// Initialize state from storage
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['timeRemaining', 'isRunning', 'isWorkMode'], (result) => {
    if (result.timeRemaining !== undefined) {
      updateDisplay(result.timeRemaining);
      updateMode(result.isWorkMode);
      if (result.isRunning) {
        startBtn.disabled = true;
        pauseBtn.disabled = false;
      }
    }
  });
});

function startTimer() {
  chrome.runtime.sendMessage({ action: 'START' });
  startBtn.disabled = true;
  pauseBtn.disabled = false;
}

function pauseTimer() {
  chrome.runtime.sendMessage({ action: 'PAUSE' });
  startBtn.disabled = false;
  pauseBtn.disabled = true;
}

function resetTimer() {
  chrome.runtime.sendMessage({ action: 'RESET' });
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  updateDisplay(WORK_TIME);
  updateMode(true);
}

function updateDisplay(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function updateMode(isWorkMode) {
  modeLabel.textContent = isWorkMode ? 'Work Time' : 'Break Time';
}

// Listen for updates from background script
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'TIMER_UPDATE') {
    updateDisplay(message.timeRemaining);
    updateMode(message.isWorkMode);
  }
});
