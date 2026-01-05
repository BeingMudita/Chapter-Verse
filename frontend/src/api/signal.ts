import { API_BASE_URL } from "./config";
export async function sendSignal(payload: {
  user_id: string;
  book_id: string;
  signal: "like" | "click";
}) {
  await fetch(`${API_BASE_URL}/api/v1/signals/event`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
