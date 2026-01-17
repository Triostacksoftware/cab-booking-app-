import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  StatusBar,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../helpers/types";

export default function Home({setScreen}) {
  const [user, setUser] = useState<User | null>(null);
  const [online, setOnline] = useState(false);
  const [incomingRide, setIncomingRide] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const raw = await AsyncStorage.getItem("user");
    if (raw) setUser(JSON.parse(raw));
  };

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#888" }}>Loading driver…</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back</Text>
        <Text style={styles.name}>{user.fullName}</Text>
        <Text style={styles.city}>{user.city}</Text>
      </View>

      {/* ONLINE STATUS CARD */}
      <View style={styles.statusCard}>
        <View>
          <Text style={styles.statusLabel}>Driver status</Text>
          <Text
            style={[
              styles.statusValue,
              { color: online ? "#16a34a" : "#9ca3af" },
            ]}
          >
            {online ? "Online" : "Offline"}
          </Text>
        </View>

        <Pressable
          onPress={() => setOnline((p) => !p)}
          style={[
            styles.statusBtn,
            online ? styles.offlineBtn : styles.onlineBtn,
          ]}
        >
          <Text
            style={[
              styles.statusBtnText,
              { color: online ? "#000" : "#fff" },
            ]}
          >
            {online ? "Go Offline" : "Go Online"}
          </Text>
        </Pressable>
      </View>

      {/* STATS */}
      <View style={styles.statsRow}>
        <StatCard label="Today" value="₹820" />
        <StatCard label="Trips" value="6" />
        <StatCard label="Rating" value="4.8★" />
      </View>

      {/* EARNINGS */}
      <View style={styles.earningsCard}>
        <Text style={styles.earningsLabel}>This week</Text>
        <Text style={styles.earningsValue}>₹4,560</Text>
        <Text style={styles.earningsSub}>
          You’re doing great. Keep driving.
        </Text>
      </View>

      {/* OFFLINE MESSAGE */}
      {!online && (
        <View style={styles.offlineHint}>
          <Text style={styles.offlineText}>
            Go online to start receiving rides
          </Text>
        </View>
      )}

      {/* DEBUG BUTTON */}
      {online && (
        <Pressable
          style={styles.fakeRideBtn}
          onPress={() => setIncomingRide(true)}
        >
          <Text style={styles.fakeRideText}>
            Simulate Incoming Ride
          </Text>
        </Pressable>
      )}

      {/* RIDE MODAL */}
      <RideModal
        visible={incomingRide}
        onAccept={() => {
          setIncomingRide(false);
          setScreen("ACTIVE_RIDE")
        }}
        onReject={() => setIncomingRide(false)}
      />
    </SafeAreaView>
  );
}

/* ---------- STAT CARD ---------- */

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

/* ---------- RIDE MODAL ---------- */

function RideModal({
  visible,
  onAccept,
  onReject,
}: {
  visible: boolean;
  onAccept: () => void;
  onReject: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Incoming Ride</Text>

          <View style={styles.rideInfo}>
            <Text style={styles.rideLabel}>Pickup</Text>
            <Text style={styles.rideValue}>Sector 21, Dwarka</Text>

            <Text style={styles.rideLabel}>Drop</Text>
            <Text style={styles.rideValue}>IGI Airport T3</Text>

            <View style={styles.rideRow}>
              <Text style={styles.rideMeta}>6.2 km</Text>
              <Text style={styles.rideMeta}>₹320</Text>
            </View>
          </View>

          <View style={styles.modalActions}>
            <Pressable style={styles.rejectBtn} onPress={onReject}>
              <Text style={styles.rejectText}>Reject</Text>
            </Pressable>

            <Pressable style={styles.acceptBtn} onPress={onAccept}>
              <Text style={styles.acceptText}>Accept</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    marginBottom: 28,
  },

  greeting: {
    fontSize: 14,
    color: "#6b7280",
  },

  name: {
    fontSize: 30,
    fontWeight: "800",
    color: "#000",
  },

  city: {
    color: "#9ca3af",
    marginTop: 2,
  },

  statusCard: {
    backgroundColor: "#000",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  statusLabel: {
    color: "#9ca3af",
    fontSize: 13,
  },

  statusValue: {
    fontSize: 20,
    fontWeight: "800",
  },

  statusBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
  },

  onlineBtn: {
    borderWidth: 1,
    borderColor: "#fff",
  },

  offlineBtn: {
    backgroundColor: "#fff",
  },

  statusBtnText: {
    fontWeight: "700",
    fontSize: 14,
  },

  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 16,
    padding: 14,
  },

  statLabel: {
    color: "#6b7280",
    fontSize: 12,
  },

  statValue: {
    fontSize: 20,
    fontWeight: "800",
    marginTop: 6,
  },

  earningsCard: {
    backgroundColor: "#000",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },

  earningsLabel: {
    color: "#9ca3af",
    fontSize: 13,
  },

  earningsValue: {
    fontSize: 32,
    fontWeight: "900",
    color: "#fff",
    marginVertical: 6,
  },

  earningsSub: {
    color: "#9ca3af",
    fontSize: 13,
  },

  offlineHint: {
    alignItems: "center",
    marginBottom: 20,
  },

  offlineText: {
    color: "#9ca3af",
  },

  fakeRideBtn: {
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  fakeRideText: {
    color: "#fff",
    fontWeight: "800",
  },

  /* MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },

  modalCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 16,
  },

  rideInfo: {
    marginBottom: 24,
  },

  rideLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 10,
  },

  rideValue: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 2,
  },

  rideRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },

  rideMeta: {
    fontSize: 16,
    fontWeight: "700",
  },

  modalActions: {
    flexDirection: "row",
    gap: 12,
  },

  rejectBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#000",
    alignItems: "center",
  },

  rejectText: {
    fontWeight: "800",
    color: "#000",
  },

  acceptBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#000",
    alignItems: "center",
  },

  acceptText: {
    fontWeight: "800",
    color: "#fff",
  },
});
