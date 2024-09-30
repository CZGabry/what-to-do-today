import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';

export default function TabLayout() {
  // Define your custom colors
  const inactiveColor = '#6750a4'; // Darker purple for inactive tabs
  const activeColor = '#8e76cc';   // Brighter purple for active tabs

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,  // Active tab color
        tabBarInactiveTintColor: inactiveColor,  // Inactive tab color
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="views/TodayScreen"
        options={{
          title: 'Today',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'home' : 'home-outline'}
              color={focused ? activeColor : inactiveColor}  // Apply the custom colors based on focus
            />
          ),
        }}
      />
      <Tabs.Screen
        name="views/TomorrowScreen"
        options={{
          title: 'Tomorrow',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'calendar' : 'calendar-outline'}
              color={focused ? activeColor : inactiveColor}  // Apply the custom colors based on focus
            />
          ),
        }}
      />
      <Tabs.Screen
        name="views/PastScreen"
        options={{
          title: 'Past',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'calendar' : 'calendar-outline'}
              color={focused ? activeColor : inactiveColor}  // Apply the custom colors based on focus
            />
          ),
        }}
      />
    </Tabs>
  );
}
