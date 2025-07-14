// Default settings
const DEFAULT_SETTINGS = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
};

// State
let currentSettings = { ...DEFAULT_SETTINGS };
let timeRemaining = currentSettings.workDuration * 60;
let isWorkMode = true;
let isRunning = false;
let timerId = null;
let sessionCount = 0;

// Initialize state and settings from storage
async function initializeState() {
  const result = await chrome.storage.local.get(['timeRemaining', 'isRunning', 'isWorkMode', 'sessionCount', 'settings']);
  
  if (result.settings) {
    currentSettings = result.settings;
    console.log('Loaded settings:', currentSettings);
  }
  
  if (result.timeRemaining !== undefined) {
    timeRemaining = result.timeRemaining;
    isRunning = result.isRunning;
    isWorkMode = result.isWorkMode;
    sessionCount = result.sessionCount || 0;
    
    if (isRunning) {
      startTimer();
    }
  } else {
    timeRemaining = currentSettings.workDuration * 60;
  }
}

// Initialize on load
initializeState();

// Message handling
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'START':
      isRunning = true;
      if (message.settings) {
        currentSettings = message.settings;
      }
      if (message.timeRemaining !== undefined) {
        timeRemaining = message.timeRemaining;
      }
      if (message.isWorkMode !== undefined) {
        isWorkMode = message.isWorkMode;
      }
      if (message.sessionCount !== undefined) {
        sessionCount = message.sessionCount;
      }
      startTimer();
      break;
    case 'UPDATE_SETTINGS':
      currentSettings = message.settings;
      // Update current timer if running
      if (isRunning) {
        const currentMode = isWorkMode ? 'work' : 
          (sessionCount % currentSettings.longBreakInterval === 0 ? 'longBreak' : 'shortBreak');
        
        const newDuration = currentMode === 'work' ? currentSettings.workDuration :
          currentMode === 'longBreak' ? currentSettings.longBreakDuration :
          currentSettings.shortBreakDuration;
        
        timeRemaining = newDuration * 60;
        updatePopup();
      }
      saveState();
      break;
    case 'PAUSE':
      isRunning = false;
      clearInterval(timerId);
      saveState();
      break;
    case 'RESET':
      isRunning = false;
      isWorkMode = true;
      sessionCount = 0;
      timeRemaining = currentSettings.workDuration * 60;
      clearInterval(timerId);
      saveState();
      break;
  }
});

function startTimer() {
  console.log('Starting timer with settings:', currentSettings);
  console.log('Current time remaining:', timeRemaining);
  console.log('Is work mode:', isWorkMode);
  
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
  console.log('Timer complete. Current settings:', currentSettings);
  
  if (isWorkMode) {
    sessionCount++;
    isWorkMode = false;
    
    // Check if it's time for a long break
    if (sessionCount % currentSettings.longBreakInterval === 0) {
      console.log('Starting long break:', currentSettings.longBreakDuration);
      timeRemaining = currentSettings.longBreakDuration * 60;
    } else {
      console.log('Starting short break:', currentSettings.shortBreakDuration);
      timeRemaining = currentSettings.shortBreakDuration * 60;
    }
  } else {
    isWorkMode = true;
    console.log('Starting work time:', currentSettings.workDuration);
    timeRemaining = currentSettings.workDuration * 60;
  }
  
  // Create notification
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icon.png',
    title: 'Pomodoro Timer',
    message: isWorkMode ? 'Break is over! Time to work!' : 
      (sessionCount % currentSettings.longBreakInterval === 0 ? 
        'Great job! Take a long break!' : 
        'Good work! Take a short break!'),
    priority: 2
  });
}

function updatePopup() {
  chrome.runtime.sendMessage({
    type: 'TIMER_UPDATE',
    timeRemaining: timeRemaining,
    isWorkMode: isWorkMode,
    sessionCount: sessionCount
  });
}

function saveState() {
  chrome.storage.local.set({
    timeRemaining: timeRemaining,
    isRunning: isRunning,
    isWorkMode: isWorkMode,
    sessionCount: sessionCount,
    settings: currentSettings
  });
}
