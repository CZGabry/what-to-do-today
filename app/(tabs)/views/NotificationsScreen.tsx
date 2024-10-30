import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Alert, SafeAreaView, FlatList } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scheduleDailyNotification } from '../../../services/notifications'; // Import the function
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Icon from 'react-native-vector-icons/FontAwesome';

type NotificationItem = {
  id: string;
  hour: number;
  minute: number;
};

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [time, setTime] = useState<Date | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const stored = await AsyncStorage.getItem('@notifications');
      if (stored) setNotifications(JSON.parse(stored));
    } catch (error) {
      Alert.alert('Error', 'Failed to load notifications.');
    }
  };

  const saveNotifications = async (newNotifications: NotificationItem[]) => {
    try {
      await AsyncStorage.setItem('@notifications', JSON.stringify(newNotifications));
      setNotifications(newNotifications);
    } catch (error) {
      Alert.alert('Error', 'Failed to save notifications.');
    }
  };

  const addNotification = async (selectedTime: Date) => {
    // Limit check
    if (notifications.length >= 10) {
      Alert.alert("Limit Reached", "You can only have up to 10 notifications.");
      return;
    }
  
    const hour = selectedTime.getHours();
    const minute = selectedTime.getMinutes();
  
    // Duplicate check
    const alreadyExists = notifications.some(
      (notification) => notification.hour === hour && notification.minute === minute
    );
  
    if (alreadyExists) {
      Alert.alert("Duplicate Notification", "A notification at this time already exists.");
      return;
    }
  
    // Schedule the notification
    await scheduleDailyNotification(hour, minute);
  
    // Add the new notification to the list
    const newNotification = { id: `${hour}:${minute}`, hour, minute };
    const updatedNotifications = [...notifications, newNotification];
    await saveNotifications(updatedNotifications);
    setTime(null);
    setShowTimePicker(false);
  };
  

  const removeNotification = async (id: string) => {
    const updatedNotifications = notifications.filter((notif) => notif.id !== id);
    await saveNotifications(updatedNotifications);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ThemedView style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <ThemedText type="title">Notifications</ThemedText>
            <Icon name="clock-o" size={24} style={styles.icon} />
          </View>
        </ThemedView>

        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.notificationItem}>
              <Icon name="bell" size={20} color="#6750a4" style={styles.notificationIcon} />
              <Text style={styles.notificationText}>
                {`Notification at ${item.hour}:${item.minute.toString().padStart(2, '0')}`}
              </Text>
              <TouchableOpacity onPress={() => removeNotification(item.id)}>
                <Icon name="trash" size={20} color="red" />
              </TouchableOpacity>
            </View>
          )}
        />

        {/* Floating Action Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>

        {/* DateTimePicker that opens directly */}
        {showTimePicker && (
          <DateTimePicker
            value={time || new Date()}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={(event, selectedTime) => {
              setShowTimePicker(false);
              if (event.type === "set" && selectedTime) {
                addNotification(selectedTime); // Only add notification if "OK" is clicked
              }
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingTop: 50,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginLeft: 8,
    color: '#6750a4',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15, // Increase padding for more height
    marginVertical: 8, // Add spacing between items
    borderRadius: 15, // Rounded corners
    backgroundColor: '#f9f9f9', // Background color for each item
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
  },
  notificationIcon: {
    marginRight: 10,
  },
  notificationText: {
    flex: 1,
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#6750a4',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabText: {
    color: '#fff',
    fontSize: 24,
  },
});

