export type UserSignalPayload = {
  user_id: string;
  book_id: string;
  signal: "click" | "like" | "save";
};
import { API_BASE_URL } from "./config";

export async function sendSignal(payload: UserSignalPayload) {
  const res = await fetch(`${API_BASE_URL}/api/v1/signals/event`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    console.warn("Failed to send signal", payload);
  }
}