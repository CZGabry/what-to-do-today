import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Alias the Notification type from expo-notifications to avoid conflicts with the web's Notification type
type ExpoNotification = Notifications.Notification;

// Function to request notification permissions
export const getNotificationPermissions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission for notifications was denied!');
  }
};

// Function to fetch the task title for the notification body
const getTaskTitle = async () => {
  const storedTasks = await AsyncStorage.getItem('@tasks');
  let firstTaskTitle = 'No tasks available';

  if (storedTasks) {
    const parsedTasks = JSON.parse(storedTasks);
    if (parsedTasks.length > 0) {
      const randomIndex = Math.floor(Math.random() * parsedTasks.length);
      firstTaskTitle = parsedTasks[randomIndex].title;
    }
  }

  return firstTaskTitle;
};

// Function to schedule a notification at a specific time
export const scheduleDailyNotification = async (hour: number, minute: number) => {
  const taskTitle = await getTaskTitle();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'There is some work to be done',
      body: taskTitle,
    },
    trigger: {
      hour: hour,
      minute: minute,
      repeats: true,
    },
  });
};

// Optionally, an example function to schedule notifications at default times
export const scheduleDefaultNotifications = async () => {
  await scheduleDailyNotification(9, 0);
  await scheduleDailyNotification(14, 0);
  await scheduleDailyNotification(18, 0);
};
