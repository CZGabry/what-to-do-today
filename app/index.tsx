import React, { useEffect, useState } from 'react';
import { Image, View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications'; // Import Notifications here
import { getNotificationPermissions, scheduleNotification } from '../services/notifications'; // Import your functions

const StartPage = () => {
  const [showRedirect, setShowRedirect] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowRedirect(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showRedirect) {
      router.replace('/(tabs)/views/TodayScreen');
    }
  }, [showRedirect]);

  useEffect(() => {
    getNotificationPermissions(); // Request notification permissions
    scheduleNotification();       // Schedule notifications

    // Add notification response listener
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      router.replace('/(tabs)/views/TodayScreen');
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/thinking.png')} style={styles.image} />
      <Text style={styles.text}>What to do today...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain', 
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default StartPage;
