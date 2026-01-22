"use client";

import {
  X,
  Calendar,
  MapPin,
  User,
  Tag,
  Users,
  Edit2,
  ClipboardList,
} from "lucide-react";

interface EventDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  event: any;
}

export default function EventDetailDialog({
  isOpen,
  onClose,
  onEdit,
  event,
}: EventDetailDialogProps) {
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 font-sans">
      <div className="bg-bg-primary rounded-[2.5rem] w-full max-w-2xl border border-border-color shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-8 border-b border-border-color flex justify-between items-center bg-bg-secondary/30">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">
              {event.name}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                  event.status === "UPCOMING"
                    ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600"
                    : event.status === "COMPLETED"
                      ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600"
                      : "bg-bg-tertiary text-text-muted"
                }`}
              >
                {event.status}
              </span>
              <span className="text-xs font-bold text-text-muted uppercase tracking-widest">
                {event.type}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-bg-secondary rounded-xl transition-colors text-text-muted hover:text-text-primary"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">
                    Date & Time
                  </p>
                  <p className="text-sm font-bold text-text-primary">
                    {new Date(event.date).toLocaleDateString(undefined, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  {event.time && (
                    <p className="text-sm font-medium text-text-secondary mt-0.5 uppercase">
                      {event.time}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">
                    Venue
                  </p>
                  <p className="text-sm font-bold text-text-primary">
                    {event.location}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">
                    Customer
                  </p>
                  <p className="text-sm font-bold text-text-primary">
                    {event.customer?.name || event.customer || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-500">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">
                    Guest Count
                  </p>
                  <p className="text-sm font-bold text-text-primary">
                    {event.guestCount || "TBD"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Summary (if available) */}
          {Boolean(event.perPlateCost || event.taxRate || event.discount) && (
            <div className="p-6 bg-bg-secondary/30 rounded-3xl border border-border-color">
              <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
                <Tag className="h-4 w-4 text-amber-500" />
                Pricing Details
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {event.perPlateCost && (
                  <div>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                      Per Plate
                    </p>
                    <p className="text-sm font-bold text-text-primary">
                      ₹{event.perPlateCost}
                    </p>
                  </div>
                )}
                {event.taxRate > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                      Tax
                    </p>
                    <p className="text-sm font-bold text-text-primary">
                      {event.taxRate}%
                    </p>
                  </div>
                )}
                {event.discount > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest text-red-500">
                      Discount
                    </p>
                    <p className="text-sm font-bold text-red-500">
                      ₹{event.discount}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Menu Selection */}
          {event.menuItems && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-amber-500" />
                Menu Selection
              </h3>
              <div className="p-6 bg-bg-secondary/50 rounded-3xl border border-border-color text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                {event.menuItems}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-8 border-t border-border-color bg-bg-secondary/10 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-4 rounded-2xl font-bold bg-bg-secondary text-text-secondary hover:bg-bg-tertiary transition-all"
          >
            Close
          </button>
          <button
            onClick={onEdit}
            className="flex-1 px-6 py-4 rounded-2xl font-bold bg-amber-500 text-white hover:bg-amber-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
          >
            <Edit2 className="h-5 w-5" />
            Edit Event
          </button>
        </div>
      </div>
    </div>
  );
}
