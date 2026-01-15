import React, { useEffect, useState } from "react";
import AuthScreen from "./src/screens/AuthScreen";
import HomeScreen from "./src/screens/HomeScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import BottomBar from "./src/components/BottomBar";
import BookRide from "./src/screens/BookRide";
import ProfileScreen from "./src/screens/ProfileScreen";
import MapRideScreen from "./src/screens/MapRideScreen";


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({
    mobileNumber: "",
    fullName: "",
    city: "",
    balance: 0,
  });

  // const [storedUser, setStoredUser] = useState({});

  const analChange = async ()=>{
    if (!isLoggedIn){return}

    const currentUserStored = await AsyncStorage.getItem("user");
    if (currentUserStored != user){
      setUser(currentUserStored);
    }
    return;
  }

  useEffect(()=>{
    analChange();
  }, [])

  const [screen, setScreen] = useState({
    NAME: "HOME",
    DATA: {},
  });

  useEffect(() => {
    const getUser = async () => {
      try {
        const loggedIn = await AsyncStorage.getItem("isUserLoggedIn");
        if (loggedIn) {
          setIsLoggedIn(true);
          const userDataJson = await AsyncStorage.getItem("user");
          setUser(JSON.parse(userDataJson));
        }
      } catch {
        Alert.alert("Error getting user");
      }
    };

    getUser();
  }, []);

  const checkUserData = async ()=>{
    const isLoggedInStorage = await AsyncStorage.getItem('isUserLoggedIn');

    if (!isLoggedInStorage){
      setIsLoggedIn(false);
    }
  }

  // useEffect(()=>{
    
  // }, [user])

  if (!isLoggedIn) {
    return <AuthScreen setIsLoggedIn={setIsLoggedIn} />;
  }

  const renderScreen = () => {
    switch (screen.NAME) {
      case "HOME":
        return (
          <HomeScreen
            userData={user}
            setScreen={setScreen}
            data={screen.DATA}
          />
        );

      case "BOOK-RIDE":
        return (
          <BookRide
            userData={user}
            setScreen={setScreen}
            data={screen.DATA}
          />
        );

      case "PROFILE":
        return (
          <ProfileScreen 
            userData={user}
            setScreen={setScreen}
            setIsLoggedIn={setIsLoggedIn}
            data={screen.DATA}
          />
        );
      
      case "RIDE":
        return (
          <MapRideScreen />
        )
        
      default:
        return null;
    }
  };

  return (
    <>
      {renderScreen()}
      {screen.NAME=="RIDE"?'':<BottomBar screen={screen} setScreen={setScreen} />}
    </>
  );
}

