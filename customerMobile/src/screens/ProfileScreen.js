import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen({ userData, setScreen, setIsLoggedIn }) {
  const [activeModal, setActiveModal] = useState(null);
  const [editName, setEditName] = useState(userData.fullName || "");
  const [editCity, setEditCity] = useState(userData.city || "");

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
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <Text style={styles.name}>{userData.fullName}</Text>
        <Text style={styles.sub}>
          +91 {userData.mobileNumber} • {userData.city}
        </Text>
      </View>

      {/* WALLET */}
      <View style={styles.upiCard}>
        <Text style={styles.upiLabel}>UPI Wallet</Text>
        <Text style={styles.upiAmount}>₹{userData.balance}</Text>
      </View>

      {/* ACTIONS */}
      <View style={styles.section}>
        <Row
          icon="person-outline"
          label="Edit Profile"
          onPress={() => setActiveModal("EDIT_PROFILE")}
        />
        <Row
          icon="time-outline"
          label="My Trips"
          onPress={() => setActiveModal("MY_TRIPS")}
        />
        <Row icon="help-circle-outline" label="Help & Support" />
      </View>

      {/* LOGOUT */}
      <Pressable onPress={logout} style={styles.logout}>
        <Ionicons name="log-out-outline" size={20} color="#ff4444" />
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>


      {/* EDIT PROFILE MODAL */}
      <Modal transparent visible={activeModal === "EDIT_PROFILE"} animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            <TextInput
              value={editName}
              onChangeText={setEditName}
              placeholder="Full Name"
              placeholderTextColor="#666"
              style={styles.input}
            />

            <TextInput
              value={editCity}
              onChangeText={setEditCity}
              placeholder="City"
              placeholderTextColor="#666"
              style={styles.input}
            />

            <Pressable
              style={styles.primaryBtn}
              onPress={() => {
                // backend will handle this later
                setActiveModal(null);
              }}
            >
              <Text style={styles.primaryText}>Save Changes</Text>
            </Pressable>

            <Pressable onPress={() => setActiveModal(null)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* MY TRIPS MODAL */}
      <Modal transparent visible={activeModal === "MY_TRIPS"} animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Your Trips</Text>

            {/* Dummy trip list */}
            <View style={styles.tripItem}>
              <Text style={styles.tripMain}>Connaught Place → IGI Airport</Text>
              <Text style={styles.tripSub}>₹100 • Completed</Text>
            </View>

            <View style={styles.tripItem}>
              <Text style={styles.tripMain}>Dwarka → Cyber Hub</Text>
              <Text style={styles.tripSub}>₹180 • Completed</Text>
            </View>

            <Pressable
              style={[styles.primaryBtn, { marginTop: 10 }]}
              onPress={() => setActiveModal(null)}
            >
              <Text style={styles.primaryText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  },

  /* MODAL */
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },

  modalCard: {
    backgroundColor: "#111",
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  modalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },

  input: {
    backgroundColor: "#000",
    borderRadius: 12,
    padding: 14,
    color: "#fff",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#222",
  },

  primaryBtn: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  primaryText: {
    color: "#000",
    fontWeight: "700",
  },

  cancelText: {
    textAlign: "center",
    marginTop: 12,
    color: "#777",
  },

  tripItem: {
    backgroundColor: "#000",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },

  tripMain: {
    color: "#fff",
    fontWeight: "600",
  },

  tripSub: {
    color: "#888",
    fontSize: 12,
    marginTop: 4,
  },
});
