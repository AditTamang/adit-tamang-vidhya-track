import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HomePreview() {
  const router = useRouter();
  const goToLogin = useCallback(() => {
    Alert.alert(
      "Login required",
      "Please login to continue.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Login", onPress: () => router.replace("/login") },
      ],
      { cancelable: true }
    );
  }, [router]);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.greeting}>Hi, Adit!</Text>
          <Text style={styles.subGreeting}>How Are you Today?</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={goToLogin}>
            <Ionicons name="search" size={22} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={goToLogin} style={styles.bellWrapper}>
            <Ionicons name="notifications" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Hero Card */}
      <TouchableOpacity style={styles.heroCard} onPress={goToLogin} activeOpacity={0.9}>
        <Image
          source={require("../../../assets/logo.png")}
          style={styles.heroImage}
          resizeMode="contain"
        />
        <View style={styles.heroTextBlock}>
          <Text style={styles.heroHeadline}>Stay connected</Text>
          <Text style={styles.heroHeadline}>with your child’s</Text>
          <Text style={styles.heroHeadline}>school life</Text>
          <View style={styles.heroCta}>
            <Text style={styles.heroCtaText}>Find Nearby</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Features */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Features</Text>
        <TouchableOpacity onPress={goToLogin}>
          <Text style={styles.sectionLink}>See All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.featuresRow}>
        {featureItems.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.featureItem}
            onPress={goToLogin}
          >
            <View style={styles.featureIconWrapper}>
              <Ionicons name={item.icon} size={24} color="#4CAF50" />
            </View>
            <Text style={styles.featureLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick stats */} 
      <View style={styles.quickRow}>
        <TouchableOpacity style={styles.statCard} onPress={goToLogin}>
          <Text style={styles.statValue}>92%</Text>
          <Text style={styles.statLabel}>Attendance</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statCard} onPress={goToLogin}>
          <Text style={styles.statValue}>4</Text>
          <Text style={styles.statLabel}>Homework Due</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statCard} onPress={goToLogin}>
          <Text style={styles.statValue}>A-</Text>
          <Text style={styles.statLabel}>Avg. Grade</Text>
        </TouchableOpacity>
      </View>

      {/* Recommendations */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recommendation</Text>
        <TouchableOpacity onPress={goToLogin}>
          <Text style={styles.sectionLink}>See All</Text>
        </TouchableOpacity>
      </View>

      {[1, 2].map((card) => (
        <TouchableOpacity
          key={card}
          style={styles.recommendCard}
          onPress={goToLogin}
          activeOpacity={0.8}
        >
          <View style={styles.recommendContent}>
            <Text style={styles.recommendTitle}>Personalized insight</Text>
            <Text style={styles.recommendText}>
              Get tailored tips based on attendance, homework, and grades.
            </Text>
          </View>
          <Ionicons name="arrow-forward" size={18} color="#4CAF50" />
        </TouchableOpacity>
      ))}

      {/* Bottom Navigation Preview */}
      <View style={styles.bottomNav}>
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.navItem}
            onPress={goToLogin}
          >
            <Ionicons name={item.icon} size={20} color="#4CAF50" />
            <Text style={styles.navLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const featureItems = [
  { label: "Dashboard", icon: "home-outline" as const },
  { label: "Fee", icon: "card-outline" as const },
  { label: "Homework", icon: "book-outline" as const },
  { label: "Attendance", icon: "calendar-outline" as const },
];

const navItems = [
  { label: "Home", icon: "home-outline" as const },
  { label: "Schedule", icon: "calendar-outline" as const },
  { label: "Grade", icon: "bar-chart-outline" as const },
  { label: "Messages", icon: "chatbubbles-outline" as const },
  { label: "Profile", icon: "person-outline" as const },
];

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#D1D5DB",
  },
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "800",
    color: "#000",
  },
  subGreeting: {
    fontSize: 12,
    color: "#444",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  bellWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  heroCard: {
    flexDirection: "row",
    backgroundColor: "#D5E4DA",
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  heroImage: {
    width: 110,
    height: 110,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  heroTextBlock: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
    gap: 4,
  },
  heroHeadline: {
    fontSize: 14,
    color: "#111",
    fontWeight: "600",
  },
  heroCta: {
    marginTop: 8,
    alignSelf: "flex-start",
    backgroundColor: "#000",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  heroCtaText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1f2937",
  },
  sectionLink: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "600",
  },
  quickRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#555",
    textAlign: "center",
  },
  featuresRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  featureItem: {
    alignItems: "center",
    width: "23%",
    gap: 8,
  },
  featureIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  featureLabel: {
    fontSize: 12,
    color: "#111",
    textAlign: "center",
  },
  recommendCard: {
    height: 120,
    backgroundColor: "#e5e7eb",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  recommendContent: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 12,
  },
  recommendTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
    marginBottom: 4,
  },
  recommendText: {
    fontSize: 12,
    color: "#555",
    lineHeight: 16,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginTop: 8,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    width: "18%",
    gap: 4,
  },
  navLabel: {
    fontSize: 11,
    color: "#111",
    textAlign: "center",
  },
});


