import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Random from "expo-random";
import { v4 as uuidv4 } from "uuid";

const USER_ID_KEY = "user_id";

function getRandomValues(buffer: Uint8Array) {
  const bytes = Random.getRandomBytes(buffer.length);
  buffer.set(bytes);
  return buffer;
}

// Patch global crypto ONCE
if (typeof global.crypto !== "object") {
  // @ts-ignore
  global.crypto = {};
}
// @ts-ignore
global.crypto.getRandomValues = getRandomValues;

export async function getUserId(): Promise<string> {
  const existing = await AsyncStorage.getItem(USER_ID_KEY);
  if (existing) return existing;

  const id = uuidv4();
  await AsyncStorage.setItem(USER_ID_KEY, id);
  return id;
}
