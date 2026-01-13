import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function HomeScreen({}) {

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home Screen</Text>

      <TouchableOpacity onPress={()=>console.log('logout')}>
        <Text style={styles.logout}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
  logout: {
    color: "red",
    fontSize: 16,
  },
});