"use client";

import Link from "next/link";
import { signup } from "../actions";
import { useState } from "react";

const inputClass =
  "w-full bg-surface-raised border border-line-strong rounded-sm px-4 py-2.5 text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-field/30 focus:border-field";
const labelClass = "text-sm font-medium text-ink";

export default function SignUp() {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const result = await signup(formData);

    if (result.error) {
      setError(result.error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-surface-raised rounded-md border border-line p-6 sm:p-8">
        <h2 className="text-display text-ink mb-6">Sign up</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <span className="flex flex-col gap-2">
            <label htmlFor="name" className={labelClass}>
              Name
            </label>
            <input
              type="text"
              name="name"
              autoComplete="name"
              id="name"
              placeholder="John Doe"
              required
              className={inputClass}
            />
          </span>
          <span className="flex flex-col gap-2">
            <label htmlFor="phone" className={labelClass}>
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              autoComplete="tel-national"
              inputMode="numeric"
              id="phone"
              placeholder="9176111222"
              required
              className={inputClass}
            />
          </span>
          <span className="flex flex-col gap-2">
            <label htmlFor="address" className={labelClass}>
              Address
            </label>
            <input
              type="text"
              name="address"
              autoComplete="street-address"
              id="address"
              placeholder="42 Wallaby Way, Sydney"
              required
              className={inputClass}
            />
          </span>
          <span className="flex flex-col gap-2">
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              type="email"
              name="email"
              autoComplete="email"
              id="email"
              placeholder="customer@mail.com"
              required
              className={inputClass}
            />
          </span>
          <span className="flex flex-col gap-2">
            <label htmlFor="password" className={labelClass}>
              Password
            </label>
            <input
              type="password"
              name="password"
              autoComplete="new-password"
              id="password"
              placeholder="••••••••"
              required
              className={inputClass}
            />
          </span>
          {error && (
            <p className="text-sm text-danger">Failed to sign up, please try again.</p>
          )}
          <button
            type="submit"
            className="w-full bg-field text-on-field font-semibold py-2.5 px-4 rounded-md hover:opacity-90 transition-opacity mt-2"
          >
            Sign up
          </button>
        </form>
        <p className="mt-4 text-sm text-ink-muted">
          Existing user?{" "}
          <Link href="/auth/login" className="text-sm text-field no-underline hover:underline">
            Log in here
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
