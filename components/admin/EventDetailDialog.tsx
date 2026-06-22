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

          {/* Menu Options & Pricing */}
          {(() => {
            let options: any[] = [];
            try {
              const parsed = JSON.parse(event.menuItems || "[]");
              options = parsed.options || (Array.isArray(parsed) ? [{ name: "Menu 1", items: JSON.stringify(parsed) }] : []);
            } catch (e) {
              if (event.menuItems) options = [{ name: "Menu 1", items: event.menuItems }];
            }

            if (options.length === 0) return null;

            return (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <ClipboardList className="h-5 w-5 text-amber-500" />
                  <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest">
                    Proposed Menu Options
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {options.map((option, idx) => {
                    let optionTotal = 0;
                    let items: any[] = [];
                    try {
                      const parsedItems = JSON.parse(option.items);
                      if (Array.isArray(parsedItems)) {
                        items = parsedItems;
                        const base = items.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
                        const guests = event.guestCount || 1;
                        const subtotal = guests > 1 ? base * guests : base;
                        const tax = subtotal * ((event.taxRate || 0) / 100);
                        const disc = event.discount || 0;
                        optionTotal = Math.max(0, subtotal + tax - disc);
                      }
                    } catch (e) {}

                    return (
                      <details key={idx} className="group bg-bg-secondary/30 rounded-3xl border border-border-color overflow-hidden transition-all" open={idx === 0}>
                        <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-bg-secondary/50 transition-colors list-none">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold">
                              {idx + 1}
                            </div>
                            <div>
                              <p className="font-bold text-text-primary">{option.name || `Option ${idx + 1}`}</p>
                              <p className="text-xs text-text-muted">
                                {items.length} items selected
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Final Quote</p>
                            <p className="text-lg font-black text-amber-600 dark:text-amber-500">
                              ₹{optionTotal.toLocaleString('en-IN')}
                            </p>
                          </div>
                        </summary>
                        
                        <div className="px-6 pb-6 pt-2 border-t border-border-color/50">
                          <div className="space-y-4">
                            {items.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {items.map((item: any, i: number) => (
                                  <div key={i} className="flex justify-between items-center p-3 bg-bg-primary/50 rounded-xl border border-border-color/50">
                                    <span className="text-sm font-medium text-text-primary">{item.name} <span className="text-xs text-text-muted ml-1">x{item.quantity}</span></span>
                                    <span className="text-sm font-bold text-text-secondary">₹{item.price * (item.quantity || 1)}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-text-secondary whitespace-pre-wrap">{option.items}</p>
                            )}
                            
                            <div className="mt-4 p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                               <div>
                                 <p className="text-[10px] font-bold text-text-muted">GST</p>
                                 <p className="text-sm font-bold">{event.taxRate}%</p>
                               </div>
                               <div>
                                 <p className="text-[10px] font-bold text-text-muted">DISCOUNT</p>
                                 <p className="text-sm font-bold">₹{event.discount}</p>
                               </div>
                               <div>
                                 <p className="text-[10px] font-bold text-text-muted">GUESTS</p>
                                 <p className="text-sm font-bold">{event.guestCount || 1}</p>
                               </div>
                               <div className="md:border-l border-amber-500/20">
                                 <p className="text-[10px] font-bold text-amber-600">TOTAL</p>
                                 <p className="text-sm font-black text-amber-600">₹{optionTotal.toLocaleString('en-IN')}</p>
                               </div>
                            </div>
                          </div>
                        </div>
                      </details>
                    );
                  })}
                </div>
              </div>
            );
          })()}
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
