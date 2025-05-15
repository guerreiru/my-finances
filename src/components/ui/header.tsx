"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface UserData {
  displayName: string;
  photoURL: string;
  email: string;
}

export default function Header() {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser({
        displayName: parsedUser.displayName,
        photoURL: parsedUser.photoURL,
        email: parsedUser.email,
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  if (!user) return null;

  return (
    <header className="flex items-center justify-between p-4 bg-gray-100 rounded-xl mb-6 shadow-sm">
      <div className="flex items-center gap-4">
        <img
          src={user.photoURL}
          alt={user.displayName}
          width={40}
          height={40}
          className="rounded-full"
        />
        <span className="font-medium text-sm">{user.displayName}</span>
      </div>
      <Button onClick={handleLogout}>Sair</Button>
    </header>
  );
}
