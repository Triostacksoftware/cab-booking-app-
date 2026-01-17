import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ScreenState, User } from './helpers/types';
import AuthScreen from './screens/Auth';
import Home from './screens/Home';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RideScreen from './screens/RideScreen';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [screen, setScreen] = useState<ScreenState>("HOME");
  const [userData, setUserData] = useState<User | undefined>(undefined);

  useEffect(() => {
    const bootstrap = async () => {
      const loggedIn = await AsyncStorage.getItem("isLoggedIn");
      if (loggedIn === "true") {
        setIsLoggedIn(true);
        const rawUser = await AsyncStorage.getItem("user");
        if (rawUser) setUserData(JSON.parse(rawUser));
      }
    };
    bootstrap();
  }, []);

  if (!isLoggedIn) {
    return <AuthScreen setIsLoggedIn={setIsLoggedIn} />;
  }

  switch (screen) {
    case "HOME":
      return <Home setScreen={setScreen} userData={userData} />;
    
    case "ACTIVE_RIDE":
      return <RideScreen setScreen={setScreen} userData={userData} />

    default:
      return null;
  }
}
