"use client";

import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { VisibilityOffRounded, VisibilityRounded } from "@mui/icons-material";
import { useUserGetList } from "../hooks/users/useUserGetList";
import { useAddOrUpdateUserPassword } from "../hooks/users/useUserPassword";
import { getCookie } from "cookies-next";
import Password from "@/components/Password";
import { useRouter } from "next/navigation";
import { checkStrength } from "@/utils/passwordUtils";

function ProfilePage() {
  const authKey = getCookie("authKey") as string;
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserId(localStorage.getItem("userId"));
    }
  }, []);
  const [users, setUsers] = useState<any[]>([]);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordVisibility, setPasswordVisibility] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [editableUser, setEditableUser] = useState<any | null>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [visibleNew, setVisibleNew] = useState<boolean>(false);
  const [visibleConfirm, setVisibleConfirm] = useState<boolean>(false);
  const [roleCode, setRoleCode] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserId(localStorage.getItem("userId"));
    }
    const RoleCode = localStorage.getItem("RoleCode");
    setRoleCode(RoleCode);
  }, []);

  const { data: userList } = useUserGetList(userId || "");

  useEffect(() => {
    if (userList) {
      setEditableUser(userList);
    }
  }, [userList]);

  const { mutateAsync: addOrUpdateUserPassword } = useAddOrUpdateUserPassword();

  useEffect(() => {
    if (userList) {
      setUsers([userList]);
      setEditableUser(userList);
    }
  }, [userList]);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }
    const strength = checkStrength(newPassword);
    const strengthScore = strength.filter((req) => req.valid).length;
    if (strengthScore < 5) {
      toast.error("Password does not meet the required strength.");
      return;
    }

    try {
      await addOrUpdateUserPassword({
        Id: userId || "",
        CurrentPassword: currentPassword,
        ChangePassword: newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsChangingPassword(false);
      router.push("/login");
    } catch (error) {}
  };

  return (
    <div className="bg-gray-50 flex flex-col items-center justify-center py-8">
      <ToastContainer />
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          User Profile
        </h1>
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-4xl text-primary font-bold mb-4">
            {editableUser?.FirstName?.charAt(0)}
            {editableUser?.LastName?.charAt(0)}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="relative">
            <label className="block text-gray-600 font-semibold">
              Current Password:
            </label>
            <input
              type={visible ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="border rounded-xl px-2 py-2 w-full pr-10 mb-3"
            />
            <span
              className="absolute inset-y-0 end-0 flex items-center z-20 px-2.5 cursor-pointer text-gray-400 rounded-e-md focus:outline-none focus-visible:text-indigo-500 hover:text-indigo-500 transition-colors"
              onClick={() => setVisible(!visible)}
            >
              {visible ? <VisibilityRounded /> : <VisibilityOffRounded />}
            </span>
          </div>

          <div className="relative">
            <label className="block text-gray-600 font-semibold">
              New Password:
            </label>
            <Password
              value={newPassword}
              onChange={(e: any) => setNewPassword(e.target.value)}
              visible={visibleNew}
              onToggleVisibility={() => setVisibleNew(!visibleNew)}
            />
          </div>
          <div className="relative">
            <label className="block text-gray-600 font-semibold">
              Confirm Password:
            </label>
            <Password
              value={confirmPassword}
              onChange={(e: any) => setConfirmPassword(e.target.value)}
              visible={visibleConfirm}
              onToggleVisibility={() => setVisibleConfirm(!visibleConfirm)}
            />
          </div>
          <div className="flex justify-between">
            <button
              onClick={handleChangePassword}
              className="w-full bg-success text-white py-2 px-4 rounded-lg"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
