"use client";
import Link from "next/link";
import { useState } from "react";
import { logout } from "@/app/auth/actions";

export default function MoreButton() {
  const [clickStatus, setClickStatus] = useState(false);

  return (
    <div className="">
      <button
        onClick={() => setClickStatus(!clickStatus)}
        className="w-24 h-10 relative underline underline-offset-4 text-right z-10"
      >
        More
      </button>
      {clickStatus && (
        <span className="w-24 flex flex-col gap-2 absolute bg-surface-raised rounded-md p-4 mt-2">
          <Link
            href="/account/profile"
            onClick={() => setClickStatus(!clickStatus)}
            className="text-lime-800 no-underline"
          >
            Profile
          </Link>
          <Link
            href="/account/orders"
            onClick={() => setClickStatus(!clickStatus)}
            className="text-lime-800 no-underline"
          >
            Orders
          </Link>
          <p>
            <button onClick={logout} className="text-lime-800">
              Logout
            </button>
          </p>
        </span>
      )}
    </div>
  );
}
