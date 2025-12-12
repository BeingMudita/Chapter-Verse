import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, useMutation } from "@tanstack/react-query";
import createContextHook from "@nkzw/create-context-hook";
import { useEffect, useState } from "react";

import { Book } from "@/constants/book";
const SAVED_BOOKS_KEY = "saved_books";

export const [SavedBooksContext, useSavedBooks] = createContextHook(() => {
  const [savedBooks, setSavedBooks] = useState<Book[]>([]);

  const savedBooksQuery = useQuery<Book[]>({
  queryKey: ["savedBooks"],
  queryFn: async () => {
    const stored = await AsyncStorage.getItem(SAVED_BOOKS_KEY);
    return stored ? (JSON.parse(stored) as Book[]) : [];
  },
});
  const syncMutation = useMutation({
    mutationFn: async (books: Book[]) => {
      await AsyncStorage.setItem(SAVED_BOOKS_KEY, JSON.stringify(books));
      return books;
    },
  });

  useEffect(() => {
    if (savedBooksQuery.data) {
      setSavedBooks(savedBooksQuery.data);
    }
  }, [savedBooksQuery.data]);

  const addBook = (book: Book) => {
  setSavedBooks((prev) => {
    const isAlreadySaved = prev.some((b) => b.id === book.id);
    if (isAlreadySaved) return prev;
    const updated = [...prev, book];
    syncMutation.mutate(updated);
    return updated;
  });
};

const removeBook = (bookId: string) => {
  setSavedBooks((prev) => {
    const updated = prev.filter((b) => b.id !== bookId);
    syncMutation.mutate(updated);
    return updated;
  });
};

  return {
    savedBooks,
    addBook,
    removeBook,
    isLoading: savedBooksQuery.isLoading,
  };
});
