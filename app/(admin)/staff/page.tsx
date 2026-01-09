"use client";

import { useState, useEffect } from "react";
import { Plus, UserSquare2, Phone, Edit2, Trash2, Loader2 } from "lucide-react";
import StaffDialog from "@/components/admin/StaffDialog";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";

interface Staff {
  id: string;
  name: string;
  role: string;
  phone: string;
  _count?: {
    events: number;
  };
}

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    staff: Staff | null;
  }>({ isOpen: false, staff: null });

  const fetchStaff = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/staff");
      if (res.ok) {
        const data = await res.json();
        setStaff(data);
      }
    } catch (error) {
      console.error("Failed to fetch staff", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAddStaff = () => {
    setEditingStaff(null);
    setIsDialogOpen(true);
  };

  const handleEditStaff = (staffMember: Staff) => {
    setEditingStaff(staffMember);
    setIsDialogOpen(true);
  };

  const handleDeleteStaff = async () => {
    if (!deleteDialog.staff) return;

    const res = await fetch(`/api/staff/${deleteDialog.staff.id}`, {
      method: "DELETE",
    });

    if (res.ok || res.status === 204) {
      await fetchStaff();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Staff Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your team roles, contact details and assignments.
          </p>
        </div>
        <button
          onClick={handleAddStaff}
          className="bg-amber-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-amber-600 transition-all shadow-lg shadow-amber-200 dark:shadow-amber-500/20 active:scale-95"
        >
          <Plus className="h-5 w-5" />
          Add Staff Member
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map((member) => (
            <div
              key={member.id}
              className="bg-white dark:bg-slate-950 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 rounded-[1.5rem] bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600">
                  <UserSquare2 className="h-8 w-8" />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEditStaff(member)}
                    className="p-2 hover:bg-amber-50 dark:hover:bg-amber-500/10 text-amber-600 rounded-xl transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() =>
                      setDeleteDialog({ isOpen: true, staff: member })
                    }
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 rounded-xl transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                {member.name}
              </h3>
              <p className="text-amber-600 font-bold text-xs uppercase tracking-widest mb-6">
                {member.role}
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="h-4 w-4 text-gray-400" />
                  {member.phone}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-50 dark:border-slate-800">
                <div className="text-xs text-gray-500 dark:text-gray-400 font-bold">
                  {member._count?.events || 0} Events Assigned
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && staff.length === 0 && (
        <div className="py-20 text-center">
          <h3 className="text-gray-900 dark:text-white font-bold mb-1">
            No staff members found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Add your first staff member to get started.
          </p>
        </div>
      )}

      <StaffDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={fetchStaff}
        staff={editingStaff}
      />

      <DeleteConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, staff: null })}
        onConfirm={handleDeleteStaff}
        title="Delete Staff Member?"
        message={`Are you sure you want to delete ${deleteDialog.staff?.name}? This action cannot be undone.`}
      />
    </div>
  );
}
