import { Platform } from "react-native";

export const API_BASE_URL =
  Platform.OS === "android"
    ? "http://192.168.31.101:8000"
    : "http://127.0.0.1:8000";
