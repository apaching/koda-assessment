"use client";

import { useMutation } from "@tanstack/react-query";

type SignUpBody = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export function useSignUp() {
  return useMutation({
    mutationFn: async (body: SignUpBody) => {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Sign up failed");
      }

      return data;
    },
  });
}
