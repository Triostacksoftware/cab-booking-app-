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

const Ionicons = ({ name, size, color }) => {
  const icons = {
    'arrow-back': '←',
    'chevron-down': '▼',
    'map-outline': '🗺️',
    'logo-google': 'G',
    'add': '+',
    'remove': '−',
  };
  return <Text style={{ fontSize: size, color }}>{icons[name] || '•'}</Text>;
};

const FontAwesome = ({ name, size, color }) => {
  return <Text style={{ fontSize: size, color }}>₹</Text>;
};

export default function BookRide({ userData, setScreen, data }) {
  const [pickup, setPickup] = useState(data?.pickup || "");
  const [customPickup, setCustomPickup] = useState("");
  const [showLocationOptions, setShowLocationOptions] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [numberOfPeople, setNumberOfPeople] = useState(1);

  // Fake cost
  const sharedRideFare = 30;
  const personalRideFare = 100;
  const totalFare = data.rideType === 'shared' ? 30 : 100;

  const popularLocations = [
    "Home",
    "Work",
    "Airport",
    "Railway Station",
  ];

  const finalPickup = pickup || customPickup;

  // Max capacity based on ride type
  const maxCapacity = data.rideType === 'shared' ? 2 : 4;

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
      numberOfPeople,
    });

    setScreen({ NAME: 'RIDE', DATA: {} });
  };

  const incrementPeople = () => {
    if (numberOfPeople < maxCapacity) {
      setNumberOfPeople(numberOfPeople + 1);
    }
  };

  const decrementPeople = () => {
    if (numberOfPeople > 1) {
      setNumberOfPeople(numberOfPeople - 1);
    }
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

        {/* NUMBER OF PEOPLE */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Number of Passengers</Text>
          
          <View style={styles.peopleSelector}>
            <TouchableOpacity
              style={[
                styles.peopleButton,
                numberOfPeople === 1 && styles.peopleButtonDisabled
              ]}
              onPress={decrementPeople}
              disabled={numberOfPeople === 1}
            >
              <Ionicons name="remove" size={20} color={numberOfPeople === 1 ? "#555" : "#fff"} />
            </TouchableOpacity>

            <View style={styles.peopleCount}>
              <Text style={styles.peopleNumber}>{numberOfPeople}</Text>
              <Text style={styles.peopleLabel}>
                {numberOfPeople === 1 ? "passenger" : "passengers"}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.peopleButton,
                numberOfPeople === maxCapacity && styles.peopleButtonDisabled
              ]}
              onPress={incrementPeople}
              disabled={numberOfPeople === maxCapacity}
            >
              <Ionicons name="add" size={20} color={numberOfPeople === maxCapacity ? "#555" : "#fff"} />
            </TouchableOpacity>
          </View>

          <Text style={styles.capacityText}>
            Max capacity: {maxCapacity} passengers
          </Text>
        </View>

        {/* COST BREAKDOWN */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Fare Details</Text>

          <View style={styles.row}>
            <Text style={styles.label}>
              {data.rideType === 'shared' ? "Shared Ride" : "Personal Ride"}
            </Text>
            <Text style={styles.value}>
              ₹{data.rideType === 'shared' ? sharedRideFare : '100'}
            </Text>
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
    gap: 10,
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

  // NUMBER OF PEOPLE STYLES
  peopleSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },

  peopleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1f1f1f",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#2f2f2f",
  },

  peopleButtonDisabled: {
    backgroundColor: "#0a0a0a",
    borderColor: "#1a1a1a",
  },

  peopleCount: {
    alignItems: "center",
    flex: 1,
  },

  peopleNumber: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "700",
  },

  peopleLabel: {
    color: "#999",
    fontSize: 13,
    marginTop: 2,
  },

  capacityText: {
    color: "#666",
    fontSize: 12,
    marginTop: 8,
    textAlign: "center",
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