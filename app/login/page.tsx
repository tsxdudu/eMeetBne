"use client"

import AuthForm from "../components/AuthForm";


export default function LoginPage() {

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 gap-6">
      <div className="w-full max-w-md">
        <AuthForm mode="login" />
      </div>
    </div>
  );
}
