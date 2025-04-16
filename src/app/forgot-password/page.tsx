"use client";
import { useState } from "react";
import { useAddChangePasswordRequest } from "../hooks/forgotpassword/useAddPasswordChangeRequest";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const passwordChangeRequestMutation = useAddChangePasswordRequest();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await passwordChangeRequestMutation.mutateAsync(email);
      if (response.Emailaddress) {
        setIsSuccessful(true);
      }
    } catch (err) {
      setError("Failed to send reset link. Please try again.");
    }
  };

  return (
    <div className="mainContainer min-h-screen flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-lg p-6 bg-white shadow-xl rounded-lg">
        <h1 className="text-2xl font-black text-center text-primary mb-6">
          Forgot Password
        </h1>
        <p className="text-sm text-gray-600 text-center mb-4">
          Enter your email address, and we’ll send you a link to reset your
          password.
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-4"
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          {!isSuccessful && (
            <button
              type="submit"
              className="w-56 bg-success text-white font-medium py-2 rounded-xl hover:opacity-90 transition"
            >
              {passwordChangeRequestMutation.isPending
                ? "Sending..."
                : "Send Reset Link"}
            </button>
          )}
          {isSuccessful && (
            <p className="text-success text-center">
              A reset link has been sent to your email. Please check your inbox.
            </p>
          )}
          {error && <p className="text-error text-center">{error}</p>}
        </form>
        <div className="text-center mt-6">
          <a href="/login" className="text-sm text-error hover:underline">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}
