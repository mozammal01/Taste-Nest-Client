"use client";
import { useSession } from "@/lib/auth-client";
import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Loader2, User, Mail, Calendar, Trash2, Edit2, Check, X } from "lucide-react";
import { toast } from "sonner";
import { updateMyProfile } from "@/lib/actions/user";


export default function ProfilePage() {
  const { data: session, isPending: isSessionPending } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
  });

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading("Uploading your new profile picture...");

    try {
      const uploadData = new FormData();
      uploadData.append("image", file);
      
      const result = await updateMyProfile(uploadData);
      
      if (result.success) {
        toast.success("Profile picture updated!", { id: toastId });
        // Full reload to ensure session and UI are in sync
        window.location.reload();
      } else {
        toast.error(result.message, { id: toastId });
      }
    } catch {
      toast.error("An unexpected error occurred", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (formData.name === session?.user?.name) {
      setIsEditing(false);
      return;
    }

    const toastId = toast.loading("Updating your name...");
    try {
      const uploadData = new FormData();
      uploadData.append("data", JSON.stringify({ name: formData.name }));
      
      const result = await updateMyProfile(uploadData);
      
      if (result.success) {
        toast.success("Name updated successfully!", { id: toastId });
        setIsEditing(false);
        window.location.reload();
      } else {
        toast.error(result.message, { id: toastId });
      }
    } catch {
      toast.error("An unexpected error occurred", { id: toastId });
    }
  };

  if (isSessionPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-white py-12 md:py-20 lg:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden"
        >
          {/* Hero Header */}
          <div className="relative bg-linear-to-r from-primary via-primary/95 to-primary/80 px-8 py-14 overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl " />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full -ml-24 -mb-24 blur-3xl" />
            
            <div className="relative flex flex-col md:flex-row items-center gap-10">
              <div className="group relative">
                <div className={`w-32 h-32 rounded-[38px] overflow-hidden border-4 border-white/30 shadow-2xl transition-all duration-500 ${isUploading ? 'opacity-50 blur-[2px]' : 'group-hover:border-white/50'}`}>
                  {session?.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "Profile"}
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/90 flex items-center justify-center text-5xl font-black text-primary">
                      {session?.user?.name?.charAt(0) || "U"}
                    </div>
                  )}
                </div>

                {/* Camera Overlay */}
                <button 
                  onClick={handleFileClick}
                  disabled={isUploading}
                  className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-[38px] backdrop-blur-[2px]"
                >
                  <Camera className="w-8 h-8 text-white animate-pulse" />
                </button>

                {/* Upload Spinner */}
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-white animate-spin" />
                  </div>
                )}
                
                {/* Hidden Input */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>

              <div className="text-center md:text-left flex-1">
                <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                  <h1 className="text-4xl font-black text-white tracking-tight">
                    {session?.user?.name || "Member"}
                  </h1>
                  <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/10">
                    Verified Account
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-center md:justify-start gap-2 text-white/70">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm font-medium">{session?.user?.email}</span>
                  </div>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-xl ${isEditing ? 'bg-white text-primary shadow-white/20' : 'bg-primary/20 backdrop-blur-xl text-white border border-white/20 hover:bg-white/30'}`}
              >
                {isEditing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                {isEditing ? "Cancel Edit" : "Edit Profile"}
              </motion.button>
            </div>
          </div>

          {/* Detailed Content */}
          <div className="p-10 md:p-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="space-y-12">
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-black text-gray-900 font-outfit uppercase tracking-wider">Identity Details</h2>
                  </div>
                  
                  <div className="space-y-8">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Full Name</label>
                      {isEditing ? (
                        <div className="relative group">
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-[24px] focus:bg-white focus:border-primary/20 outline-none transition-all font-medium text-gray-900"
                            placeholder="Your full name"
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] font-bold">press enter to save</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <p className="text-xl font-bold text-gray-800">{session?.user?.name || "Not set"}</p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Verified Email</label>
                      <div className="flex items-center gap-3 py-1">
                        <p className="text-lg font-medium text-gray-600">{session?.user?.email}</p>
                        <div className="w-5 h-5 bg-green-50 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-green-500" strokeWidth={3} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-12">
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-secondary" />
                    </div>
                    <h2 className="text-xl font-black text-gray-900 font-outfit uppercase tracking-wider">Account History</h2>
                  </div>

                  <div className="space-y-8">
                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[32px] border border-gray-100">
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Membership</label>
                        <p className="text-lg font-bold text-gray-800">Elite Member</p>
                      </div>
                      <div className="text-right">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Joined</label>
                        <p className="text-lg font-bold text-gray-800">Jan 2026</p>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isEditing && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: 10 }}
                          className="pt-4"
                        >
                          <button
                            onClick={handleSave}
                            className="w-full h-16 bg-primary text-white rounded-[24px] font-black text-lg shadow-2xl shadow-primary/30 hover:bg-primary/95 hover:shadow-primary/40 transition-all flex items-center justify-center gap-3 tracking-tight group"
                          >
                            <span>Commit Changes</span>
                            <Check className="w-5 h-5 group-hover:scale-125 transition-transform" />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Professional Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 bg-white/50 backdrop-blur-md rounded-[40px] border border-red-100 overflow-hidden"
        >
          <div className="p-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                <Trash2 className="w-5 h-5 text-red-500" />
                <h3 className="text-lg font-black text-red-600 font-outfit uppercase tracking-wider">Account Deletion</h3>
              </div>
              <p className="text-gray-500 font-medium">Permanent data removal. This process is immediate and irreversible.</p>
            </div>
            <button className="px-8 py-4 bg-red-50 text-red-600 rounded-[24px] hover:bg-red-500 hover:text-white transition-all duration-300 font-bold text-sm border border-red-100 hover:border-red-500 shadow-sm hover:shadow-red-200">
              Destroy Account
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
