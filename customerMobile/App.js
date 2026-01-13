import React, { useEffect, useState } from "react";

import AuthScreen from "./src/screens/AuthScreen";
import HomeScreen from "./src/screens/HomeScreen";
import OrdersScreen from "./src/screens/OrdersScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setuser] = useState({mobileNumber:'', fullName:'', city:''});

  const getUser = async ()=>{
    try{
      const loggedIn = await AsyncStorage.getItem('isUserLoggedIn');
      setIsLoggedIn(true);
      if (loggedIn){
        const userDataJson = await AsyncStorage.getItem('user');
        setuser(JSON.parse(userDataJson));
      }
    }
    catch (e){
      Alert.alert('error getting user!')
    }
  }

  useEffect(()=>{
    getUser();
  }, [])

  if (!isLoggedIn){
    return(
      <AuthScreen setIsLoggedIn={setIsLoggedIn} />
    )
  }
  else{
    return (
      <HomeScreen userData={user} />
    )
  }
}