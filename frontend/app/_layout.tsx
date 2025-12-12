// template
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { SavedBooksContext } from "@/contexts/SavedBooksContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="questions" options={{ headerShown: false }} />
      <Stack.Screen name="discover" options={{ headerShown: false }} />
      <Stack.Screen name="saved" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SavedBooksContext>
        <GestureHandlerRootView>
          <RootLayoutNav />
        </GestureHandlerRootView>
      </SavedBooksContext>
    </QueryClientProvider>
  );
}
