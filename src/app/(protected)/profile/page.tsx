"use client";

import { useSession } from "@/lib/auth-client";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
  });

  const handleSave = async () => {
    // TODO: connect this to user profile update endpoint
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-white py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-linear-to-r from-primary to-primary/80 px-6 py-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "Profile"}
                    width={80}
                    height={80}
                    className="rounded-full border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-3xl font-bold text-primary border-4 border-white shadow-lg">
                    {session?.user?.name?.charAt(0) || "U"}
                  </div>
                )}
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold">{session?.user?.name || "User"}</h1>
                <p className="text-white/80">{session?.user?.email}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
              <button onClick={() => setIsEditing(!isEditing)} className="text-primary hover:text-primary/80 font-medium text-sm">
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                ) : (
                  <p className="text-gray-900 py-3">{session?.user?.name || "Not set"}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <p className="text-gray-900 py-3">{session?.user?.email}</p>
                <p className="text-xs text-gray-500">Email cannot be changed</p>
              </div>

              {/* Member Since */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                <p className="text-gray-900 py-3">January 2026</p>
              </div>

              {isEditing && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-4">
                  <button
                    onClick={handleSave}
                    className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Save Changes
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden"
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Danger Zone</h2>
            <p className="text-gray-600 text-sm mb-4">Once you delete your account, there is no going back. Please be certain.</p>
            <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium">
              Delete Account
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
