"use client";

import { useState, useEffect } from "react";
import { X, Loader2, UserPlus, Trash2 } from "lucide-react";

interface Staff {
  id: string;
  name: string;
  role: string;
}

interface AssignedStaff {
  id: string;
  staff: {
    id: string;
    name: string;
    role: string;
  };
}

interface StaffAssignmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventName: string;
}

export default function StaffAssignmentDialog({
  isOpen,
  onClose,
  eventId,
  eventName,
}: StaffAssignmentDialogProps) {
  const [allStaff, setAllStaff] = useState<Staff[]>([]);
  const [assignedStaff, setAssignedStaff] = useState<AssignedStaff[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, eventId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [staffRes, assignedRes] = await Promise.all([
        fetch("/api/staff"),
        fetch(`/api/events/${eventId}/staff`),
      ]);

      if (staffRes.ok) {
        const staffData = await staffRes.json();
        setAllStaff(staffData);
      }

      if (assignedRes.ok) {
        const assignedData = await assignedRes.json();
        setAssignedStaff(assignedData);
      }
    } catch (error) {
      console.error("Failed to fetch staff data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignStaff = async (staffId: string) => {
    setError("");
    try {
      const res = await fetch(`/api/events/${eventId}/staff`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staffId }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      await fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRemoveStaff = async (staffId: string) => {
    setError("");
    try {
      const res = await fetch(
        `/api/events/${eventId}/staff?staffId=${staffId}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok && res.status !== 204) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      await fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const assignedStaffIds = assignedStaff.map((a) => a.staff.id);
  const availableStaff = allStaff.filter(
    (s) => !assignedStaffIds.includes(s.id)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 md:p-10 max-w-3xl w-full border border-gray-100 dark:border-gray-800 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Manage Staff
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {eventName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 text-sm font-medium">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Assigned Staff */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Assigned Staff ({assignedStaff.length})
              </h3>
              {assignedStaff.length > 0 ? (
                <div className="space-y-2">
                  {assignedStaff.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl"
                    >
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">
                          {assignment.staff.name}
                        </p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest">
                          {assignment.staff.role}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveStaff(assignment.staff.id)}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 rounded-xl transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 py-4">
                  No staff assigned yet
                </p>
              )}
            </div>

            {/* Available Staff */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Available Staff ({availableStaff.length})
              </h3>
              {availableStaff.length > 0 ? (
                <div className="space-y-2">
                  {availableStaff.map((staff) => (
                    <div
                      key={staff.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl"
                    >
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">
                          {staff.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">
                          {staff.role}
                        </p>
                      </div>
                      <button
                        onClick={() => handleAssignStaff(staff.id)}
                        className="p-2 hover:bg-amber-50 dark:hover:bg-amber-500/10 text-amber-600 rounded-xl transition-colors"
                      >
                        <UserPlus className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 py-4">
                  All staff members are assigned
                </p>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={onClose}
            className="w-full px-6 py-4 rounded-2xl font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
