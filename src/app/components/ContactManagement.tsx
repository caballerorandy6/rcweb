"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { getContactsAction } from "@/actions/getContactsAction";
import { createContactAction } from "@/actions/createContactAction";
import { deleteContactAction } from "@/actions/deleteContactAction";
import { updateContactAction } from "@/actions/updateContactAction";

type Contact = {
  id: string;
  name: string;
  marketingConsent: boolean;
  createdAt: Date;
  updatedAt: Date;
  emails: { id: string; email: string }[];
  phones: { id: string; phone: string }[];
};

type ContactManagementProps = {
  initialContacts: Contact[];
};

export default function ContactManagement({
  initialContacts,
}: ContactManagementProps) {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    marketingConsent: false,
  });

  const loadContacts = async () => {
    const result = await getContactsAction();
    if (result.success) {
      setContacts(result.contacts || []);
    } else {
      toast.error("Failed to load contacts");
    }
  };

  const handleCreateContact = () => {
    if (!formData.name) {
      toast.error("Name is required");
      return;
    }

    startTransition(async () => {
      const result = await createContactAction(formData);
      if (result.success) {
        toast.success("Contact created successfully");
        setShowAddModal(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          marketingConsent: false,
        });
        loadContacts();
      } else {
        toast.error(
          Object.values(result.errors || {})
            .flat()
            .join(", ") ||
            result.message ||
            "Failed to create contact"
        );
      }
    });
  };

  const handleUpdateContact = (contact: Contact) => {
    startTransition(async () => {
      const result = await updateContactAction(contact.id, {
        name: contact.name,
        marketingConsent: contact.marketingConsent,
      });
      if (result.success) {
        toast.success("Contact updated");
        setEditingContact(null);
        loadContacts();
      } else {
        toast.error("Failed to update contact");
      }
    });
  };

  const handleDeleteContact = (id: string) => {
    if (!confirm("Are you sure you want to delete this contact?")) return;

    startTransition(async () => {
      const result = await deleteContactAction(id);
      if (result.success) {
        toast.success("Contact deleted");
        loadContacts();
      } else {
        toast.error("Failed to delete contact");
      }
    });
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.emails.some((e) => e.email.includes(searchTerm)) ||
      contact.phones.some((p) => p.phone.includes(searchTerm))
  );

  return (
    <div className="min-h-screen bg-gray-900 py-24 lg:py-32 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gold font-iceland">
            Contact Management
          </h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gold text-gray-900 px-4 py-2 rounded-lg font-semibold font-inter hover:bg-gold/90"
          >
            + Add Contact
          </button>
        </div>

        {/* Search */}
        <div className="mb-6 font-inter">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-96 p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-gold focus:outline-none"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 font-inter">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-400 text-sm mb-1">Total Contacts</h3>
            <p className="text-2xl font-bold text-white">{contacts.length}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-400 text-sm mb-1">
              With Marketing Consent
            </h3>
            <p className="text-2xl font-bold text-green-500">
              {contacts.filter((c) => c.marketingConsent).length}
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-400 text-sm mb-1">Total Emails</h3>
            <p className="text-2xl font-bold text-blue-500">
              {contacts.reduce((acc, c) => acc + c.emails.length, 0)}
            </p>
          </div>
        </div>

        {/* Contacts Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden font-inter">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-700 text-left">
                  <th className="px-6 py-3 text-sm font-medium text-gray-300">
                    Name
                  </th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-300">
                    Emails
                  </th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-300">
                    Phones
                  </th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-300">
                    Marketing
                  </th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-300">
                    Created
                  </th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-750">
                    {/* Name */}
                    <td className="px-6 py-4">
                      {editingContact?.id === contact.id ? (
                        <input
                          type="text"
                          value={editingContact.name}
                          onChange={(e) =>
                            setEditingContact({
                              ...editingContact,
                              name: e.target.value,
                            })
                          }
                          className="bg-gray-700 text-white px-2 py-1 rounded"
                        />
                      ) : (
                        <span className="text-white font-medium">
                          {contact.name}
                        </span>
                      )}
                    </td>

                    {/* Emails */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {contact.emails.map((email) => (
                          <div
                            key={email.id}
                            className="flex items-center group text-sm text-gray-300"
                          >
                            <span>{email.email}</span>
                            {contact.marketingConsent && (
                              <a
                                href={`/unsubscribe?email=${encodeURIComponent(email.email)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Unsubscribe this email"
                              >
                                <svg
                                  className="w-4 h-4 text-red-400 hover:text-red-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                                  />
                                </svg>
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Phones */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {contact.phones.map((phone) => (
                          <div key={phone.id} className="text-sm text-gray-300">
                            {phone.phone}
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Marketing */}
                    <td className="px-6 py-4">
                      {editingContact?.id === contact.id ? (
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingContact.marketingConsent}
                            onChange={(e) =>
                              setEditingContact({
                                ...editingContact,
                                marketingConsent: e.target.checked,
                              })
                            }
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-300">
                            {editingContact.marketingConsent ? "Yes" : "No"}
                          </span>
                        </label>
                      ) : (
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            contact.marketingConsent
                              ? "bg-green-500/20 text-green-500"
                              : "bg-gray-500/20 text-gray-500"
                          }`}
                        >
                          {contact.marketingConsent ? "Yes" : "No"}
                        </span>
                      )}
                    </td>

                    {/* Created */}
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {editingContact?.id === contact.id ? (
                          <>
                            <button
                              onClick={() =>
                                handleUpdateContact(editingContact)
                              }
                              className="text-green-500 hover:text-green-400"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingContact(null)}
                              className="text-gray-500 hover:text-gray-400"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => setEditingContact(contact)}
                              className="text-blue-500 hover:text-blue-400"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteContact(contact.id)}
                              className="text-red-500 hover:text-red-400"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Contact Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold text-gold mb-4 font-iceland">
                Add New Contact
              </h2>

              <div className="space-y-4 font-inter">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.marketingConsent}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        marketingConsent: e.target.checked,
                      })
                    }
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-300">
                    Marketing consent
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCreateContact}
                  disabled={isPending}
                  className="flex-1 bg-gold text-gray-900 py-2 rounded font-semibold hover:bg-gold/90 disabled:opacity-50 font-inter"
                >
                  {isPending ? "Creating..." : "Create Contact"}
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({
                      name: "",
                      email: "",
                      phone: "",
                      marketingConsent: false,
                    });
                  }}
                  className="flex-1 bg-gray-700 text-white py-2 rounded hover:bg-gray-600 font-inter"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
