import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_ID_KEY = "user_id";

export async function getUserId(): Promise<string> {
  const existing = await AsyncStorage.getItem(USER_ID_KEY);
  if (existing) return existing;

  const res = await fetch("http://<YOUR-IP>:8000/api/v1/auth/anonymous", {
    method: "POST",
  });

  if (!res.ok) throw new Error("Failed to create user");

  const { user_id } = await res.json();
  await AsyncStorage.setItem(USER_ID_KEY, user_id);

  return user_id;
}
