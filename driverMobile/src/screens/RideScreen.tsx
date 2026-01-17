import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const STORAGE_KEY = "activeRide";
const CORRECT_OTP = "1234"; // later from backend

type RideStage = "pickup" | "onboard" | "completed";

export default function RideScreen({setScreen}) {
  const [rideStage, setRideStage] = useState<RideStage>("pickup");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [showCompletedModal, setShowCompletedModal] = useState(false);

  /* ---------- LOAD PERSISTED STATE ---------- */
  useEffect(() => {
    loadRide();
  }, []);

  const loadRide = async () => {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    const data = JSON.parse(raw);
    if (data.stage) setRideStage(data.stage);
  };

  const persistRide = async (stage: RideStage) => {
    if (stage === "completed") {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } else {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ stage })
      );
    }
  };

  const updateStage = (stage: RideStage) => {
    setRideStage(stage);
    persistRide(stage);
  };

  /* ---------- UI ---------- */
  return (
    <View style={styles.container}>
      {/* MAP */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 28.6139,
          longitude: 77.209,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker coordinate={{ latitude: 28.615, longitude: 77.21 }} />
        <Marker coordinate={{ latitude: 28.62, longitude: 77.23 }} />
        <Polyline
          coordinates={[
            { latitude: 28.615, longitude: 77.21 },
            { latitude: 28.62, longitude: 77.23 },
          ]}
          strokeWidth={4}
          strokeColor="#fff"
        />
      </MapView>

      {/* TOP ACTIONS */}
      <View style={styles.topActions}>
        <IconButton icon="call-outline" />
        <IconButton icon="chatbubble-outline" />
        <IconButton icon="navigate-outline" />
      </View>

      {/* BOTTOM CARD */}
      <View style={styles.rideCard}>
        <Text style={styles.stageText}>
          {rideStage === "pickup" && "Arriving at Pickup"}
          {rideStage === "onboard" && "Passenger Onboard"}
          {rideStage === "completed" && "Trip Completed"}
        </Text>

        <View style={styles.addressBlock}>
          <Text style={styles.label}>PICKUP</Text>
          <Text style={styles.address}>Connaught Place, Delhi</Text>
        </View>

        <View style={styles.addressBlock}>
          <Text style={styles.label}>DROP</Text>
          <Text style={styles.address}>Dwarka Sector 21</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.fareRow}>
          <Text style={styles.fareLabel}>Estimated Fare</Text>
          <Text style={styles.fare}>₹420</Text>
        </View>

        {rideStage !== "completed" && (
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => {
              if (rideStage === "pickup") {
                setShowOtpModal(true);
              } else if (rideStage === "onboard") {
                setShowCompletedModal(true);
              }
            }}
          >
            <Text style={styles.primaryBtnText}>
              {rideStage === "pickup" && "ARRIVED"}
              {rideStage === "onboard" && "END TRIP"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* OTP MODAL */}
      <Modal transparent visible={showOtpModal} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Enter Ride OTP</Text>
            <Text style={styles.modalSubtitle}>
              Ask passenger for the OTP
            </Text>

            <TextInput
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={4}
              style={styles.otpInput}
              placeholder="••••"
              placeholderTextColor="#666"
            />

            <TouchableOpacity
              style={styles.modalPrimaryBtn}
              onPress={() => {
                console.log(otp)
                if (otp === CORRECT_OTP) {
                  setShowOtpModal(false);
                  setOtp("");
                  updateStage("onboard");
                }
              }}
            >
              <Text style={styles.modalPrimaryText}>
                VERIFY & START
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowOtpModal(false)}
            >
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* COMPLETED MODAL */}
      <Modal transparent visible={showCompletedModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Trip Completed</Text>

            <View style={{ marginVertical: 12 }}>
              <Text style={styles.summaryText}>Distance: 12.4 km</Text>
              <Text style={styles.summaryText}>Duration: 28 min</Text>
              <Text style={styles.summaryText}>Earnings: ₹420</Text>
            </View>

            <TouchableOpacity
              style={styles.modalPrimaryBtn}
              onPress={() => {
                setShowCompletedModal(false);
                updateStage("completed");
                setScreen("HOME");
              }}
            >
              <Text style={styles.modalPrimaryText}>CONFIRM</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ---------- ICON BUTTON ---------- */

function IconButton({ icon }: { icon: any }) {
  return (
    <TouchableOpacity style={styles.iconBtn}>
      <Ionicons name={icon} size={22} color="#fff" />
    </TouchableOpacity>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  map: { flex: 1 },

  topActions: {
    position: "absolute",
    top: 50,
    right: 16,
    gap: 12,
  },

  iconBtn: {
    backgroundColor: "#111",
    padding: 12,
    borderRadius: 50,
  },

  rideCard: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#111",
    padding: 20,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },

  stageText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },

  addressBlock: { marginBottom: 12 },
  label: { color: "#A1A1A1", fontSize: 12 },
  address: { color: "#fff", fontSize: 15 },

  divider: {
    height: 1,
    backgroundColor: "#222",
    marginVertical: 16,
  },

  fareRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  fareLabel: { color: "#A1A1A1" },
  fare: { color: "#fff", fontSize: 18, fontWeight: "600" },

  primaryBtn: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  primaryBtnText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 16,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalCard: {
    backgroundColor: "#111",
    width: "90%",
    borderRadius: 16,
    padding: 20,
  },

  modalTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  modalSubtitle: {
    color: "#aaa",
    marginVertical: 8,
  },

  otpInput: {
    backgroundColor: "#000",
    borderRadius: 10,
    padding: 14,
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
    letterSpacing: 8,
    marginBottom: 20,
  },

  modalPrimaryBtn: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  modalPrimaryText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 16,
  },

  modalCancel: {
    color: "#888",
    textAlign: "center",
    marginTop: 14,
  },

  summaryText: {
    color: "#ddd",
    fontSize: 15,
    marginBottom: 6,
  },
});
