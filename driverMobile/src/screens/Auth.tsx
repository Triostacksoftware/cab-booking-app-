import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../helpers/types";

type AuthMode = "LOGIN" | "REGISTER";

type Props = {
  setIsLoggedIn: (v: boolean) => void;
};

export default function AuthScreen({ setIsLoggedIn }: Props) {
  const [mode, setMode] = useState<AuthMode>("LOGIN");
  const [showOTP, setShowOTP] = useState(false);

  // COMMON
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");

  // REGISTER ONLY
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");

  const isLogin = mode === "LOGIN";

  const canSendOTP =
    mobile.length === 10 &&
    (isLogin || (name && city && vehicleCapacity));

  const sendOTP = () => {
    setShowOTP(true);
  };

  const addUser = async ()=>{
    const userData:User = {
      fullName:name,
      mobileNumber:mobile,
      vehicleNumber:vehicleNumber,
      vehicleCapacity,
      city:city
    }
    console.log(`userData: ${userData}`)
    await AsyncStorage.setItem("user", JSON.stringify(userData));
  }

  const verifyOTP = async () => {
  if (mode === "REGISTER") {
    const userData: User = {
      fullName: name,
      mobileNumber: mobile,
      vehicleNumber,
      vehicleCapacity,
      city,
    };
    await AsyncStorage.setItem("user", JSON.stringify(userData));
  }

  await AsyncStorage.setItem("isLoggedIn", "true");
  setShowOTP(false);
  setIsLoggedIn(true);
};


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.brand}>DRIVER</Text>
        <Text style={styles.subTitle}>
          {isLogin ? "Sign in to drive" : "Register as a driver"}
        </Text>
      </View>

      {/* FORM CARD */}
      <View style={styles.card}>
        {!isLogin && (
          <>
            <Input icon="person-outline" placeholder="Full name" value={name} onChangeText={setName} />
            <Input icon="location-outline" placeholder="City" value={city} onChangeText={setCity} />
            <Input
              icon="people-outline"
              placeholder="Vehicle Number"
              keyboardType="number-pad"
              value={vehicleNumber}
              onChangeText={setVehicleNumber}
            />
            <Input
              icon="people-outline"
              placeholder="Vehicle capacity"
              keyboardType="number-pad"
              value={vehicleCapacity}
              onChangeText={setVehicleCapacity}
            />
          </>
        )}

        <Input
          icon="call-outline"
          placeholder="Mobile number"
          keyboardType="phone-pad"
          value={mobile}
          onChangeText={setMobile}
        />

        <Pressable
          style={[
            styles.primaryBtn,
            !canSendOTP && styles.disabledBtn,
          ]}
          disabled={!canSendOTP}
          onPress={sendOTP}
        >
          <Text style={styles.primaryText}>Send OTP</Text>
        </Pressable>
      </View>

      {/* SWITCH */}
      <Pressable
        onPress={() =>
          setMode((p) => (p === "LOGIN" ? "REGISTER" : "LOGIN"))
        }
      >
        <Text style={styles.switchText}>
          {isLogin
            ? "New driver? Register"
            : "Already registered? Login"}
        </Text>
      </Pressable>

      {/* OTP MODAL */}
      <Modal visible={showOTP} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Enter OTP</Text>
            <Text style={styles.modalSub}>
              Sent to +91 {mobile}
            </Text>

            <TextInput
              style={styles.otpInput}
              keyboardType="number-pad"
              maxLength={6}
              value={otp}
              onChangeText={setOtp}
              placeholder="••••••"
              placeholderTextColor="#999"
            />

            <Pressable
              style={[
                styles.primaryBtn,
                otp.length !== 6 && styles.disabledBtn,
              ]}
              disabled={otp.length !== 6}
              onPress={verifyOTP}
            >
              <Text style={styles.primaryText}>Verify & Continue</Text>
            </Pressable>

            <Pressable onPress={() => setShowOTP(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

/* ---------- INPUT ---------- */

type InputProps = {
  icon: keyof typeof Ionicons.glyphMap;
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  keyboardType?: "default" | "phone-pad" | "number-pad";
};

function Input({
  icon,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
}: InputProps) {
  return (
    <View style={styles.inputWrap}>
      <Ionicons name={icon} size={18} color="#777" />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#777"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        style={styles.input}
      />
    </View>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  header: {
    marginBottom: 36,
  },

  brand: {
    fontSize: 32,
    fontWeight: "800",
    color: "#000",
    letterSpacing: 2,
  },

  subTitle: {
    color: "#666",
    marginTop: 6,
    fontSize: 14,
  },

  card: {
    backgroundColor: "#000",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },

  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#1f1f1f",
    paddingVertical: 12,
    gap: 10,
  },

  input: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
  },

  primaryBtn: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 24,
    alignItems: "center",
  },

  disabledBtn: {
    opacity: 0.4,
  },

  primaryText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 15,
  },

  switchText: {
    textAlign: "center",
    color: "#000",
    fontWeight: "600",
    marginTop: 10,
  },

  /* MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },

  modalCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },

  modalSub: {
    color: "#666",
    marginVertical: 6,
  },

  otpInput: {
    borderBottomWidth: 2,
    borderBottomColor: "#000",
    fontSize: 22,
    letterSpacing: 10,
    textAlign: "center",
    paddingVertical: 14,
    marginVertical: 20,
    color: "#000",
  },

  cancelText: {
    textAlign: "center",
    marginTop: 14,
    color: "#666",
  },
});