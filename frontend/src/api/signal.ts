export type UserSignalPayload = {
  user_id: string;
  book_id: string;
  signal: "click" | "like" | "save";
};

export async function sendSignal(payload: UserSignalPayload) {
  const res = await fetch("http://127.0.0.1:8000/api/v1/signals/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    console.warn("Failed to send signal", payload);
  }
}