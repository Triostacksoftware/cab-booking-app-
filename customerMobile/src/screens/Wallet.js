import { View, Text, StyleSheet, FlatList, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BOTTOM_BAR_HEIGHT } from "../components/BottomBar";

export default function Wallet() {
  // UI-only mock data
  const walletBalance = 1240;

  const completedTrips = 7;
  const cashbackTargetTrips = 10;
  const remainingTrips = cashbackTargetTrips - completedTrips;
  const progress = (completedTrips / cashbackTargetTrips) * 100;

  const transactions = [
    { id: "1", title: "Trip Completed", amount: "- ₹100", date: "Today" },
    { id: "2", title: "Trip Completed", amount: "- ₹30", date: "Yesterday" },
    { id: "3", title: "Cashback Bonus", amount: "+ ₹20", date: "2 days ago" },
    { id: "4", title: "Trip Completed", amount: "- ₹30", date: "3 days ago" },
    { id: "5", title: "Trip Completed", amount: "- ₹100", date: "4 days ago" },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Wallet</Text>
        </View>

        {/* WALLET BALANCE */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balanceValue}>₹{walletBalance}</Text>
        </View>

        {/* CASHBACK PROGRESS */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Cashback Progress</Text>

          <Text style={styles.primaryText}>
            {completedTrips} / {cashbackTargetTrips} Trips
          </Text>

          <Text style={styles.secondaryText}>
            Complete {remainingTrips} more trips to unlock cashback
          </Text>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>

        {/* TRIP SUMMARY */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trip Summary</Text>

          <View style={styles.row}>
            <View style={styles.statCard}>
              <Ionicons name="checkmark-circle-outline" size={22} color="#fff" />
              <Text style={styles.statValue}>{completedTrips}</Text>
              <Text style={styles.statLabel}>Completed Trips</Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="gift-outline" size={22} color="#fff" />
              <Text style={styles.statValue}>{remainingTrips}</Text>
              <Text style={styles.statLabel}>Trips Remaining</Text>
            </View>
          </View>
        </View>

        {/* RECENT TRANSACTIONS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>

          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.divider} />}
            renderItem={({ item }) => (
              <View style={styles.transactionRow}>
                <View>
                  <Text style={styles.transactionTitle}>{item.title}</Text>
                  <Text style={styles.transactionDate}>{item.date}</Text>
                </View>

                <Text style={styles.transactionAmount}>{item.amount}</Text>
              </View>
            )}
          />
        </View>

        {/* INFO */}
        <View style={styles.infoBox}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color="#A1A1A1"
          />
          <Text style={styles.infoText}>
            Balance updates automatically after each completed trip.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingBottom: BOTTOM_BAR_HEIGHT,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  header: {
    paddingTop: 60,
    paddingBottom: 24,
  },

  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },

  balanceCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },

  balanceLabel: {
    color: "#555",
    fontSize: 13,
    marginBottom: 6,
  },

  balanceValue: {
    color: "#000",
    fontSize: 32,
    fontWeight: "800",
  },

  card: {
    backgroundColor: "#111",
    borderRadius: 18,
    padding: 20,
    marginBottom: 28,
  },

  cardLabel: {
    color: "#A1A1A1",
    fontSize: 13,
    marginBottom: 8,
  },

  primaryText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 6,
  },

  secondaryText: {
    color: "#A1A1A1",
    fontSize: 14,
    marginBottom: 16,
  },

  progressTrack: {
    height: 6,
    backgroundColor: "#222",
    borderRadius: 6,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#fff",
  },

  section: {
    marginBottom: 28,
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },

  row: {
    flexDirection: "row",
    gap: 16,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#111",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },

  statValue: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 8,
  },

  statLabel: {
    color: "#A1A1A1",
    fontSize: 12,
    marginTop: 4,
  },

  transactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },

  transactionTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },

  transactionDate: {
    color: "#777",
    fontSize: 12,
    marginTop: 2,
  },

  transactionAmount: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  divider: {
    height: 1,
    backgroundColor: "#222",
  },

  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#0D0D0D",
    padding: 14,
    borderRadius: 12,
  },

  infoText: {
    color: "#A1A1A1",
    fontSize: 13,
    flex: 1,
  },
});
