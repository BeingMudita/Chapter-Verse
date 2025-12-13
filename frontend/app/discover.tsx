// app/discover.tsx
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { BookMarked } from "lucide-react-native";
import React, { useState, useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
// canonical book types + mock data
import { Book, MOCK_BOOKS } from "@/constants/book";
// saved books context
import { useSavedBooks } from "@/contexts/SavedBooksContext";
// preferences hook (get user answers)
import { usePreferences } from "@/contexts/PreferencesContext";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

export default function DiscoverScreen() {
  const { preferences } = usePreferences();
  const { savedBooks, addBook } = useSavedBooks();

  // Books ordered by simple score computed from preferences
  const [books, setBooks] = useState<Book[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const scoreBook = (book: Book) => {
      let score = 0;
      const { genres = [], vibes = [], themes = [] } = preferences ?? {};
      for (const g of genres) if (book.genres.includes(g)) score += 2;
      for (const v of vibes) if (book.vibes.includes(v)) score += 1;
      for (const t of themes) if (book.themes.includes(t)) score += 1;
      if (preferences?.lengthPreference && book.pages) {
        if (preferences.lengthPreference.includes("Short") && book.pages < 300)
          score += 1;
        if (preferences.lengthPreference.includes("Epic") && book.pages >= 450)
          score += 1;
      }
      return score;
    };

    const scored = MOCK_BOOKS.map((b) => ({ b, score: scoreBook(b) }));
    scored.sort((a, z) => z.score - a.score || Math.random() - 0.5);
    setBooks(scored.map((s) => s.b));
    setCurrentIndex(0);
  }, [preferences]);

  const position = useRef(new Animated.ValueXY()).current;

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ["-10deg", "0deg", "10deg"],
    extrapolate: "clamp",
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, SCREEN_WIDTH / 4],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 4, 0],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: position.x, dy: position.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          forceSwipe("right");
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          forceSwipe("left");
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  const forceSwipe = (direction: "left" | "right") => {
    const x = direction === "right" ? SCREEN_WIDTH + 100 : -SCREEN_WIDTH - 100;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = (direction: "left" | "right") => {
    const book = books[currentIndex];
    if (!book) return;

    if (direction === "right") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      addBook(book);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    position.setValue({ x: 0, y: 0 });
    setCurrentIndex((i) => i + 1);
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  const handleLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    forceSwipe("right");
  };

  const handlePass = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    forceSwipe("left");
  };

  const handleViewSaved = () => {
    router.push("/saved");
  };

  if (currentIndex >= books.length || books.length === 0) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Chapter & Verse</Text>
            <Pressable onPress={handleViewSaved} style={styles.savedIconButton}>
              <BookMarked size={28} color={Colors.light.primary} />
              {savedBooks.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{savedBooks.length}</Text>
                </View>
              )}
            </Pressable>
          </View>

          <View style={styles.emptyContainer}>
            <BookMarked size={80} color={Colors.light.primary} />
            <Text style={styles.emptyTitle}>You&apos;ve seen all the books!</Text>
            <Text style={styles.emptyText}>
              Check out your saved books or come back later for more recommendations.
            </Text>
            <Pressable style={styles.savedButton} onPress={handleViewSaved}>
              <Text style={styles.savedButtonText}>View Saved Books</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const currentBook = books[currentIndex];
  const nextBook = books[currentIndex + 1];

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Chapter & Verse</Text>
          <Pressable onPress={handleViewSaved} style={styles.savedIconButton}>
            <BookMarked size={28} color={Colors.light.primary} />
            {savedBooks.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{savedBooks.length}</Text>
              </View>
            )}
          </Pressable>
        </View>

        <View style={styles.cardArea}>
          {nextBook && (
            <Animated.View
              style={[
                styles.card,
                {
                  transform: [{ scale: 0.95 }],
                  top: 10,
                },
              ]}
            >
              <Image source={{ uri: nextBook.coverUrl }} style={styles.cover} resizeMode="cover" />
              <Text style={styles.bookTitle}>{nextBook.title}</Text>
              <Text style={styles.bookAuthor}>{nextBook.author}</Text>
            </Animated.View>
          )}

          {currentBook && (
            <Animated.View
              {...panResponder.panHandlers}
              style={[
                styles.card,
                {
                  transform: [
                    { translateX: position.x },
                    { translateY: position.y },
                    { rotate: rotate },
                  ],
                },
              ]}
            >
              <Image source={{ uri: currentBook.coverUrl }} style={styles.cover} resizeMode="cover" />
              <Text style={styles.bookTitle}>{currentBook.title}</Text>
              <Text style={styles.bookAuthor}>{currentBook.author}</Text>

              <View style={styles.matchPills}>
                {preferences?.genres?.some((g: string) => currentBook.genres.includes(g)) && (
                  <View style={styles.pill}><Text style={styles.pillText}>Genre match</Text></View>
                )}
                {preferences?.vibes?.some((v: string) => currentBook.vibes.includes(v)) && (
                  <View style={styles.pill}><Text style={styles.pillText}>Vibe match</Text></View>
                )}
              </View>
            </Animated.View>
          )}
        </View>

        <View style={styles.controls}>
          <Pressable style={styles.passButton} onPress={handlePass}>
            <Text style={styles.controlText}>Pass</Text>
          </Pressable>
          <Pressable style={styles.likeButton} onPress={handleLike}>
            <Text style={styles.controlText}>Like</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const CARD_WIDTH = SCREEN_WIDTH - 48;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.62;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
    emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.light.primary,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    color: Colors.light.secondary,
    textAlign: "center",
    lineHeight: 20,
  },
  savedButton: {
    marginTop: 12,
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  savedButtonText: {
    color: Colors.light.background,
    fontWeight: "700",
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.light.primary,
  },
  savedIconButton: {
    padding: 6,
  },
  badge: {
    position: "absolute",
    right: -6,
    top: -6,
    backgroundColor: Colors.light.primary,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: Colors.light.background,
    fontWeight: "700",
    fontSize: 12,
  },
  cardArea: {
    flex: 1,
    alignItems: "center",
    marginTop: 12,
  },
  card: {
    position: "absolute",
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 18,
    backgroundColor: Colors.light.card,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    padding: 16,
    alignItems: "center",
  },
  cover: {
    width: "100%",
    height: "72%",
    borderRadius: 12,
    marginBottom: 12,
  },
  bookTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.light.text,
  },
  bookAuthor: {
    fontSize: 14,
    color: Colors.light.secondary,
    marginTop: 4,
  },
  matchPills: {
    position: "absolute",
    left: 16,
    bottom: 16,
    flexDirection: "row",
    gap: 8,
  },
  pill: {
    backgroundColor: Colors.light.accent,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  pillText: {
    color: Colors.light.primary,
    fontWeight: "700",
  },
    controls: {
      flexDirection: "row",
      justifyContent: "space-around",
      paddingVertical: 16,
      paddingHorizontal: 20,
      gap: 12,
    },
    passButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 24,
      backgroundColor: Colors.light.secondary,
      borderRadius: 10,
      alignItems: "center",
    },
    likeButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 24,
      backgroundColor: Colors.light.primary,
      borderRadius: 10,
      alignItems: "center",
    },
    controlText: {
      fontWeight: "700",
      fontSize: 16,
      color: Colors.light.background,
    },
  });