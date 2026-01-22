"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  Calendar,
  Users,
  MessageSquare,
  CheckCircle,
  Clock,
  Trash2,
  FileText,
  Loader2,
  Search,
  Filter,
  Download,
  Share2,
} from "lucide-react";
import EventDialog from "@/components/admin/EventDialog";
import { generateQuotePDF } from "@/lib/utils/generateQuotePDF";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  eventType: string;
  guestCount: number | null;
  eventDate: string | null;
  venueLocation: string | null;
  message: string | null;
  status: string;
  createdAt: string;
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetchInquiries();
    fetchSettings();
  }, []);

  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/contact");
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      }
    } catch (error) {
      console.error("Failed to fetch inquiries", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (error) {
      console.error("Failed to fetch settings", error);
    }
  };

  const handleDownloadQuote = (inquiry: Inquiry) => {
    if (!settings) {
      alert("Settings not loaded yet. Please try again.");
      return;
    }

    // Create a mock event object for the PDF generator
    const eventData = {
      name: `${inquiry.eventType} - ${inquiry.name}`,
      date: inquiry.eventDate || new Date().toISOString(),
      location: inquiry.venueLocation || "TBD",
      type: inquiry.eventType,
      guestCount: inquiry.guestCount,
      perPlateCost: null, // Lead doesn't have pricing yet
      taxRate: 0,
      discount: 0,
      menuItems: inquiry.message?.startsWith("Plan Menu Selection:")
        ? inquiry.message
            .split("Plan Menu Selection:\n")[1]
            .split("\n\nTotal Estimated Price:")[0]
        : inquiry.message,
      customer: {
        name: inquiry.name,
        phone: inquiry.phone,
        email: inquiry.email,
      },
    };

    const doc = generateQuotePDF(eventData as any, settings);
    doc.save(`Quotation_${inquiry.name.replace(/\s+/g, "_")}.pdf`);
  };

  const handleShareQuote = async (inquiry: Inquiry) => {
    const message = `*Draft Quotation from ${settings?.companyName || "Catering Team"}*\n\nHello ${inquiry.name},\n\nThank you for your inquiry. Aapke event ke liye draft quotation PDF format me niche share kiya gaya hai.\n\n*Event Date:* ${inquiry.eventDate ? new Date(inquiry.eventDate).toLocaleDateString() : "TBD"}\n*Guests:* ${inquiry.guestCount || "TBD"}\n\nPlease check the attached PDF for more menu details.`;

    if (!settings) return;

    // Create a mock event object for the PDF generator
    // Check if we can share files (reliably mobile)
    const canShareFiles =
      typeof navigator !== "undefined" &&
      !!navigator.share &&
      !!navigator.canShare &&
      navigator.canShare({
        files: [new File([], "test.pdf", { type: "application/pdf" })],
      });

    if (
      canShareFiles &&
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    ) {
      try {
        const eventData = {
          name: `${inquiry.eventType} - ${inquiry.name}`,
          date: inquiry.eventDate || new Date().toISOString(),
          location: inquiry.venueLocation || "TBD",
          type: inquiry.eventType,
          guestCount: inquiry.guestCount,
          perPlateCost: null,
          taxRate: 0,
          discount: 0,
          menuItems: inquiry.message?.startsWith("Plan Menu Selection:")
            ? inquiry.message
                .split("Plan Menu Selection:\n")[1]
                .split("\n\nTotal Estimated Price:")[0]
            : inquiry.message,
          customer: {
            name: inquiry.name,
            phone: inquiry.phone,
            email: inquiry.email,
          },
        };
        const doc = generateQuotePDF(eventData as any, settings);
        const pdfBlob = doc.output("blob");
        const fileName = `Quotation_${inquiry.name.replace(/\s+/g, "_")}.pdf`;
        const file = new File([pdfBlob], fileName, { type: "application/pdf" });

        await navigator.share({
          files: [file],
          title: "Quotation Inquiry PDF",
          text: message,
        });
        return;
      } catch (error) {
        console.error("Error sharing PDF:", error);
      }
    }

    // Laptop Fallback: Pehale jese (Just Text Redirection)
    const encodedMessage = encodeURIComponent(message);
    window.open(
      `https://wa.me/${inquiry.phone.replace(/\D/g, "")}?text=${encodedMessage}`,
      "_blank",
    );
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      // Note: We'll need to create this API route or update api/contact
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchInquiries();
      }
    } catch (error) {
      console.error("Failed to update inquiry status", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchInquiries();
      }
    } catch (error) {
      console.error("Failed to delete inquiry", error);
    }
  };

  const handleConvertToQuote = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setIsEventDialogOpen(true);
  };

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch =
      inquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.phone.includes(searchQuery) ||
      inquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.eventType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inquiry.eventDate &&
        new Date(inquiry.eventDate).toLocaleDateString().includes(searchQuery));
    const matchesStatus =
      statusFilter === "ALL" || inquiry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            Customer Inquiries
          </h1>
          <p className="text-text-secondary">
            Manage your leads and convert them into quotations.
          </p>
        </div>
      </div>

      <div className="bg-bg-primary rounded-[2.5rem] border border-border-color shadow-sm overflow-hidden">
        <div className="p-8 border-b border-border-color flex flex-col md:flex-row gap-4 items-center justify-between bg-bg-secondary/30">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
            <input
              type="text"
              placeholder="Search by name, phone, email, event type, or date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-bg-primary border border-border-color focus:border-amber-500 focus:outline-none transition-all text-text-primary"
            />
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Filter className="h-5 w-5 text-text-muted" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 rounded-xl bg-bg-primary border border-border-color text-text-primary focus:border-amber-500 outline-none transition-all font-bold text-sm"
            >
              <option value="ALL">All Status</option>
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="CONVERTED">Converted</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-text-muted text-[10px] font-bold border-b border-border-color tracking-widest px-8">
                  <th className="p-8 uppercase">Customer</th>
                  <th className="py-8 uppercase">Event Details</th>
                  <th className="py-8 uppercase">Requirements</th>
                  <th className="py-8 uppercase">Status</th>
                  <th className="p-8 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color">
                {filteredInquiries.length > 0 ? (
                  filteredInquiries.map((inquiry) => (
                    <tr
                      key={inquiry.id}
                      className="group hover:bg-bg-secondary transition-colors"
                    >
                      <td className="p-8">
                        <div>
                          <p className="font-bold text-lg text-text-primary">
                            {inquiry.name}
                          </p>
                          <div className="flex flex-col gap-1 mt-2">
                            <a
                              href={`tel:${inquiry.phone}`}
                              className="flex items-center gap-2 text-sm text-text-secondary hover:text-amber-500 transition-colors"
                            >
                              <Phone className="h-3 w-3" />
                              {inquiry.phone}
                            </a>
                            <a
                              href={`mailto:${inquiry.email}`}
                              className="flex items-center gap-2 text-sm text-text-secondary hover:text-amber-500 transition-colors"
                            >
                              <Mail className="h-3 w-3" />
                              {inquiry.email}
                            </a>
                          </div>
                        </div>
                      </td>
                      <td className="py-8">
                        <div className="space-y-2">
                          <p className="font-bold text-text-primary">
                            {inquiry.eventType}
                          </p>
                          <div className="flex flex-col gap-1">
                            {inquiry.eventDate && (
                              <div className="flex items-center gap-2 text-xs text-text-secondary font-medium">
                                <Calendar className="h-3 w-3" />
                                {new Date(
                                  inquiry.eventDate,
                                ).toLocaleDateString()}
                              </div>
                            )}
                            {inquiry.guestCount && (
                              <div className="flex items-center gap-2 text-xs text-text-secondary font-medium">
                                <Users className="h-3 w-3" />
                                {inquiry.guestCount} Guests
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-8 max-w-xs">
                        <div className="flex gap-2">
                          <MessageSquare className="h-4 w-4 text-amber-500 shrink-0 mt-1" />
                          <p className="text-sm text-text-secondary line-clamp-3">
                            {inquiry.message ||
                              "No specific requirements mentioned."}
                          </p>
                        </div>
                      </td>
                      <td className="py-8">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                            inquiry.status === "NEW"
                              ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600"
                              : inquiry.status === "CONTACTED"
                                ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600"
                                : inquiry.status === "CONVERTED"
                                  ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600"
                                  : "bg-bg-tertiary text-text-muted"
                          }`}
                        >
                          {inquiry.status}
                        </span>
                      </td>
                      <td className="p-8">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleDownloadQuote(inquiry)}
                            className="p-2 bg-bg-tertiary text-text-secondary rounded-xl hover:bg-bg-tertiary/80 transition-all"
                            title="Download Draft Quote"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleShareQuote(inquiry)}
                            className="p-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all"
                            title="Share via WhatsApp"
                          >
                            <Share2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleConvertToQuote(inquiry)}
                            className="bg-amber-500 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-amber-600 transition-all flex items-center gap-2 shadow-sm"
                            title="Convert to Quotation"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            Quote
                          </button>
                          {inquiry.status === "NEW" && (
                            <button
                              onClick={() =>
                                handleStatusChange(inquiry.id, "CONTACTED")
                              }
                              className="p-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all"
                              title="Mark as Contacted"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(inquiry.id)}
                            className="p-2 bg-red-50 dark:bg-red-500/10 text-red-600 rounded-xl hover:bg-red-100 transition-all"
                            title="Delete Inquiry"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <div className="flex flex-col items-center">
                        <MessageSquare className="h-12 w-12 text-text-muted mb-4 opacity-20" />
                        <h3 className="text-text-primary font-bold">
                          No inquiries found
                        </h3>
                        <p className="text-text-muted text-sm">
                          New leads will appear here when customers contact you.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <EventDialog
        isOpen={isEventDialogOpen}
        onClose={() => {
          setIsEventDialogOpen(false);
          setSelectedInquiry(null);
        }}
        onSuccess={() => {
          if (selectedInquiry) {
            handleStatusChange(selectedInquiry.id, "CONVERTED");
          }
          fetchInquiries();
        }}
        // Pre-populate EventDialog with inquiry data
        initialData={
          selectedInquiry
            ? {
                name: `${selectedInquiry.eventType} - ${selectedInquiry.name}`,
                date: selectedInquiry.eventDate || "",
                type: selectedInquiry.eventType,
                location: selectedInquiry.venueLocation || "",
                guestCount: selectedInquiry.guestCount,
                menuItems: selectedInquiry.message?.startsWith(
                  "Plan Menu Selection:",
                )
                  ? selectedInquiry.message
                      .split("Plan Menu Selection:\n")[1]
                      .split("\n\nTotal Estimated Price:")[0]
                  : "",
                isQuote: true,
                status: "QUOTATION",
              }
            : null
        }
      />
    </div>
  );
}
