import { useEffect, useState } from "react";
import { User } from "../types/User";
import { getStoredUser } from "../lib/user";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = getStoredUser();

    if (!storedUser) {
      window.location.href = "/login";
    } else {
      setUser(storedUser);
    }
  }, []);

  return user;
}
