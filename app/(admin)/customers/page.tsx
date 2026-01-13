"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Mail,
  Phone,
  Loader2,
} from "lucide-react";
import CustomerDialog from "@/components/admin/CustomerDialog";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import CustomerEventsDialog from "@/components/admin/CustomerEventsDialog";
import EventDialog from "@/components/admin/EventDialog";

interface Customer {
  id: string;
  name: string;
  email?: string | null;
  phone: string;
  address?: string | null;
  _count?: {
    events: number;
  };
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    customer: Customer | null;
  }>({ isOpen: false, customer: null });

  // Event viewing state
  const [selectedCustomerForEvents, setSelectedCustomerForEvents] =
    useState<Customer | null>(null);
  const [isEventsDialogOpen, setIsEventsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null); // Using any for simplicity matching EventDialog props
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);

  // Fetch all customers from the API to populate the table
  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/customers");
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch (error) {
      console.error("Failed to fetch customers", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setIsDialogOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsDialogOpen(true);
  };

  // Delete a customer and refresh the list
  const handleDeleteCustomer = async () => {
    if (!deleteDialog.customer) return;

    const res = await fetch(`/api/customers/${deleteDialog.customer.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      await fetchCustomers();
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            Customer Management
          </h1>
          <p className="text-text-secondary">
            View and manage your loyal customers and their history.
          </p>
        </div>
        <button
          onClick={handleAddCustomer}
          className="bg-amber-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-amber-600 transition-all shadow-lg shadow-amber-200 dark:shadow-amber-500/20 active:scale-95"
        >
          <Plus className="h-5 w-5" />
          Add Customer
        </button>
      </div>

      <div className="bg-bg-primary rounded-[2.5rem] border border-border-color shadow-sm overflow-hidden">
        <div className="p-8 border-b border-border-color flex items-center gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-bg-secondary border border-transparent focus:bg-bg-primary focus:border-amber-500 focus:outline-none transition-all text-text-primary"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-text-muted text-sm font-bold border-b border-border-color">
                  <th className="px-8 py-5">CUSTOMER</th>
                  <th className="px-8 py-5">CONTACT</th>
                  <th className="px-8 py-5">ADDRESS</th>
                  <th className="px-8 py-5">EVENTS</th>
                  <th className="px-8 py-5 text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color">
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="group hover:bg-bg-secondary transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-bg-secondary flex items-center justify-center text-text-secondary font-bold overflow-hidden">
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-text-primary uppercase tracking-tight">
                            {customer.name}
                          </p>
                          <p className="text-xs text-text-muted">
                            ID: {customer.id.slice(0, 8)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-text-secondary font-medium">
                          <Mail className="h-3.5 w-3.5 text-amber-500" />
                          {customer.email || "N/A"}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-text-secondary font-medium">
                          <Phone className="h-3.5 w-3.5 text-amber-500" />
                          {customer.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm text-text-secondary font-medium">
                      {customer.address || "N/A"}
                    </td>
                    <td className="px-8 py-6">
                      <button
                        onClick={() => {
                          setSelectedCustomerForEvents(customer);
                          setIsEventsDialogOpen(true);
                        }}
                        className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors cursor-pointer underline decoration-emerald-600/30 underline-offset-2"
                      >
                        {customer._count?.events || 0} events
                      </button>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditCustomer(customer)}
                          className="p-2 hover:bg-amber-50 dark:hover:bg-amber-500/10 text-amber-600 rounded-xl transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteDialog({ isOpen: true, customer })
                          }
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 rounded-xl transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && filteredCustomers.length === 0 && (
          <div className="py-20 text-center">
            <h3 className="text-text-primary font-bold mb-1">
              No customers found
            </h3>
            <p className="text-text-muted">
              {searchQuery
                ? "Try a different search term."
                : "Add your first customer to get started."}
            </p>
          </div>
        )}
      </div>

      <CustomerDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={fetchCustomers}
        customer={editingCustomer}
      />

      <DeleteConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, customer: null })}
        onConfirm={handleDeleteCustomer}
        title="Delete Customer?"
        message={`Are you sure you want to delete ${deleteDialog.customer?.name}? This action cannot be undone.`}
      />

      <CustomerEventsDialog
        isOpen={isEventsDialogOpen}
        onClose={() => setIsEventsDialogOpen(false)}
        customerId={selectedCustomerForEvents?.id || null}
        customerName={selectedCustomerForEvents?.name || ""}
        onEventClick={(event) => {
          setSelectedEvent(event);
          setIsEventDialogOpen(true);
          // Optional: close events list or keep it open. Keeping open allows back navigation naturally by closing the top modal.
        }}
      />

      <EventDialog
        isOpen={isEventDialogOpen}
        onClose={() => setIsEventDialogOpen(false)}
        onSuccess={() => {
          // If we edit an event, we might want to refresh the customers list to update counts if needed,
          // but technically the count won't change on edit.
          // However, if we utilize this dialog for creating events in future from here, we'd need refresh.
          // For now, just close.
          fetchCustomers();
        }}
        event={selectedEvent}
      />
    </div>
  );
}
