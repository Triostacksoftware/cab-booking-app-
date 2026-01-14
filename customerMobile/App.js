import React, { useEffect, useState } from "react";
import AuthScreen from "./src/screens/AuthScreen";
import HomeScreen from "./src/screens/HomeScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import BottomBar from "./src/components/BottomBar";
import BookRide from "./src/screens/BookRide";


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({
    mobileNumber: "",
    fullName: "",
    city: "",
    balance: 0,
  });

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

      default:
        return null;
    }
  };

  return (
    <>
      {renderScreen()}
      <BottomBar />
    </>
  );
}
