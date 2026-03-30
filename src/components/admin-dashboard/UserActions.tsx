"use client";

import { useState, useTransition } from "react";
import { Edit2, Trash2, Loader2, Check, X, ShieldAlert, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { deleteUser, updateUserRole } from "@/lib/actions/user";

type UserActionsProps = {
  userId: string;
  userName: string;
  currentRole: string;
  token?: string;
};

export default function UserActions({ userId, userName, currentRole }: Omit<UserActionsProps, "token">) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showForceDeleteModal, setShowForceDeleteModal] = useState(false);
  const [newRole, setNewRole] = useState(currentRole);

  const handleDelete = async () => {
    startTransition(async () => {
      const result = await deleteUser(userId, false);
      if (result.success) {
        toast.success(`User "${userName}" deleted successfully`);
        setShowDeleteModal(false);
        router.refresh();
      } else if (result.hasOrders) {
        setShowDeleteModal(false);
        setShowForceDeleteModal(true);
      } else {
        toast.error(result.message || "Failed to delete user");
      }
    });
  };

  const handleForceDelete = async () => {
    startTransition(async () => {
      const result = await deleteUser(userId, true);
      if (result.success) {
        toast.success(`User "${userName}" and all their data deleted successfully`);
        setShowForceDeleteModal(false);
        router.refresh();
      } else {
        toast.error(result.message || "Failed to delete user");
      }
    });
  };

  const handleUpdateRole = async () => {
    if (newRole === currentRole) {
      setIsEditing(false);
      return;
    }
 
    startTransition(async () => {
      const result = await updateUserRole(userId, newRole);
      if (result.success) {
        toast.success(`Role for "${userName}" updated to ${newRole}`);
        setIsEditing(false);
        router.refresh();
      } else {
        toast.error(result.message || "Failed to update role");
      }
    });
  };

  return (
    <>
      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
        {isEditing ? (
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl"
          >
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              disabled={isPending}
              className="bg-transparent text-[11px] font-black uppercase tracking-widest text-slate-700 outline-none px-3 py-1.5 cursor-pointer font-outfit"
            >
              <option value="user">Member</option>
              <option value="admin">Admin</option>
            </select>
            <button
              onClick={handleUpdateRole}
              disabled={isPending}
              className="p-2 bg-primary text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isPending ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} strokeWidth={3} />}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              disabled={isPending}
              className="p-2 bg-white text-slate-400 rounded-lg hover:text-slate-900 transition-all shadow-sm"
            >
              <X size={14} strokeWidth={3} />
            </button>
          </motion.div>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              disabled={isPending}
              className="p-3 bg-white hover:bg-white text-slate-400 hover:text-primary shadow-sm hover:shadow-xl rounded-2xl transition-all border border-slate-100 disabled:opacity-30 group/edit"
              title="Edit User Role"
            >
              <Edit2 size={16} strokeWidth={2.5} className="group-hover/edit:rotate-12 transition-transform" />
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              disabled={isPending}
              className="p-3 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 shadow-sm hover:shadow-xl rounded-2xl transition-all border border-slate-100 disabled:opacity-30 group/del"
              title="Delete User"
            >
              <Trash2 size={16} strokeWidth={2.5} className="group-hover/del:scale-110 transition-transform" />
            </button>
          </>
        )}
      </div>

      {/* Professional Deletion Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isPending && setShowDeleteModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-100 p-8"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-red-50 rounded-[28px] flex items-center justify-center mb-6">
                  <AlertCircle className="w-10 h-10 text-red-500 animate-pulse" />
                </div>
                
                <h3 className="text-2xl font-black text-slate-900 tracking-tight font-outfit mb-2">Delete Account</h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                  Are you absolutely sure you want to remove <span className="text-slate-900 font-black">&quot;{userName}&quot;</span> from the system? This process is irreversible.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 w-full mt-8">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    disabled={isPending}
                    className="flex-1 h-14 rounded-2xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50 font-outfit"
                  >
                    Keep User
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isPending}
                    className="flex-1 h-14 rounded-2xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 shadow-lg shadow-red-500/25 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2 font-outfit"
                  >
                    {isPending ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 size={18} />
                        <span>Confirm Delete</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Security Badge */}
              <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-center gap-2 opacity-40">
                <ShieldAlert size={14} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Administrative Security Protocol</span>
              </div>
            </motion.div>
          </div>
        )}
        
        {showForceDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isPending && setShowForceDeleteModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-100 p-8"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-orange-50 rounded-[28px] flex items-center justify-center mb-6">
                  <AlertCircle className="w-10 h-10 text-orange-500 animate-pulse" />
                </div>
                
                <h3 className="text-2xl font-black text-slate-900 tracking-tight font-outfit mb-2">User Has Orders</h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                  This user already has some orders in the system. Do you still want to delete him? <span className="text-slate-900 font-black">All related orders and data will be permanently removed.</span>
                </p>

                <div className="flex flex-col sm:flex-row gap-3 w-full mt-8">
                  <button
                    onClick={() => setShowForceDeleteModal(false)}
                    disabled={isPending}
                    className="flex-1 h-14 rounded-2xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50 font-outfit"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleForceDelete}
                    disabled={isPending}
                    className="flex-1 h-14 rounded-2xl bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 shadow-lg shadow-orange-500/25 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2 font-outfit"
                  >
                    {isPending ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 size={18} />
                        <span>Yes, Delete All</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Security Badge */}
              <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-center gap-2 opacity-40">
                <ShieldAlert size={14} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Administrative Security Protocol</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
