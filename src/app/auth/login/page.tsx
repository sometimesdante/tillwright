"use client";

import Link from "next/link";
import { login } from "../actions";
import { useState } from "react";

export default function Login() {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const result = await login(formData);

    if (result.error) {
      setError(result.error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-surface-raised rounded-md border border-line p-6 sm:p-8">
        <h2 className="text-display text-ink mb-6">Log in</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <span className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-ink">
              Email
            </label>
            <input
              type="email"
              name="email"
              autoComplete="email"
              id="email"
              placeholder="customer@mail.com"
              required
              className="w-full bg-surface-raised border border-line-strong rounded-sm px-4 py-2.5 text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-field/30 focus:border-field"
            />
          </span>
          <span className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium text-ink">
              Password
            </label>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              id="password"
              placeholder="••••••••"
              required
              className="w-full bg-surface-raised border border-line-strong rounded-sm px-4 py-2.5 text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-field/30 focus:border-field"
            />
          </span>
          {error && (
            <p className="text-sm text-danger">Failed to login, please try again.</p>
          )}
          <button
            type="submit"
            className="w-full bg-field text-on-field font-semibold py-2.5 px-4 rounded-md hover:opacity-90 transition-opacity mt-2"
          >
            Log in
          </button>
        </form>
        <p className="mt-4 text-sm text-ink-muted">
          New user?{" "}
          <Link href="/auth/signup" className="text-sm text-field no-underline hover:underline">
            Sign up here
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
