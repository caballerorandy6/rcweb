"use client";

import { useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import { createContactAction } from "@/actions/contacts/createContactAction";
import { deleteContactAction } from "@/actions/contacts/deleteContactAction";
import { updateContactAction } from "@/actions/contacts/updateContactAction";
import type { ContactWithRelations as Contact } from "@/actions/contacts/getContactsAction";
import type { ContactChannel, LeadStatus } from "@/generated/prisma/enums";
import type { ServiceOption } from "@/components/forms/DialogForm";
import { CONTACT_CHANNELS, CONTACT_CHANNEL_LABELS } from "@/lib/contactChannel";
import { LEAD_STATUSES, LEAD_STATUS_CLASSES, LEAD_STATUS_LABELS } from "@/lib/leadStatus";

type ContactManagementProps = {
  contacts: Contact[];
  /** Offers for the "Interested in" select (id + title only) */
  serviceOptions: ServiceOption[];
  /** Open the "new contact" form on load (dashboard shortcut) */
  openNew: boolean;
};

type NewContactForm = {
  name: string;
  email: string;
  phone: string;
  marketingConsent: boolean;
  service: ServiceOption["id"] | "";
  preferredChannel: ContactChannel | "";
};

type EditingContact = { id: string; name: string; marketingConsent: boolean };

const emptyContact: NewContactForm = {
  name: "",
  email: "",
  phone: "",
  marketingConsent: false,
  service: "",
  preferredChannel: "",
};

// Pipeline stages that still need work (everything before won/lost)
const OPEN_STATUSES = new Set<LeadStatus>(["NEW", "CONTACTED", "INTERESTED", "PROPOSAL_SENT"]);

const ACCENTS = {
  gold: "border-gold/20 hover:border-gold/40 text-white",
  blue: "border-blue-500/20 hover:border-blue-500/40 text-blue-400",
  orange: "border-orange-500/20 hover:border-orange-500/40 text-orange-400",
  green: "border-green-500/20 hover:border-green-500/40 text-green-400",
} as const;

const input =
  "w-full p-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-gold focus:outline-hidden";
const button =
  "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
const neutralButton = `${button} bg-gray-700/40 text-gray-200 border-gray-600 hover:bg-gray-700/70`;
const dangerButton = `${button} bg-red-500/10 text-red-400 border-red-500/40 hover:bg-red-500/20`;

function StatCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: number;
  hint?: string;
  accent: keyof typeof ACCENTS;
}) {
  return (
    <div
      className={`bg-linear-to-br from-gray-800/80 to-gray-900/80 border rounded-xl p-4 sm:p-6 shadow-lg shadow-black/20 transition-colors duration-300 ${ACCENTS[accent]}`}
    >
      <h3 className="text-gray-400 text-xs sm:text-sm mb-2 font-medium">{label}</h3>
      <p className="text-2xl sm:text-3xl font-iceland">{value}</p>
      {hint ? <p className="text-xs text-gray-500 mt-1">{hint}</p> : null}
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={`px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gold uppercase tracking-wider ${className}`}
    >
      {children}
    </th>
  );
}

const percent = (part: number, total: number) =>
  total > 0 ? `${Math.round((part / total) * 100)}%` : "0%";

/**
 * Contacts and their place in the pipeline. The list is server data: after
 * every action the route is refreshed instead of re-fetching from the client.
 */
