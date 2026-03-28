export type ChatRole = "user" | "ai";

export interface ChatMessageItem {
  id: string;
  role: ChatRole;
  message: string;
}
