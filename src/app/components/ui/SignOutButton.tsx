"use client";

import { signOutAction } from "@/actions/auth/signOutAction";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOutAction()}
      className="px-4 py-2 text-sm bg-red-600/80 hover:bg-red-600 text-white rounded-lg transition-colors font-inter"
    >
      Sign Out
    </button>
  );
}
