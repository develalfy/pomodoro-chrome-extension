// Constants
const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

// State
let timeRemaining = WORK_TIME;
let isWorkMode = true;
let isRunning = false;
let timerId = null;

// Initialize state from storage
chrome.storage.local.get(['timeRemaining', 'isRunning', 'isWorkMode'], (result) => {
  if (result.timeRemaining !== undefined) {
    timeRemaining = result.timeRemaining;
    isRunning = result.isRunning;
    isWorkMode = result.isWorkMode;
    if (isRunning) {
      startTimer();
    }
  }
});

// Message handling
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'START':
      isRunning = true;
      startTimer();
      break;
    case 'PAUSE':
      isRunning = false;
      clearInterval(timerId);
      saveState();
      break;
    case 'RESET':
      isRunning = false;
      isWorkMode = true;
      timeRemaining = WORK_TIME;
      clearInterval(timerId);
      saveState();
      break;
  }
});

function startTimer() {
  clearInterval(timerId);
  timerId = setInterval(() => {
    timeRemaining--;
    
    if (timeRemaining <= 0) {
      handleTimerComplete();
    }
    
    updatePopup();
    saveState();
  }, 1000);
}

function handleTimerComplete() {
  isWorkMode = !isWorkMode;
  timeRemaining = isWorkMode ? WORK_TIME : BREAK_TIME;
  
  // Create notification
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icon.png',
    title: 'Pomodoro Timer',
    message: isWorkMode ? 'Break is over! Time to work!' : 'Good job! Take a break!',
    priority: 2
  });
}

function updatePopup() {
  chrome.runtime.sendMessage({
    type: 'TIMER_UPDATE',
    timeRemaining: timeRemaining,
    isWorkMode: isWorkMode
  });
}

function saveState() {
  chrome.storage.local.set({
    timeRemaining: timeRemaining,
    isRunning: isRunning,
    isWorkMode: isWorkMode
  });
}
