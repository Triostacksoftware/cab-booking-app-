import { View, StyleSheet, Platform } from "react-native";
import React from "react";

export const BOTTOM_BAR_HEIGHT = 88;

export default function BottomBar() {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container} />
    </View>
  );
}

const styles = StyleSheet.create({
  /* Wrapper handles shadow properly */
  wrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "transparent",
  },

  container: {
    height: BOTTOM_BAR_HEIGHT,
    backgroundColor: "#000",
    borderTopWidth: 3,
    // borderTopColor: "#1f1f1f90",

    /* Rounded top for premium feel */
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,

    /* Padding for future icons/buttons */
    paddingHorizontal: 24,
    paddingTop: 12,

    /* Shadows */
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: -6 },
      },
      android: {
        elevation: 20,
      },
    }),
  },
});
