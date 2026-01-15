import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen({ userData, setScreen, setIsLoggedIn }) {

    useEffect(()=>{
        console.log(userData);
    }, [])


  const initials =
    userData?.fullName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  const logout = async () => {
    await AsyncStorage.clear();
    setIsLoggedIn(false);
  };

  const Row = ({ icon, label, onPress }) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        pressed && { opacity: 0.6 },
      ]}
    >
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={20} color="#fff" />
        <Text style={styles.rowText}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#777" />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <Text style={styles.name}>{userData.fullName}</Text>
        <Text style={styles.sub}>
          +91 {userData.mobileNumber} • {userData.city}
        </Text>
      </View>

      <View style={styles.upiCard}>
        <Text style={styles.upiLabel}>Wallet Balance</Text>
        <Text style={styles.upiAmount}>₹{userData.balance}</Text>
      </View>

      <View style={styles.section}>
        <Row icon="person-outline" label="Edit Profile" />
        <Row icon="time-outline" label="Your Trips" />
        <Row icon="help-circle-outline" label="Help & Support" />
      </View>

      <Pressable onPress={logout} style={styles.logout}>
        <Ionicons name="log-out-outline" size={20} color="#ff4444" />
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingTop: 50,
  },

  header: {
    alignItems: "center",
    marginBottom: 30,
  },

  avatar: {
    height: 90,
    width: 90,
    borderRadius: 45,
    backgroundColor: "#1f1f1f",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  avatarText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "700",
  },

  name: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },

  sub: {
    color: "#888",
    fontSize: 13,
    marginTop: 4,
  },

  upiCard: {
    backgroundColor: "#111",
    borderRadius: 14,
    padding: 18,
    marginBottom: 30,
  },

  upiLabel: {
    color: "#aaa",
    fontSize: 12,
  },

  upiAmount: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    marginVertical: 6,
  },

  upiSub: {
    color: "#666",
    fontSize: 12,
  },

  section: {
    backgroundColor: "#0e0e0e",
    borderRadius: 14,
    overflow: "hidden",
  },

  row: {
    paddingVertical: 16,
    paddingHorizontal: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#1f1f1f",
  },

  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  rowText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },

  logout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 30,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ff444420",
  },

  logoutText: {
    color: "#ff4444",
    fontWeight: "600",
    fontSize: 14,
  },
});
