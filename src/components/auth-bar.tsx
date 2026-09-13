"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function AuthBar() {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <p style={{ letterSpacing: "0.12em", fontSize: 12, color: "#0F766E" }}>
        SHIP THE MODEL · ASTRA v9
      </p>
      <SignedOut>
        <SignInButton mode="modal">
          <button
            type="button"
            style={{
              padding: "8px 12px",
              border: 0,
              borderRadius: 6,
              background: "#0B1F33",
              color: "white",
            }}
          >
            Sign in
          </button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}
