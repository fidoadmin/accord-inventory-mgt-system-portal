"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useVerifyAndUpdatePassword } from "@/app/hooks/forgotpassword/useVerifyAndUpdatePassword";
import Password from "@/components/Password";
import { checkStrength } from "@/utils/passwordUtils";

export default function ResetPassword({
  params,
}: {
  params: { passwordChangeRequestId: string };
}) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visibleNew, setVisibleNew] = useState(false);
  const [visibleConfirm, setVisibleConfirm] = useState(false);

  const router = useRouter();
  const { mutateAsync: verifyAndUpdatePassword } = useVerifyAndUpdatePassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const strength = checkStrength(newPassword);
    const strengthScore = strength.filter((req) => req.valid).length;
    if (strengthScore < 5) {
      toast.error("Password does not meet the required strength.");
      return;
    }

    try {
      const response: { success: boolean; message: string } =
        await verifyAndUpdatePassword({
          passwordChangeRequestId: params.passwordChangeRequestId,
          newPassword,
        });

      if (response.success) {
        router.push("/");
      }
    } catch (error) {
      toast.error("Error changing password.");
    }
  };

  return (
    <div className="bg-gray-50 flex flex-col items-center justify-center min-h-screen py-10">
      <ToastContainer />
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Reset Password
        </h1>
        <div className="space-y-5">
          <div>
            <label className="block text-gray-600 font-semibold mb-1">
              New Password
            </label>
            <Password
              value={newPassword}
              onChange={(e: any) => setNewPassword(e.target.value)}
              visible={visibleNew}
              onToggleVisibility={() => setVisibleNew(!visibleNew)}
            />
          </div>

          <div>
            <label className="block text-gray-600 font-semibold mb-1">
              Confirm Password
            </label>
            <Password
              value={confirmPassword}
              onChange={(e: any) => setConfirmPassword(e.target.value)}
              visible={visibleConfirm}
              onToggleVisibility={() => setVisibleConfirm(!visibleConfirm)}
            />
          </div>

          <div className="flex justify-center mt-4">
            <button
              onClick={handleSubmit}
              className={`w-full text-white py-2 px-4 rounded-lg transition-all ${
                newPassword !== confirmPassword || newPassword === ""
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={newPassword !== confirmPassword || newPassword === ""}
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
