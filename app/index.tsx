import React, { useEffect, useState } from 'react';
import { Image, View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';

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
    padding: 16, // To add some padding around the content
  },
  image: {
    width: 200, // Adjust to your desired size
    height: 200, // Adjust to your desired size
    resizeMode: 'contain', // Ensures the image is fully visible and maintains its aspect ratio
    marginBottom: 20, // Adds some space between the image and the text
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default StartPage;
