import { View, Text, StyleSheet, Platform, Pressable } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

export const BOTTOM_BAR_HEIGHT = 88;

export default function BottomBar({ screen, setScreen }) {
  const Item = ({ name, label, icon }) => {
    const isActive = screen.NAME === name;

    return (
      <Pressable
        onPress={() =>
          setScreen({
            NAME: name,
            DATA: {},
          })
        }
        style={({ pressed }) => [
          styles.item,
          pressed && { opacity: 0.6 },
        ]}
      >
        <Ionicons
          name={icon}
          size={22}
          color={isActive ? "#fff" : "#777"}
        />
        <Text
          style={[
            styles.label,
            { color: isActive ? "#fff" : "#777" },
          ]}
        >
          {label}
        </Text>

        {isActive && <View style={styles.activeDot} />}
      </Pressable>
    );
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Item name="HOME" label="Home" icon="home-outline" />
        {/* <Item name="BOOK-RIDE" label="Ride" icon="car-outline" /> */}
        <Item name="WALLET" label="Wallet" icon="wallet-outline" />
        <Item name="PROFILE" label="Profile" icon="person-outline" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },

  container: {
    height: BOTTOM_BAR_HEIGHT,
    backgroundColor: "#000",
    borderTopWidth: 1,
    borderTopColor: "#1f1f1f",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: 28,
    paddingTop: 12,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: -6 },
      },
      android: {
        elevation: 20,
      },
    }),
  },

  item: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },

  label: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.3,
  },

  activeDot: {
    marginTop: 4,
    width: 5,
    height: 5,
    borderRadius: 99,
    backgroundColor: "#fff",
  },
});
