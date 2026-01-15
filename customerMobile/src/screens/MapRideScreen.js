import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Linking } from "react-native";


const backendRideMeta = {
  otp: "4821", // comes from backend
};

const rideData = {
  driver: {
    name: "Aksh Tiwari",
    rating: 4.8,
    mobileNumber: "9990074614",
  },

  vehicle: {
    model: "Tata Nano",
    number: "DL01AB2345",
    color: "TriColor",
    type: "Mini",
  },

  trip: {
    pickup: "Connaught Place",
    drop: "IGI Airport",
    fare: 100,
    payment: "UPI",
  },
};


export default function MapRideScreen({ setScreen }) {
  const [rideState, setRideState] = useState("SEARCHING_DRIVER");
  const [showCompletionModal, setShowCompletionModal] = useState(false);


  useEffect(() => {
    if (rideState === "SEARCHING_DRIVER") {
      setTimeout(() => setRideState("DRIVER_ASSIGNED"), 2000);
    }

    if (rideState === "DRIVER_ASSIGNED") {
      setTimeout(() => setRideState("DRIVER_ARRIVING"), 3000);
    }

    if (rideState === "ON_TRIP") {
      setTimeout(() => {
        setRideState("COMPLETED");
        setShowCompletionModal(true);
      }, 6000);
    }
  }, [rideState]);


  const OtpVerification = () => (
    <View style={styles.otpCard}>
      <Text style={styles.otpTitle}>Verify Ride</Text>
      <Text style={styles.otpSubtitle}>
        Tell this code to the driver to start the ride
      </Text>

      <View style={styles.otpBox}>
        <Text style={styles.otpText}>{backendRideMeta.otp}</Text>
      </View>

      <TouchableOpacity
        style={styles.verifyBtn}
        onPress={() => setRideState("ON_TRIP")}
      >
        <Text style={styles.verifyText}>Driver Verified</Text>
      </TouchableOpacity>
    </View>
  );


  return (
    <View style={styles.container}>
      {/* MAP PLACEHOLDER */}
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapText}>MAP VIEW</Text>
      </View>

      {/* TOP STATUS */}
      <View style={styles.topStatus}>
        <Text style={styles.statusText}>
          {rideState === "SEARCHING_DRIVER" && "Finding a driver..."}
          {rideState === "DRIVER_ASSIGNED" && "Driver assigned"}
          {rideState === "DRIVER_ARRIVING" && "Driver arriving"}
          {rideState === "VERIFY_CODE" && "Verify OTP to start ride"}
          {rideState === "ON_TRIP" && "On Trip"}
        </Text>
      </View>

      {/* BOTTOM SHEET */}
      <View style={styles.bottomSheet}>
        {/* DRIVER INFO */}
        <View style={styles.driverRow}>
          <View style={styles.avatar} />

          <View style={{ flex: 1 }}>
            <Text style={styles.driverName}>{rideData.driver.name}</Text>
            <Text style={styles.driverRating}>
              ⭐ {rideData.driver.rating}
            </Text>
            <Text style={styles.vehicleNumber}>
              {rideData.vehicle.number}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() =>
              Linking.openURL(`tel:${rideData.driver.mobileNumber}`)
            }
          >
            <Ionicons name="call-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* VEHICLE */}
        <View style={styles.infoCard}>
          <Text style={styles.infoPrimary}>
            {rideData.vehicle.color} {rideData.vehicle.model}
          </Text>
          <Text style={styles.infoSecondary}>
            {rideData.vehicle.type} • AC
          </Text>
        </View>

        {/* TRIP */}
        <View style={styles.infoCard}>
          <Text style={styles.tripText}>
            Pickup → {rideData.trip.pickup}
          </Text>
          <Text style={styles.tripText}>
            Drop → {rideData.trip.drop}
          </Text>

          <View style={styles.fareRow}>
            <Text style={styles.fare}>₹{rideData.trip.fare}</Text>
            <Text style={styles.payment}>{rideData.trip.payment}</Text>
          </View>
        </View>

        {/* OTP BLOCK */}
        {rideState === "DRIVER_ARRIVING" && (
          <TouchableOpacity
            style={styles.showOtpBtn}
            onPress={() => setRideState("VERIFY_CODE")}
          >
            <Text style={styles.showOtpText}>Show Verification Code</Text>
          </TouchableOpacity>
        )}

        {rideState === "VERIFY_CODE" && <OtpVerification />}
      </View>

      {/* COMPLETION MODAL */}
      <Modal transparent visible={showCompletionModal} animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Ionicons
              name="checkmark-circle"
              size={64}
              color="#4CAF50"
            />
            <Text style={styles.modalTitle}>Trip Completed</Text>
            <Text style={styles.modalSub}>
              Thanks for riding with us
            </Text>

            <TouchableOpacity
              style={styles.modalBtn}
              onPress={() => {
                setShowCompletionModal(false);
                setScreen({ NAME: "HOME", DATA: {} });
              }}
            >
              <Text style={styles.modalBtnText}>Go Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },

  mapPlaceholder: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
  },
  mapText: { color: "#555", letterSpacing: 2 },

  topStatus: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  statusText: { color: "#fff", fontWeight: "600" },

  bottomSheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#000",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    elevation: 30,
  },

  driverRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#333",
    marginRight: 12,
  },
  driverName: { color: "#fff", fontSize: 16, fontWeight: "700" },
  driverRating: { color: "#aaa", fontSize: 13 },
  vehicleNumber: { color: "#fff", fontWeight: "600" },
  iconButton: {
    padding: 10,
    backgroundColor: "#1f1f1f",
    borderRadius: 12,
  },

  infoCard: {
    backgroundColor: "#111",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  infoPrimary: { color: "#fff", fontWeight: "700" },
  infoSecondary: { color: "#888", marginTop: 4 },

  tripText: { color: "#ccc", marginBottom: 4 },
  fareRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  fare: { color: "#fff", fontSize: 18, fontWeight: "700" },
  payment: { color: "#aaa" },

  showOtpBtn: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#fff",
    alignItems: "center",
    marginTop: 8,
  },
  showOtpText: { color: "#000", fontWeight: "700" },

  otpCard: {
    backgroundColor: "#111",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginTop: 10,
  },
  otpTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  otpSubtitle: {
    color: "#aaa",
    textAlign: "center",
    marginVertical: 8,
  },
  otpBox: {
    marginVertical: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: "#000",
    borderWidth: 1,
    borderColor: "#333",
  },
  otpText: {
    color: "#fff",
    fontSize: 28,
    letterSpacing: 4,
    fontWeight: "700",
  },
  verifyBtn: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  verifyText: { color: "#000", fontWeight: "700" },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "80%",
    backgroundColor: "#111",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 12,
  },
  modalSub: { color: "#aaa", marginVertical: 8 },
  modalBtn: {
    marginTop: 16,
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 14,
  },
  modalBtnText: { color: "#000", fontWeight: "700" },
});
