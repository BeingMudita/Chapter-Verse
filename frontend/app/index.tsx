import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { Heart, Sparkles } from "lucide-react-native";
import React, { useEffect } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { getUserId } from "@/src/utils/user";

export default function WelcomeScreen() {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };
  

  const handleStart = async() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await getUserId();
    router.push("/questions");
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Heart size={60} color={Colors.light.primary} fill={Colors.light.primary} />
            <Text style={styles.title}>Chapter & Verse</Text>
            <Text style={styles.subtitle}>Your personal book matchmaker</Text>
          </View>

          <View style={styles.features}>
            <View style={styles.feature}>
              <Sparkles size={24} color={Colors.light.secondary} />
              <Text style={styles.featureText}>Swipe through curated books</Text>
            </View>
            <View style={styles.feature}>
              <Heart size={24} color={Colors.light.secondary} />
              <Text style={styles.featureText}>Find your perfect match</Text>
            </View>
            <View style={styles.feature}>
              <Sparkles size={24} color={Colors.light.secondary} />
              <Text style={styles.featureText}>Build your reading list</Text>
            </View>
          </View>

          <Animated.View
            style={[
              styles.buttonContainer,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            <Pressable
              style={styles.button}
              onPress={handleStart}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <Text style={styles.buttonText}>Start Your Journey</Text>
            </Pressable>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    marginTop: 60,
  },
  title: {
    fontSize: 48,
    fontWeight: "700" as const,
    color: Colors.light.primary,
    marginTop: 24,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.light.secondary,
    marginTop: 12,
    fontWeight: "500" as const,
  },
  features: {
    gap: 32,
    paddingHorizontal: 16,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  featureText: {
    fontSize: 18,
    color: Colors.light.text,
    fontWeight: "500" as const,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    color: Colors.light.background,
    fontSize: 18,
    fontWeight: "700" as const,
    letterSpacing: 0.5,
  },
});
