"use client";

import { useMutation } from "@tanstack/react-query";

type SignInBody = {
  email: string;
  password: string;
};

export function useSignIn() {
  return useMutation({
    mutationFn: async (body: SignInBody) => {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Sign in failed");
      }

      return data;
    },
  });
}
