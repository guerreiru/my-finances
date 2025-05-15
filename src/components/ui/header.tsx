"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";

interface UserData {
  displayName: string;
  photoURL: string;
  email: string;
}

export function Header() {
  const user = useUser();

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
