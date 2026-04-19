"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pharmacy, setPharmacy] = useState("");
  const [avatar, setAvatar] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const storedUser = localStorage.getItem("rxflowUser");

    if (!storedUser) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(parsedUser);
    setName(parsedUser.name || "");
    setEmail(parsedUser.email || "");
    setPharmacy(parsedUser.pharmacy || "");
    setAvatar(parsedUser.avatar || "");
  }, [router]);

  if (!user) return null;

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-100";

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setAvatar(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const saveProfile = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!pharmacy.trim()) newErrors.pharmacy = "Pharmacy name is required";

    setErrors((prev) => ({
      ...prev,
      name: newErrors.name,
      pharmacy: newErrors.pharmacy,
    }));
    setProfileMessage("");

    if (Object.keys(newErrors).length > 0) return;

    const users = JSON.parse(localStorage.getItem("rxflowUsers")) || [];

    const updatedUsers = users.map((u) =>
      u.email === user.email ? { ...u, name, pharmacy, avatar } : u
    );

    const updatedCurrentUser = {
      ...user,
      name,
      pharmacy,
      avatar,
    };

    localStorage.setItem("rxflowUsers", JSON.stringify(updatedUsers));
    localStorage.setItem("rxflowUser", JSON.stringify(updatedCurrentUser));

    setUser(updatedCurrentUser);
    setProfileMessage("Profile updated successfully");
  };

  const changePassword = () => {
    const newErrors = {};
    const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>_\-\\[\]/`~+=;'"]/;

    setPasswordMessage("");

    if (!currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!newPassword.trim()) {
      newErrors.newPassword = "New password is required";
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    } else if (!specialCharacterRegex.test(newPassword)) {
      newErrors.newPassword =
        "Password must include at least 1 special character";
    }

    if (!confirmNewPassword.trim()) {
      newErrors.confirmNewPassword = "Please confirm new password";
    } else if (newPassword !== confirmNewPassword) {
      newErrors.confirmNewPassword = "Passwords do not match";
    }

    const users = JSON.parse(localStorage.getItem("rxflowUsers")) || [];
    const matchedUser = users.find((u) => u.email === user.email);

    if (
      matchedUser &&
      currentPassword &&
      matchedUser.password !== currentPassword
    ) {
      newErrors.currentPassword = "Current password is incorrect";
    }

    setErrors((prev) => ({
      ...prev,
      currentPassword: newErrors.currentPassword,
      newPassword: newErrors.newPassword,
      confirmNewPassword: newErrors.confirmNewPassword,
    }));

    if (Object.keys(newErrors).length > 0) return;

    const updatedUsers = users.map((u) =>
      u.email === user.email ? { ...u, password: newPassword } : u
    );

    const updatedCurrentUser = {
      ...user,
      password: newPassword,
    };

    localStorage.setItem("rxflowUsers", JSON.stringify(updatedUsers));
    localStorage.setItem("rxflowUser", JSON.stringify(updatedCurrentUser));

    setUser(updatedCurrentUser);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setPasswordMessage("Password updated successfully");
  };

  const deleteAccount = () => {
    const confirmed = window.confirm(
      "Are you sure you want to close your account? This cannot be undone."
    );

    if (!confirmed) return;

    const users = JSON.parse(localStorage.getItem("rxflowUsers")) || [];
    const updatedUsers = users.filter((u) => u.email !== user.email);

    localStorage.setItem("rxflowUsers", JSON.stringify(updatedUsers));
    localStorage.removeItem("rxflowUser");

    router.push("/");
  };

  return (
    <main className="min-h-screen bg-slate-100">
      <Navbar user={user} />

      <div className="mx-auto max-w-4xl p-6 md:p-10">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-sky-700"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <h1 className="text-4xl font-bold text-slate-900">Profile</h1>
        </div>

        <div className="space-y-8">
          {/* Profile Info */}
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-semibold text-slate-900">
              Profile Information
            </h2>

            {/* Avatar */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-slate-200">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User size={34} className="text-slate-500" />
                )}
              </div>

              <div className="flex flex-col gap-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Profile Picture
                  </label>

                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer rounded-lg bg-sky-700 px-5 py-2 text-sm font-medium text-white transition hover:bg-sky-800">
                      {avatar ? "Change Photo" : "Upload Photo"}

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </label>

                    <span className="text-sm text-slate-500">
                      {avatar ? "Image selected ✓" : "No file selected"}
                    </span>
                  </div>
                </div>

                {avatar && (
                  <button
                    type="button"
                    onClick={() => setAvatar("")}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                  >
                    Remove Picture
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Full Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <input
                  value={email}
                  readOnly
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Pharmacy Name
                </label>
                <input
                  value={pharmacy}
                  onChange={(e) => setPharmacy(e.target.value)}
                  className={inputClass}
                />
                {errors.pharmacy && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.pharmacy}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <button
                type="button"
                onClick={saveProfile}
                className="rounded-lg bg-sky-700 px-6 py-3 font-medium text-white transition hover:bg-sky-800"
              >
                Save Changes
              </button>

              {profileMessage && (
                <p className="text-sm text-emerald-600">{profileMessage}</p>
              )}
            </div>
          </div>

          {/* Change Password */}
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-semibold text-slate-900">
              Change Password
            </h2>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={inputClass}
                />
                {errors.currentPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.currentPassword}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={inputClass}
                />
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.newPassword}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className={inputClass}
                />
                {errors.confirmNewPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.confirmNewPassword}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <button
                type="button"
                onClick={changePassword}
                className="rounded-lg bg-sky-700 px-6 py-3 font-medium text-white transition hover:bg-sky-800"
              >
                Update Password
              </button>

              {passwordMessage && (
                <p className="text-sm text-emerald-600">{passwordMessage}</p>
              )}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="rounded-2xl border border-red-200 bg-white p-8 shadow-sm">
            <h2 className="mb-3 text-2xl font-semibold text-red-600">
              Danger Zone
            </h2>
            <p className="mb-6 text-slate-600">
              Closing your account will remove your prototype account data from
              this browser.
            </p>

            <button
              type="button"
              onClick={deleteAccount}
              className="rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition hover:bg-red-700"
            >
              Close Account
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}