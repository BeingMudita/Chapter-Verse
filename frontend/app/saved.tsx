import { router } from "expo-router";
import { ChevronLeft, Heart, Book } from "lucide-react-native";
import React from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { Book as BookType } from "@/constants/book";
import { useSavedBooks } from "@/contexts/SavedBooksContext";

export default function SavedScreen() {
  const { savedBooks } = useSavedBooks();

  const handleBack = () => {
    router.back();
  };

  const renderBook = ({ item }: { item: BookType }) => (
    <View style={styles.bookCard}>
      <Image source={{ uri: item.coverUrl }} style={styles.bookCover} />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.bookAuthor} numberOfLines={1}>
          {item.author}
        </Text>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Heart size={16} color={Colors.light.primary} fill={Colors.light.primary} />
          </View>
          <View style={styles.stat}>
            <Book size={16} color={Colors.light.secondary} />
            <Text style={styles.statText}>{item.pages} pages</Text>
          </View>
        </View>
        <View style={styles.genres}>
          {item.genres.slice(0, 2).map((genre) => (
            <View key={genre} style={styles.genreTag}>
              <Text style={styles.genreText}>{genre}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable onPress={handleBack} style={styles.backButton}>
            <ChevronLeft size={28} color={Colors.light.primary} />
          </Pressable>
          <Text style={styles.headerTitle}>Saved Books</Text>
          <View style={styles.placeholder} />
        </View>

        {savedBooks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Heart size={80} color={Colors.light.border} />
            <Text style={styles.emptyTitle}>No saved books yet</Text>
            <Text style={styles.emptyText}>
              Start swiping to find books you love!
            </Text>
            <Pressable
              style={styles.exploreButton}
              onPress={() => router.push("/discover")}
            >
              <Text style={styles.exploreButtonText}>Discover Books</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={savedBooks}
            renderItem={renderBook}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.light.primary,
  },
  placeholder: {
    width: 36,
  },
  list: {
    padding: 20,
    gap: 16,
  },
  bookCard: {
    flexDirection: "row",
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 12,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  bookCover: {
    width: 100,
    height: 150,
    borderRadius: 12,
    backgroundColor: Colors.light.border,
  },
  bookInfo: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.light.text,
    lineHeight: 24,
  },
  bookAuthor: {
    fontSize: 14,
    color: Colors.light.secondary,
    fontWeight: "500" as const,
  },
  stats: {
    flexDirection: "row",
    gap: 16,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 14,
    color: Colors.light.secondary,
    fontWeight: "500" as const,
  },
  genres: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  genreTag: {
    backgroundColor: Colors.light.accent,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  genreText: {
    fontSize: 11,
    color: Colors.light.primary,
    fontWeight: "600" as const,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.light.text,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.secondary,
    textAlign: "center",
    lineHeight: 24,
  },
  exploreButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 24,
    marginTop: 8,
  },
  exploreButtonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: "700" as const,
  },
});
