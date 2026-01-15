import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Linking } from "react-native";

const rideData = {
  status: "DRIVER_ASSIGNED",
  eta: "3 min",

  driver: {
    name: "Aksh Tiwari",
    rating: 4.8,
    mobileNumber:'9990074614',
  },

  vehicle: {
    model: "Tata Nano",
    number: "DL01AB2345",
    color: "TriColor",
    type: "Huge",
  },

  trip: {
    pickup: "Connaught Place",
    drop: "IGI Airport",
    fare: 100,
    payment: "CASH",
  },
};

export default function MapRideScreen() {
  return (
    <View style={styles.container}>
      {/* MAP PLACEHOLDER */}
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapText}>MAP VIEW</Text>
      </View>

      {/* TOP STATUS BAR */}
      <View style={styles.topStatus}>
        <Text style={styles.statusText}>
          LIVE • Driver arriving in {rideData.eta}
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

          <TouchableOpacity style={styles.iconButton} onPress={()=>{Linking.openURL(`tel:${rideData.driver.mobileNumber}`)}}>
            <Ionicons name="call-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* VEHICLE INFO */}
        <View style={styles.infoCard}>
          <Text style={styles.infoPrimary}>
            {rideData.vehicle.color} {rideData.vehicle.model}
          </Text>
          <Text style={styles.infoSecondary}>
            {rideData.vehicle.type} • AC
          </Text>
        </View>

        {/* TRIP SUMMARY */}
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

        {/* SAFETY ACTIONS */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="share-outline" size={20} color="#aaa" />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="alert-circle-outline" size={20} color="#aaa" />
            <Text style={styles.actionText}>Emergency</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  /* MAP */
  mapPlaceholder: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
  },
  mapText: {
    color: "#555",
    letterSpacing: 2,
    fontSize: 14,
  },

  /* TOP STATUS */
  topStatus: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusText: {
    color: "#fff",
    fontWeight: "600",
  },
  cancelText: {
    color: "#ff4d4d",
    fontWeight: "600",
  },

  /* BOTTOM SHEET */
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#000",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,

    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: -6 },
      },
      android: {
        elevation: 30,
      },
    }),
  },

  /* DRIVER */
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
  driverName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  driverRating: {
    color: "#aaa",
    fontSize: 13,
  },
  vehicleNumber: {
    color: "#fff",
    fontWeight: "600",
    marginTop: 2,
  },
  iconButton: {
    padding: 10,
    backgroundColor: "#1f1f1f",
    borderRadius: 12,
  },

  /* INFO CARDS */
  infoCard: {
    backgroundColor: "#111",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  infoPrimary: {
    color: "#fff",
    fontWeight: "700",
  },
  infoSecondary: {
    color: "#888",
    marginTop: 4,
  },

  tripText: {
    color: "#ccc",
    marginBottom: 4,
  },

  fareRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  fare: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  payment: {
    color: "#aaa",
  },

  /* ACTIONS */
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  actionBtn: {
    alignItems: "center",
    gap: 4,
  },
  actionText: {
    color: "#aaa",
    fontSize: 12,
  },
});