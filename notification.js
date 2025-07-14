// Notification constants
const NOTIFICATION_TIMEOUT = 10000; // 10 seconds

class NotificationHelper {
  static async show(title, message) {
    // Generate unique notification ID
    const notificationId = 'pomodoro-' + Date.now();

    // Clear any existing notifications
    const existingNotifications = await chrome.notifications.getAll();
    for (const id of Object.keys(existingNotifications)) {
      await chrome.notifications.clear(id);
    }

    // Create new notification
    const notificationOptions = {
      type: 'basic',
      iconUrl: chrome.runtime.getURL('icons/icon128.png'),
      title: title,
      message: message,
      priority: 2,
      requireInteraction: false, // Will auto-dismiss after timeout
      silent: false // Will play system sound
    };

    try {
      // Create the notification
      await chrome.notifications.create(notificationId, notificationOptions);

      // Auto-dismiss after timeout
      setTimeout(() => {
        chrome.notifications.clear(notificationId);
      }, NOTIFICATION_TIMEOUT);

    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  }

  static showTimerComplete(isWorkMode, duration) {
    const title = 'Pomodoro Timer';
    const message = isWorkMode ? 
      `Time to focus! ${duration} minute work session starting.` :
      `Break time! Take a ${duration} minute break.`;
    
    this.show(title, message);
  }
}

// Handle notification clicks
chrome.notifications.onClicked.addListener((notificationId) => {
  chrome.notifications.clear(notificationId);
});

export { NotificationHelper };
