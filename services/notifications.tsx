import * as Notifications from 'expo-notifications'; // Import the expo-notifications module
import AsyncStorage from '@react-native-async-storage/async-storage';

// Alias the Notification type from expo-notifications to avoid conflicts with the web's Notification type
type ExpoNotification = Notifications.Notification;

export const getNotificationPermissions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission for notifications was denied!');
  }
};

export const scheduleNotification = async () => {
  const storedTasks = await AsyncStorage.getItem('@tasks');
  let firstTaskTitle = 'No tasks available';

  if (storedTasks) {
    const parsedTasks = JSON.parse(storedTasks);
    if (parsedTasks.length > 0) {
      const randomIndex = Math.floor(Math.random() * parsedTasks.length);
      firstTaskTitle = parsedTasks[randomIndex].title;
    }
  }

  const scheduleDailyNotification = async (hour: number, minute: number) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'There is some work to be done',
        body: firstTaskTitle,
      },
      trigger: {
        hour: hour,
        minute: minute,
        repeats: true,
      },
    });
  };

  await scheduleDailyNotification(9, 0);
  await scheduleDailyNotification(14, 0);
  await scheduleDailyNotification(18, 0);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'There is some work to be done',
      body: firstTaskTitle,
    },
    trigger: {
      seconds: 20,
    },
  });
};
