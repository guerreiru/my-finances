import { User } from "../types/User";

export function getStoredUser(): User | null {
  const stored = localStorage.getItem("user");
  return stored ? JSON.parse(stored) : null;
}
