import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

export default function BookRide({ userData, setScreen, data }) {
  const [pickup, setPickup] = useState(data?.pickup || ""); // selected named pickup
  const [customPickup, setCustomPickup] = useState("");
  const [showLocationOptions, setShowLocationOptions] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("UPI");

  // Fake cost
  const sharedRideFare = 30;
  const personalRideFare = 100;
  const totalFare = data.rideType=='shared'?30:100;

  const popularLocations = [
    "Home",
    "Work",
    "Airport",
    "Railway Station",
  ];

  const finalPickup = pickup || customPickup;

  const goBack = () => {
    setScreen({ NAME: "HOME", DATA: {} });
  };

  const confirmRide = () => {
    console.log({
      pickup: finalPickup,
      destination: data?.destination,
      rideType: data?.rideType,
      paymentMethod,
      totalFare,
    });

    setScreen({NAME:'RIDE', DATA:{}});
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Confirm Ride</Text>

        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* PICKUP */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pickup Location</Text>

          <TouchableOpacity
            style={styles.inputLike}
            onPress={() => setShowLocationOptions((p) => !p)}
          >
            <Text style={styles.inputText}>
              {finalPickup || "Choose pickup location"}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#aaa" />
          </TouchableOpacity>

          {showLocationOptions && (
            <View style={styles.optionsList}>
              {popularLocations.map((place) => (
                <TouchableOpacity
                  key={place}
                  style={styles.optionItem}
                  onPress={() => {
                    setPickup(place);
                    setCustomPickup("");
                    setShowLocationOptions(false);
                  }}
                >
                  <Text style={styles.optionText}>{place}</Text>
                </TouchableOpacity>
              ))}

              <TextInput
                placeholder="Enter precise pickup location"
                placeholderTextColor="#777"
                value={customPickup}
                onChangeText={(text) => {
                  setCustomPickup(text);
                  setPickup("");
                }}
                style={styles.textInput}
              />
            </View>
          )}

          <TouchableOpacity
            style={styles.mapButton}
            onPress={() => setShowMapModal(true)}
          >
            <Ionicons name="map-outline" size={16} color="#fff" />
            <Text style={styles.mapText}>Choose on map</Text>
          </TouchableOpacity>
        </View>

        {/* DESTINATION */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Destination</Text>
          <Text style={styles.valueText}>
            {data?.destination || "Selected destination"}
          </Text>
        </View>

        {/* COST BREAKDOWN */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Fare Details</Text>

          <View style={styles.row}>
            <Text style={styles.label}>{data.rideType=='shared'?"Shared Ride":"Personal Ride"}</Text>
            <Text style={styles.value}>₹{data.rideType=='shared'?sharedRideFare:'100'}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{totalFare}*</Text>
          </View>
        </View>

        {/* PAYMENT */}
        <View style={styles.paymentCard}>
          <Text style={styles.cardTitle}>Payment Method</Text>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === "UPI" && styles.paymentActive,
            ]}
            onPress={() => setPaymentMethod("UPI")}
          >
            <Ionicons name="logo-google" size={18} color="#fff" />
            <Text style={styles.paymentText}>UPI</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === "CASH" && styles.paymentActive,
            ]}
            onPress={() => setPaymentMethod("CASH")}
          >
            <FontAwesome name="rupee" size={18} color="#fff" />
            <Text style={styles.paymentText}>CASH</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={confirmRide}
        >
          <Text style={styles.confirmText}>
            Confirm Ride • ₹{totalFare}
          </Text>
        </TouchableOpacity>
      </View>

      {/* MAP MODAL */}
      <Modal visible={showMapModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Pickup Location</Text>

            <View style={styles.mapPlaceholder}>
              <Text style={{ color: "#555" }}>Map Placeholder</Text>
            </View>

            <TouchableOpacity
              style={styles.modalConfirmButton}
              onPress={() => {
                setPickup("Selected from Map");
                setCustomPickup("");
                setShowMapModal(false);
                setShowLocationOptions(false);
              }}
            >
              <Text style={styles.modalConfirmText}>Confirm Location</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowMapModal(false)}
              style={{ marginTop: 12 }}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
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
  },

  header: {
    height: 60,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#1f1f1f",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  content: {
    padding: 16,
    paddingBottom: 140,
    gap: 16,
  },

  card: {
    backgroundColor: "#0f0f0f",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1f1f1f",
  },

  paymentCard: {
    backgroundColor: "#0f0f0f",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1f1f1f",
    marginBottom: 30,
    gap:10
  },

  cardTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },

  inputLike: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#1f1f1f",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  inputText: {
    color: "#fff",
    fontSize: 15,
  },

  mapButton: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  mapText: {
    color: "#fff",
    fontSize: 14,
  },

  valueText: {
    color: "#fff",
    fontSize: 15,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },

  label: {
    color: "#9f9f9f",
    fontSize: 14,
  },

  value: {
    color: "#fff",
    fontSize: 14,
  },

  divider: {
    height: 1,
    backgroundColor: "#1f1f1f",
    marginVertical: 10,
  },

  totalLabel: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  totalValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1f1f1f",
  },

  paymentActive: {
    borderColor: "#fff",
    backgroundColor: "#ffffff10",
  },

  paymentText: {
    color: "#fff",
    fontSize: 15,
  },

  footer: {
    position: "absolute",
    bottom: 100,
    width: "100%",
    paddingHorizontal: 16,
  },

  confirmButton: {
    backgroundColor: "#fff",
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  confirmText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },

  /* New styles for location options & modal */
  optionsList: {
    backgroundColor: "#1A1A1A",
    borderRadius: 10,
    marginTop: 12,
    overflow: "hidden",
  },
  optionItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  optionText: {
    fontSize: 16,
    color: "#F5F5F5",
  },
  textInput: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#0F0F0F",
    color: "#FFF",
    borderRadius: 10,
    margin: 12,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#111",
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
  },
  mapPlaceholder: {
    height: 220,
    backgroundColor: "#1F1F1F",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  modalConfirmButton: {
    backgroundColor: "#FFF",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  modalConfirmText: {
    color: "#000",
    fontWeight: "700",
  },
  modalCancelText: {
    textAlign: "center",
    marginTop: 14,
    color: "#888",
  },
});