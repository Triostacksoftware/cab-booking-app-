import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
} from "react-native";

const BOTTOM_BAR_HEIGHT = 60;

const ChevronDown = () => (
  <Text style={{ fontSize: 16, color: '#999' }}>▼</Text>
);

export default function HomeScreen({ navigation, setScreen }) {
  const [destination, setDestination] = useState(null);
  const [customDestination, setCustomDestination] = useState("");
  const [showLocationOptions, setShowLocationOptions] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [rideType, setRideType] = useState(null);
  const [destinationError, setDestinationError] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);

  const popularLocations = [
    "Airport",
    "Railway Station",
    "Bus Stand",
    "Mall",
    "Hospital",
  ];

  const finalDestination = destination || customDestination;

  const validateDestination = (value) => {
    if (!value || value.trim().length === 0) {
      return "Please select or enter a destination";
    }
    if (value.trim().length < 3) {
      return "Destination must be at least 3 characters";
    }
    return "";
  };

  const handleContinue = () => {
    setHasInteracted(true);
    const error = validateDestination(finalDestination);
    
    if (error) {
      setDestinationError(error);
      return;
    }
    
    if (!rideType) {
      return;
    }

    setScreen({
      NAME: 'BOOK-RIDE',
      DATA: { destination, rideType, customDestination }
    });
  };

  const isFormComplete = finalDestination.trim().length >= 3 && rideType !== null;

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ width: "100%" }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.topBar}>
          <View style={styles.topBlock} />
          <View style={styles.topBlockSmall} />
        </View>

        <View style={styles.mainCard}>
          <TouchableOpacity
            style={styles.destinationHeader}
            onPress={() => setShowLocationOptions((prev) => !prev)}
            activeOpacity={0.7}
          >
            <Text style={styles.destinationText}>
              {finalDestination || "Where To Go Today?"}
            </Text>
            <View style={styles.dropdownIcon}>
              <ChevronDown />
            </View>
          </TouchableOpacity>

          {destinationError && hasInteracted ? (
            <Text style={styles.errorText}>{destinationError}</Text>
          ) : null}

          {showLocationOptions && (
            <View style={styles.optionsList}>
              {popularLocations.map((place) => (
                <TouchableOpacity
                  key={place}
                  style={styles.optionItem}
                  onPress={() => {
                    setDestination(place);
                    setCustomDestination("");
                    setDestinationError("");
                    setShowLocationOptions(false);
                  }}
                  activeOpacity={0.6}
                >
                  <Text style={styles.optionText}>{place}</Text>
                </TouchableOpacity>
              ))}

              <TextInput
                placeholder="Enter precise location"
                placeholderTextColor="#777"
                value={customDestination}
                onChangeText={(text) => {
                  setCustomDestination(text);
                  setDestination(null);
                  if (hasInteracted) {
                    setDestinationError(validateDestination(text));
                  }
                }}
                style={styles.textInput}
              />
            </View>
          )}

          <TouchableOpacity
            style={styles.mapButton}
            onPress={() => setShowMapModal(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.mapButtonText}>Choose on Map</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rideOptions}>
          <TouchableOpacity
            style={[
              styles.rideCard,
              rideType === "shared" && styles.rideCardActive,
            ]}
            onPress={() => setRideType("shared")}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.rideText,
                rideType === "shared" && { color: "#000" }
              ]}
            >Shared Ride</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.rideCard,
              rideType === "personal" && styles.rideCardActive,
            ]}
            onPress={() => setRideType("personal")}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.rideText,
                rideType === "personal" && { color: "#000" }
              ]}
            >Personal Ride</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.continueButton,
            !isFormComplete && styles.continueButtonDisabled,
          ]}
          disabled={!isFormComplete}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={showMapModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Location</Text>

            <View style={styles.mapPlaceholder}>
              <Text style={{ color: "#555" }}>Map Placeholder</Text>
            </View>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => {
                setDestination("Selected from Map");
                setCustomDestination("");
                setDestinationError("");
                setShowMapModal(false);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmText}>Confirm Location</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowMapModal(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
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
    backgroundColor: "#0E0E0E",
    paddingTop: 14,
  },

  scrollContent: {
    alignItems: "center",
    paddingBottom: BOTTOM_BAR_HEIGHT + 20,
  },

  topBar: {
    width: "92%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  topBlock: {
    width: "60%",
    height: 42,
    backgroundColor: "#1C1C1C",
    borderRadius: 12,
  },
  topBlockSmall: {
    width: "28%",
    height: 42,
    backgroundColor: "#1C1C1C",
    borderRadius: 12,
  },

  mainCard: {
    width: "92%",
    backgroundColor: "#141414",
    borderRadius: 10,
    padding: 18,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },

  destinationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  destinationText: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  dropdownIcon: {
    opacity: 0.7,
  },

  errorText: {
    color: "#FF4444",
    fontSize: 13,
    marginBottom: 10,
    paddingLeft: 4,
  },

  optionsList: {
    backgroundColor: "#1A1A1A",
    borderRadius: 10,
    marginBottom: 14,
    overflow: "hidden",
  },
  optionItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  optionText: {
    fontSize: 18,
    color: "#F5F5F5",
  },

  textInput: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#0F0F0F",
    color: "#FFF",
    borderRadius: 12,
    margin: 12,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    fontSize: 16,
  },

  mapButton: {
    marginTop: 10,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#1F1F1F",
    alignItems: "center",
  },
  mapButtonText: {
    color: "#EDEDED",
    fontWeight: "600",
    letterSpacing: 0.3,
  },

  rideOptions: {
    width: "92%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  rideCard: {
    width: "48%",
    backgroundColor: "#141414",
    paddingVertical: 20,
    borderRadius: 7,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#222",
  },
  rideCardActive: {
    backgroundColor: "#FFFFFF",
  },
  rideText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFF",
  },

  continueButton: {
    width: "92%",
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  continueButtonDisabled: {
    backgroundColor: "#2A2A2A",
  },
  continueText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.4,
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
  confirmButton: {
    backgroundColor: "#FFF",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  confirmText: {
    color: "#000",
    fontWeight: "700",
  },
  cancelText: {
    textAlign: "center",
    marginTop: 14,
    color: "#888",
  },
});