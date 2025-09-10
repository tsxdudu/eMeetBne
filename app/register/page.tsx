"use client"

import AuthForm from "../components/AuthForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <AuthForm mode="register" />
    </div>
  );
}
