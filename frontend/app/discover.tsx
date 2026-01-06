// app/discover.tsx
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { BookMarked, ChevronDown, ChevronUp, Clock, Hash, Heart, Tag, X } from "lucide-react-native";
import React, { useState, useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { Book } from "@/constants/book";
import { useSavedBooks } from "@/contexts/SavedBooksContext";
import { usePreferences } from "@/contexts/PreferencesContext";
import { fetchRecommendations } from "@/src/api/recommend";
import { sendSignal } from "@/src/api/signal";
import { mapRecommendedBook } from "@/src/utils/mapBook";
import { getUserId } from "@/src/utils/user";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

export default function DiscoverScreen() {
  const { preferences } = usePreferences();
  const { savedBooks, addBook } = useSavedBooks();
  const [showDetails, setShowDetails] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setShowDetails(false);
  }, [currentIndex]);

  useEffect(() => {
    if (!preferences) return;

    const load = async () => {
      try {
        const result = await fetchRecommendations({
          user_id: "c3f7b7c1-5b8b-4a5c-9c6a-1d8c1f5a9d21",
          genres: preferences.genres ?? [],
          vibes: preferences.vibes ?? [],
          themes: preferences.themes ?? [],
          pacePreference: preferences.pacePreference ?? null,
          lengthPreference: preferences.lengthPreference ?? null,
          limit: 10,
        });

        const mapped = result.map(mapRecommendedBook);
        setBooks(mapped);
        setCurrentIndex(0);
      } catch (err) {
        console.error("Failed to load recommendations", err);
      }
    };

    load();
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

  const onSwipeComplete = async (direction: "left" | "right") => {
    const book = books[currentIndex];
    if (!book) return;

    const user_id = await getUserId();

    if (direction === "right") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      addBook(book);

      sendSignal({
        user_id,
        book_id: book.id,
        signal: "like",
      });
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      sendSignal({
        user_id,
        book_id: book.id,
        signal: "click",
      });
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

  const toggleDetails = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowDetails(!showDetails);
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
            <Text style={styles.emptyTitle}>You've seen all the books!</Text>
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
              <View style={styles.coverContainer}>
                <Image 
                  source={{ uri: currentBook.coverUrl }} 
                  style={styles.cover} 
                  resizeMode="cover" 
                />
                <View style={styles.coverOverlay} />
                
                <View style={styles.bookInfoHeader}>
                  <View style={styles.bookTitleContainer}>
                    <Text style={styles.bookTitle}>{currentBook.title}</Text>
                    <Text style={styles.bookAuthor}>by {currentBook.author}</Text>
                  </View>
                  
                  <View style={styles.matchPills}>
                    {preferences?.genres?.some((g: string) => currentBook.genres.includes(g)) && (
                      <View style={styles.pill}><Text style={styles.pillText}>Genre match</Text></View>
                    )}
                    {preferences?.vibes?.some((v: string) => currentBook.vibes.includes(v)) && (
                      <View style={styles.pill}><Text style={styles.pillText}>Vibe match</Text></View>
                    )}
                    {preferences?.themes?.some((t: string) => currentBook.themes.includes(t)) && (
                      <View style={styles.pill}><Text style={styles.pillText}>Theme match</Text></View>
                    )}
                  </View>
                </View>
              </View>

              <View style={styles.detailsContainer}>
                {showDetails ? (
                  <ScrollView 
                    style={styles.detailsScroll}
                    showsVerticalScrollIndicator={false}
                  >
                    {currentBook.description && (
                      <View style={styles.detailSection}>
                        <Text style={styles.detailSectionTitle}>Description</Text>
                        <Text style={styles.descriptionText}>{currentBook.description}</Text>
                      </View>
                    )}

                    <View style={styles.tagsGrid}>
                      {currentBook.genres.length > 0 && (
                        <View style={styles.tagsColumn}>
                          <View style={styles.tagHeader}>
                            <Tag size={16} color={Colors.light.primary} />
                            <Text style={styles.tagSectionTitle}>Genres</Text>
                          </View>
                          <View style={styles.tagChips}>
                            {currentBook.genres.slice(0, 5).map((genre, index) => (
                              <View key={index} style={styles.tagChip}>
                                <Text style={styles.tagChipText}>{genre}</Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      )}

                      {currentBook.vibes.length > 0 && (
                        <View style={styles.tagsColumn}>
                          <View style={styles.tagHeader}>
                            <Heart size={16} color={Colors.light.primary} />
                            <Text style={styles.tagSectionTitle}>Vibes</Text>
                          </View>
                          <View style={styles.tagChips}>
                            {currentBook.vibes.slice(0, 5).map((vibe, index) => (
                              <View key={index} style={styles.tagChip}>
                                <Text style={styles.tagChipText}>{vibe}</Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      )}

                      {currentBook.themes.length > 0 && (
                        <View style={styles.tagsColumn}>
                          <View style={styles.tagHeader}>
                            <Hash size={16} color={Colors.light.primary} />
                            <Text style={styles.tagSectionTitle}>Themes</Text>
                          </View>
                          <View style={styles.tagChips}>
                            {currentBook.themes.slice(0, 5).map((theme, index) => (
                              <View key={index} style={styles.tagChip}>
                                <Text style={styles.tagChipText}>{theme}</Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      )}
                    </View>

                    <View style={styles.metadataRow}>
                      {currentBook.pages && (
                        <View style={styles.metadataItem}>
                          <Hash size={16} color={Colors.light.secondary} />
                          <Text style={styles.metadataText}>{currentBook.pages} pages</Text>
                        </View>
                      )}
                      <View style={styles.metadataItem}>
                        <Clock size={16} color={Colors.light.secondary} />
                        <Text style={styles.metadataText}>
                          {currentBook.pages ? Math.round(currentBook.pages / 300) : '?'} hours read
                        </Text>
                      </View>
                    </View>

                    {currentBook.reasons && currentBook.reasons.length > 0 && (
                      <View style={styles.detailSection}>
                        <Text style={styles.detailSectionTitle}>Why you might like it</Text>
                        {currentBook.reasons.map((reason, index) => (
                          <View key={index} style={styles.reasonItem}>
                            <View style={styles.reasonBullet} />
                            <Text style={styles.reasonText}>{reason}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </ScrollView>
                ) : (
                  <View style={styles.previewContainer}>
                    <View style={styles.previewStats}>
                      <View style={styles.previewStat}>
                        <Text style={styles.previewStatNumber}>{currentBook.genres.length}</Text>
                        <Text style={styles.previewStatLabel}>Genres</Text>
                      </View>
                      <View style={styles.previewStat}>
                        <Text style={styles.previewStatNumber}>{currentBook.vibes.length}</Text>
                        <Text style={styles.previewStatLabel}>Vibes</Text>
                      </View>
                      <View style={styles.previewStat}>
                        <Text style={styles.previewStatNumber}>{currentBook.themes.length}</Text>
                        <Text style={styles.previewStatLabel}>Themes</Text>
                      </View>
                    </View>
                    
                    {currentBook.description && (
                      <Text 
                        style={styles.previewDescription}
                        numberOfLines={3}
                        ellipsizeMode="tail"
                      >
                        {currentBook.description}
                      </Text>
                    )}
                  </View>
                )}

                <Pressable style={styles.detailsToggle} onPress={toggleDetails}>
                  <View style={styles.detailsToggleContent}>
                    <Text style={styles.detailsToggleText}>
                      {showDetails ? 'Show Less' : 'Show More Details'}
                    </Text>
                    {showDetails ? (
                      <ChevronUp size={20} color={Colors.light.primary} />
                    ) : (
                      <ChevronDown size={20} color={Colors.light.primary} />
                    )}
                  </View>
                </Pressable>
              </View>

              {/* Swipe Indicators */}
              <Animated.View style={[styles.likeIndicator, { opacity: likeOpacity }]}>
                <View style={styles.likeIndicatorBg}>
                  <Text style={styles.likeIndicatorText}>LIKE</Text>
                </View>
              </Animated.View>
              <Animated.View style={[styles.nopeIndicator, { opacity: nopeOpacity }]}>
                <View style={styles.nopeIndicatorBg}>
                  <Text style={styles.nopeIndicatorText}>PASS</Text>
                </View>
              </Animated.View>
            </Animated.View>
          )}
        </View>

        <View style={styles.controls}>
          <Pressable style={styles.passButton} onPress={handlePass}>
            <X size={24} color={Colors.light.background} />
            <Text style={styles.controlText}>Pass</Text>
          </Pressable>
          
          <Pressable style={styles.detailsButton} onPress={toggleDetails}>
            <Text style={styles.detailsButtonText}>
              {showDetails ? 'Hide Details' : 'Details'}
            </Text>
          </Pressable>
          
          <Pressable style={styles.likeButton} onPress={handleLike}>
            <Heart size={24} color={Colors.light.background} />
            <Text style={styles.controlText}>Like</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const CARD_WIDTH = SCREEN_WIDTH - 32;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.72;

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
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.light.primary,
  },
  savedIconButton: {
    padding: 6,
    position: 'relative',
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
  cardArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    position: "absolute",
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 24,
    backgroundColor: Colors.light.card,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
    overflow: "hidden",
  },
  coverContainer: {
    height: CARD_HEIGHT * 0.45,
    position: 'relative',
  },
  cover: {
    width: "100%",
    height: "100%",
  },
  coverOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  bookInfoHeader: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  bookTitleContainer: {
    marginBottom: 12,
  },
  bookTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.light.card,
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  matchPills: {
    flexDirection: "row",
    gap: 8,
    flexWrap: 'wrap',
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
    fontSize: 12,
  },
  detailsContainer: {
    flex: 1,
    padding: 16,
  },
  detailsScroll: {
    flex: 1,
  },
  previewContainer: {
    flex: 1,
  },
  previewStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  previewStat: {
    alignItems: 'center',
  },
  previewStatNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  previewStatLabel: {
    fontSize: 12,
    color: Colors.light.secondary,
    marginTop: 4,
  },
  previewDescription: {
    fontSize: 14,
    color: Colors.light.text,
    lineHeight: 20,
  },
  detailSection: {
    marginBottom: 20,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.primary,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: Colors.light.text,
    lineHeight: 22,
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  tagsColumn: {
    width: '48%',
    marginBottom: 16,
  },
  tagHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  tagSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  tagChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagChip: {
    backgroundColor: Colors.light.card + '40',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.card + '80',
  },
  tagChipText: {
    fontSize: 12,
    color: Colors.light.text,
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.light.card + '40',
    marginVertical: 16,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metadataText: {
    fontSize: 14,
    color: Colors.light.secondary,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingLeft: 16,
  },
  reasonBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.light.primary,
    marginTop: 6,
    marginRight: 8,
  },
  reasonText: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.text,
    lineHeight: 20,
  },
  detailsToggle: {
    borderTopWidth: 1,
    borderColor: Colors.light.card + '40',
    paddingTop: 12,
  },
  detailsToggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  detailsToggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  likeIndicator: {
    position: 'absolute',
    top: 40,
    right: 20,
    transform: [{ rotate: '15deg' }],
  },
  likeIndicatorBg: {
    backgroundColor: Colors.light.primary + '20',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: Colors.light.primary,
  },
  likeIndicatorText: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.light.primary,
  },
  nopeIndicator: {
    position: 'absolute',
    top: 40,
    left: 20,
    transform: [{ rotate: '-15deg' }],
  },
  nopeIndicatorBg: {
    backgroundColor: Colors.light.secondary + '20',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: Colors.light.secondary,
  },
  nopeIndicatorText: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.light.secondary,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
  },
  passButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    backgroundColor: Colors.light.secondary,
    borderRadius: 16,
  },
  detailsButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.card + '80',
  },
  detailsButtonText: {
    fontWeight: '600',
    fontSize: 14,
    color: Colors.light.primary,
  },
  likeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    backgroundColor: Colors.light.primary,
    borderRadius: 16,
  },
  controlText: {
    fontWeight: "700",
    fontSize: 16,
    color: Colors.light.background,
  },
});