export default function ContactManagement({ contacts, serviceOptions, openNew }: ContactManagementProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(openNew);
  const [formData, setFormData] = useState<NewContactForm>(emptyContact);
  const [editing, setEditing] = useState<EditingContact | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const serviceTitle = (id: string | null) =>
    serviceOptions.find((option) => option.id === id)?.title ?? null;

  let withConsent = 0;
  let open = 0;
  let won = 0;
  for (const contact of contacts) {
    if (contact.marketingConsent) withConsent++;
    if (OPEN_STATUSES.has(contact.leadStatus)) open++;
    if (contact.leadStatus === "WON") won++;
  }

  const term = searchTerm.trim().toLowerCase();
  const filteredContacts = term
    ? contacts.filter(
        (contact) =>
          contact.name.toLowerCase().includes(term) ||
          contact.emails.some((e) => e.email.toLowerCase().includes(term)) ||
          contact.phones.some((p) => p.phone.includes(term))
      )
    : contacts;

  const handleCreateContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(async () => {
      const result = await createContactAction(
        { ...formData, preferredChannel: formData.preferredChannel || undefined },
        undefined,
        undefined,
        "manual"
      );
      if (result.success) {
        toast.success("Contact saved");
        setShowForm(false);
        setFormData(emptyContact);
        router.refresh();
      } else {
        toast.error(
          Object.values(result.errors).flat().join(", ") || result.message || "Failed to save contact"
        );
      }
    });
  };

  const handleUpdateContact = (contact: EditingContact) => {
    startTransition(async () => {
      const result = await updateContactAction(contact.id, {
        name: contact.name,
        marketingConsent: contact.marketingConsent,
      });
      if (result.success) {
        toast.success("Contact updated");
        setEditing(null);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  };

  const handleLeadStatus = (contact: Contact, leadStatus: LeadStatus) => {
    startTransition(async () => {
      const result = await updateContactAction(contact.id, { leadStatus });
      if (result.success) {
        toast.success(`${contact.name}: ${LEAD_STATUS_LABELS[leadStatus]}`);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  };

  const handleDeleteContact = (id: string) => {
    startTransition(async () => {
      const result = await deleteContactAction(id);
      if (result.success) {
        toast.success("Contact deleted");
        setConfirmDeleteId(null);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 font-inter">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl text-gold font-iceland mb-2">Contacts</h1>
          <p className="text-base sm:text-lg text-gray-400">
            Every lead from the site, campaigns or added by hand, with where they are in the pipeline.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((value) => !value)}
          aria-expanded={showForm}
          aria-controls="new-contact"
          className="bg-gold text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-gold/90 transition-colors whitespace-nowrap"
        >
          {showForm ? "Close form" : "+ Add Contact"}
        </button>
      </div>

      {showForm ? (
        <section
          id="new-contact"
          aria-labelledby="new-contact-title"
          className="bg-linear-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/50 rounded-xl p-5 sm:p-6 shadow-xl shadow-black/20"
        >
          <h2 id="new-contact-title" className="text-xl text-gold font-iceland mb-4">
            New contact
          </h2>
          <form onSubmit={handleCreateContact} className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="new-contact-name" className="block text-sm text-gray-300 mb-1">
                Name
              </label>
              <input
                id="new-contact-name"
                type="text"
                required
                minLength={2}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="new-contact-email" className="block text-sm text-gray-300 mb-1">
                Email
              </label>
              <input
                id="new-contact-email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="new-contact-phone" className="block text-sm text-gray-300 mb-1">
                Phone
              </label>
              <input
                id="new-contact-phone"
                type="tel"
                required
                minLength={10}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="new-contact-service" className="block text-sm text-gray-300 mb-1">
                Interested in
              </label>
              <select
                id="new-contact-service"
                value={formData.service}
                onChange={(e) =>
                  setFormData({ ...formData, service: e.target.value as NewContactForm["service"] })
                }
                className={input}
              >
                <option value="">Not sure yet</option>
                {serviceOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="new-contact-channel" className="block text-sm text-gray-300 mb-1">
                Preferred channel
              </label>
              <select
                id="new-contact-channel"
                value={formData.preferredChannel}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    preferredChannel: e.target.value as NewContactForm["preferredChannel"],
                  })
                }
                className={input}
              >
                <option value="">No preference</option>
                {CONTACT_CHANNELS.map((channel) => (
                  <option key={channel} value={channel}>
                    {CONTACT_CHANNEL_LABELS[channel]}
                  </option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-300 self-end pb-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.marketingConsent}
                onChange={(e) => setFormData({ ...formData, marketingConsent: e.target.checked })}
                className="accent-gold"
              />
              Agreed to receive marketing emails and messages
            </label>
            <div className="sm:col-span-2 flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="bg-gold text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-gold/90 disabled:opacity-50 transition-colors"
              >
                {isPending ? "Saving…" : "Save contact"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormData(emptyContact);
                }}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard label="Total contacts" value={contacts.length} accent="gold" />
        <StatCard
          label="Marketing consent"
          value={withConsent}
          hint={percent(withConsent, contacts.length)}
          accent="blue"
        />
        <StatCard label="Open leads" value={open} hint="New to proposal sent" accent="orange" />
        <StatCard label="Won" value={won} hint={percent(won, contacts.length)} accent="green" />
      </div>

      <div>
        <label htmlFor="contact-search" className="sr-only">
          Search contacts
        </label>
        <input
          id="contact-search"
          type="search"
          placeholder="Search by name, email, or phone…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-96 p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-gold focus:outline-hidden"
        />
      </div>

      <div className="bg-linear-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/50 rounded-xl overflow-hidden shadow-xl shadow-black/20">
        {filteredContacts.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            <p className="mb-2">{contacts.length === 0 ? "No contacts yet." : "No contacts match that search."}</p>
            {contacts.length === 0 ? (
              <p className="text-sm text-gray-500">
                Leads arrive from the contact form, the newsletter and SMS opt-ins, or add one by hand.
              </p>
            ) : null}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-linear-to-r from-gray-700/80 to-gray-800/80 text-left border-b border-gray-700/50">
                  <Th>Name</Th>
                  <Th>Contact</Th>
                  <Th className="hidden lg:table-cell">Interested in</Th>
                  <Th>Status</Th>
                  <Th className="hidden sm:table-cell">Marketing</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/30">
                {filteredContacts.map((contact) => {
                  const isEditing = editing?.id === contact.id;
                  const interest = serviceTitle(contact.serviceInterest);
                  return (
                    <tr key={contact.id} className="hover:bg-gray-700/20 transition-colors">
                      <td className="px-4 sm:px-6 py-4 align-top">
                        {isEditing ? (
                          <>
                            <label htmlFor={`edit-name-${contact.id}`} className="sr-only">
                              Name
                            </label>
                            <input
                              id={`edit-name-${contact.id}`}
                              type="text"
                              value={editing.name}
                              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                              className={`${input} min-w-40`}
                            />
                          </>
                        ) : (
                          <div className="text-sm text-white font-semibold">{contact.name}</div>
                        )}
                        <div className="text-xs text-gray-500 mt-1 whitespace-nowrap">
                          {formatDate(contact.createdAt)}
                          {contact.source ? ` · ${contact.source.replaceAll("_", " ")}` : ""}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 align-top text-sm">
                        <ul className="space-y-1">
                          {contact.emails.map((email) => (
                            <li key={email.id} className="flex items-center gap-2 text-gray-300">
                              <span className="truncate max-w-[180px] sm:max-w-none">{email.email}</span>
                              {contact.marketingConsent ? (
                                <a
                                  href={`/unsubscribe?email=${encodeURIComponent(email.email)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-red-400/80 hover:text-red-400"
                                  aria-label={`Unsubscribe ${email.email}`}
                                >
                                  Unsubscribe
                                </a>
                              ) : null}
                            </li>
                          ))}
                          {contact.phones.map((phone) => (
                            <li key={phone.id} className="text-gray-400">
                              {phone.phone}
                            </li>
                          ))}
                        </ul>
                        {interest || contact.preferredChannel ? (
                          <div className="lg:hidden text-xs text-gray-500 mt-1">
                            {interest ?? ""}
                            {interest && contact.preferredChannel ? " · " : ""}
                            {contact.preferredChannel ? `Prefers ${CONTACT_CHANNEL_LABELS[contact.preferredChannel]}` : ""}
                          </div>
                        ) : null}
                      </td>
                      <td className="hidden lg:table-cell px-6 py-4 align-top text-sm">
                        <div className="text-gray-300">{interest ?? <span className="text-gray-500">—</span>}</div>
                        {contact.preferredChannel ? (
                          <div className="text-xs text-gray-500 mt-1">
                            Prefers {CONTACT_CHANNEL_LABELS[contact.preferredChannel]}
                          </div>
                        ) : null}
                      </td>
                      <td className="px-4 sm:px-6 py-4 align-top">
                        <label htmlFor={`lead-status-${contact.id}`} className="sr-only">
                          Lead status for {contact.name}
                        </label>
                        <select
                          id={`lead-status-${contact.id}`}
                          value={contact.leadStatus}
                          disabled={isPending}
                          onChange={(e) => handleLeadStatus(contact, e.target.value as LeadStatus)}
                          className={`rounded-full border px-2.5 py-1 text-xs font-semibold bg-gray-900 focus:outline-hidden focus:ring-2 focus:ring-gold/50 disabled:opacity-50 ${LEAD_STATUS_CLASSES[contact.leadStatus]}`}
                        >
                          {LEAD_STATUSES.map((status) => (
                            <option key={status} value={status} className="bg-gray-900 text-white">
                              {LEAD_STATUS_LABELS[status]}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="hidden sm:table-cell px-6 py-4 align-top">
                        {isEditing ? (
                          <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editing.marketingConsent}
                              onChange={(e) => setEditing({ ...editing, marketingConsent: e.target.checked })}
                              className="accent-gold"
                            />
                            {editing.marketingConsent ? "Yes" : "No"}
                          </label>
                        ) : (
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                              contact.marketingConsent
                                ? "bg-green-500/10 text-green-400 border-green-500/40"
                                : "bg-gray-500/10 text-gray-400 border-gray-500/40"
                            }`}
                          >
                            {contact.marketingConsent ? "Yes" : "No"}
                          </span>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4 align-top">
                        {isEditing ? (
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleUpdateContact(editing)}
                              disabled={isPending}
                              className={`${button} bg-gold/10 text-gold border-gold/40 hover:bg-gold/20`}
                            >
                              Save
                            </button>
                            <button type="button" onClick={() => setEditing(null)} className={neutralButton}>
                              Cancel
                            </button>
                          </div>
                        ) : confirmDeleteId === contact.id ? (
                          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-300">
                            <span>Delete {contact.name}?</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteContact(contact.id)}
                              disabled={isPending}
                              className={dangerButton}
                            >
                              Yes, delete
                            </button>
                            <button type="button" onClick={() => setConfirmDeleteId(null)} className={neutralButton}>
                              Keep
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            <Link href={`/quotes/new?contactId=${contact.id}` as Route} className={neutralButton}>
                              Quote
                            </Link>
                            <button
                              type="button"
                              onClick={() =>
                                setEditing({
                                  id: contact.id,
                                  name: contact.name,
                                  marketingConsent: contact.marketingConsent,
                                })
                              }
                              className={neutralButton}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(contact.id)}
                              className={dangerButton}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
