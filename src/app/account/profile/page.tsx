"use client";

import { useEffect, useState } from "react";
import { User } from "@/utils/types";
import { getCurrentUser } from "@/utils/functions/getCurrentUser";
import { updateCurrentUser } from "@/utils/functions/updateCurrentUser";
import { logout } from "@/app/auth/actions";
import { isCurrentUserAdmin } from "@/utils/functions/isCurrentUserAdmin";
import Link from "next/link";

const inputClass =
  "w-full bg-surface-raised border border-line-strong rounded-sm px-4 py-2.5 text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-field/30 focus:border-field";
const labelClass = "text-sm font-medium text-ink";

export default function Profile() {
  const [userData, setUserData] = useState<User | null>(null);
  const [showFields, setShowFields] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const user = await getCurrentUser();
        setUserData(user);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserData(null);
      }
    }

    fetchUserData();
    isCurrentUserAdmin()
      .then(setIsAdmin)
      .catch(() => setIsAdmin(false));
  }, []);

  const handleClick = () => {
    setShowFields(!showFields);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      await updateCurrentUser(formData);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto min-w-0">
      <div className="bg-surface-raised rounded-md border border-line p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h1 className="text-display text-ink">
            Your Profile
          </h1>
          <div className="flex gap-2">
            {isAdmin && (
              <Link
                href="/admin"
                className="inline-flex items-center justify-center bg-field border border-field text-on-field font-medium px-4 py-2 rounded-full no-underline hover:opacity-90 transition-opacity w-fit"
              >
                Admin
              </Link>
            )}
            <button
              type="button"
              onClick={handleClick}
              className="inline-flex items-center justify-center bg-surface-raised border border-line-strong text-ink font-medium px-4 py-2 rounded-md hover:bg-surface transition-colors w-fit"
            >
              {showFields ? "Cancel" : "Edit"}
            </button>
            <button
              type="button"
              onClick={() => logout()}
              className="inline-flex items-center justify-center bg-surface-raised border border-danger/30 text-danger font-medium px-4 py-2 rounded-md hover:bg-danger/10 transition-colors w-fit"
            >
              Log out
            </button>
          </div>
        </div>

        {showFields && (
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex flex-col gap-4">
              <span className="flex flex-col gap-2">
                <label htmlFor="profile-name" className={labelClass}>
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  id="profile-name"
                  placeholder="Priya Raman"
                  defaultValue={userData?.name}
                  className={inputClass}
                />
              </span>
              <span className="flex flex-col gap-2">
                <label htmlFor="profile-phone" className={labelClass}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  autoComplete="tel-national"
                  inputMode="numeric"
                  id="profile-phone"
                  placeholder="9176111222"
                  defaultValue={userData?.phone}
                  className={inputClass}
                />
              </span>
              <span className="flex flex-col gap-2">
                <label htmlFor="profile-address" className={labelClass}>
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  autoComplete="street-address"
                  id="profile-address"
                  placeholder="42 Wallaby Way, Sydney"
                  defaultValue={userData?.address}
                  className={inputClass}
                />
              </span>
              <span className="flex flex-col gap-2">
                <label htmlFor="profile-email" className={labelClass}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  id="profile-email"
                  placeholder="customer@mail.com"
                  defaultValue={userData?.email}
                  className={inputClass}
                />
              </span>
              <button
                type="submit"
                className="w-full bg-field text-on-field font-semibold py-2.5 px-4 rounded-md hover:opacity-90 transition-opacity mt-2"
              >
                Update
              </button>
            </div>
          </form>
        )}

        <div className="flex flex-col gap-4 border-t border-line pt-6">
          <div>
            <p className="text-sm text-ink-muted">Name</p>
            <p className="font-medium text-ink">
              {userData?.name ?? "—"}
            </p>
          </div>
          <div>
            <p className="text-sm text-ink-muted">Phone number</p>
            <p className="font-medium text-ink">
              {userData?.phone ?? "—"}
            </p>
          </div>
          <div>
            <p className="text-sm text-ink-muted">Email</p>
            <p className="font-medium text-ink">
              {userData?.email ?? "—"}
            </p>
          </div>
          <div>
            <p className="text-sm text-ink-muted">Address</p>
            <p className="font-medium text-ink">
              {userData?.address ?? "—"}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 border-t border-line mt-6 pt-6">
          <Link
            href="/account/orders"
            className="flex-1 inline-flex items-center justify-center bg-surface-raised border border-line-strong text-ink font-medium px-4 py-2.5 rounded-md no-underline hover:bg-surface transition-colors"
          >
            Your Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
