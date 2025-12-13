import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { useEffect, useState } from "react";

import { UserPreferences } from "@/constants/book";

const STORAGE_KEY = "user_preferences";

export const [PreferencesProvider, usePreferences] = createContextHook(() => {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load preferences on app start
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setPreferences(JSON.parse(stored));
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const savePreferences = async (prefs: UserPreferences) => {
    setPreferences(prefs);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  };

  return {
    preferences,
    setPreferences: savePreferences,
    isLoading,
  };
});
