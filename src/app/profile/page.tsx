"use client";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { VisibilityOffRounded, VisibilityRounded } from "@mui/icons-material";
import {
  AddOrUpdateUserPayloadInterface,
  UserPasswordInterface,
} from "@/types/UserInterface";
import { useUserGetList } from "../hooks/users/useUserGetList";
import { useAddOrUpdateUser } from "../hooks/users/useUserUpdate";
import { useAddOrUpdateUserPassword } from "../hooks/users/useUserPassword";
import { getCookie } from "cookies-next";
import Password from "@/components/Password";
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
  const [isEditing, setIsEditing] = useState(false);
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
  const [passChange, setPassChange] = useState<UserPasswordInterface | null>(
    null
  );
  const [roleCode, setRoleCode] = useState<string | null>(null);
  const initialInventoryData = {
    Id: "",
    FirstName: "",
    LastName: "",
    Address: "",
    Emailaddress: "",
    MobileNumber: "",
    LandlineNumber: "",
    Password: "",
    RePassword: "",
  };
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
  const { mutate: addOrUpdateUserProfile } = useAddOrUpdateUser();
  const { mutateAsync: addOrUpdateUserPassword } = useAddOrUpdateUserPassword();

  const [descAddData, setDescAddData] =
    useState<AddOrUpdateUserPayloadInterface>(initialInventoryData);
  useEffect(() => {
    if (userList) {
      setUsers([userList]);
      setEditableUser(userList);
    }
  }, [userList]);
  const handleSave = async () => {
    if (editableUser?.MobileNumber && editableUser.MobileNumber.length !== 10) {
      toast.error("Mobile Number should be exactly 10 digits.", {
        position: "top-right",
      });
      return;
    }
    if (
      editableUser?.LandlineNumber &&
      editableUser.LandlineNumber.length !== 9 &&
      editableUser.LandlineNumber.length !== 10
    ) {
      toast.error("Pan Number should be exactly 9 or 10 digits.", {
        position: "top-right",
      });
      return;
    }
    try {
      await addOrUpdateUserProfile(editableUser);
      setIsEditing(false);
    } catch (error) {
      toast.error("Error updating user profile.");
    }
  };
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
    } catch (error) {}
  };

  const handleCancelPasswordChange = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsChangingPassword(false);
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
        <div className="space-y-6">
          {!isChangingPassword ? (
            <>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-600">First Name:</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editableUser?.FirstName || ""}
                    onChange={(e) =>
                      setEditableUser({
                        ...editableUser,
                        FirstName: e.target.value,
                      })
                    }
                    className="border px-3 py-1 rounded-lg w-2/3"
                  />
                ) : (
                  <span>{editableUser?.FirstName || "N/A"}</span>
                )}
              </div>
              <div className="flex justify-between mt-4">
                <span className="font-semibold text-gray-600">Last Name:</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editableUser?.LastName || ""}
                    onChange={(e) =>
                      setEditableUser({
                        ...editableUser,
                        LastName: e.target.value,
                      })
                    }
                    className="border px-3 py-1 rounded-lg w-2/3"
                  />
                ) : (
                  <span>{editableUser?.LastName || "N/A"}</span>
                )}
              </div>
              <div className="flex justify-between mt-4">
                <span className="font-semibold text-gray-600">
                  Email Address:
                </span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editableUser?.EmailAddress || ""}
                    onChange={(e) =>
                      setEditableUser({
                        ...editableUser,
                        EmailAddress: e.target.value,
                      })
                    }
                    className="border px-3 py-1 rounded-lg w-2/3"
                  />
                ) : (
                  <span>{editableUser?.EmailAddress || "N/A"}</span>
                )}
              </div>
              <div className="flex justify-between mt-4">
                <span className="font-semibold text-gray-600">
                  Mobile Number:
                </span>
                {isEditing ? (
                  <input
                    type="number"
                    value={editableUser?.MobileNumber || ""}
                    maxLength={10}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 10) {
                        setEditableUser((prev: any) => ({
                          ...prev!,
                          MobileNumber: value,
                        }));
                      }
                    }}
                    className="border p-2 rounded"
                  />
                ) : (
                  <span>{editableUser?.MobileNumber || "N/A"}</span>
                )}
              </div>
              <div className="flex justify-between mt-4">
                <span className="font-semibold text-gray-600">
                  Landline Number:
                </span>
                {isEditing ? (
                  <input
                    type="number"
                    value={editableUser?.LandlineNumber || ""}
                    maxLength={10}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 10) {
                        setEditableUser((prev: any) => ({
                          ...prev!,
                          LandlineNumber: value,
                        }));
                      }
                    }}
                    className="border p-2 rounded"
                  />
                ) : (
                  <span>{editableUser?.LandlineNumber || "N/A"}</span>
                )}
              </div>
              <div className="flex justify-between mt-4">
                <span className="font-semibold text-gray-600">
                  Staff Number:
                </span>
                <span>{editableUser?.StaffNumber || "N/A"}</span>
              </div>
              {roleCode !== "USERROLE_SYSTEMADMIN" && (
                <div className="flex justify-between mt-4">
                  <span className="font-semibold text-gray-600">
                    Organization:
                  </span>
                  <span>{editableUser?.ClientName || "N/A"}</span>
                </div>
              )}
              <div className="flex justify-between mt-4">
                <span className="font-semibold text-gray-600">Role:</span>
                <span>{editableUser?.RoleName || "N/A"}</span>
              </div>
              {roleCode !== "USERROLE_SYSTEMADMIN" && (
                <div className="flex justify-between mt-4">
                  <span className="font-semibold text-gray-600">Company:</span>
                  <span className="block text-right pl-14">
                    {editableUser?.CompanyName || "N/A"}
                  </span>
                </div>
              )}
              <div className="mt-8 flex justify-between">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="bg-success text-white py-2 px-4 rounded-lg"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-error text-white py-2 px-4 rounded-lg"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-primary text-white py-2 px-4 rounded-lg"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={() => setIsChangingPassword(true)}
                      className="bg-primary text-white py-2 px-4 rounded-lg"
                    >
                      Password Settings
                    </button>
                  </>
                )}
              </div>
            </>
          ) : (
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
                  className="bg-success text-white py-2 px-4 rounded-lg"
                >
                  Change Password
                </button>
                <button
                  onClick={handleCancelPasswordChange}
                  className="bg-error text-white py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default ProfilePage;
