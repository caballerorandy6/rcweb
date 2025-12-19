"use client";

import { useState } from "react";
import { SubscriptionData } from "@/actions/subscriptions/getAllSubscriptionsAction";
import { cancelSubscriptionAction } from "@/actions/subscriptions/cancelSubscriptionAction";
import {
  getSubscriptionInvoicesAction,
  InvoiceData,
} from "@/actions/subscriptions/getSubscriptionInvoicesAction";
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  ArrowTopRightOnSquareIcon,
  XMarkIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";

interface SubscriptionManagementProps {
  initialSubscriptions: SubscriptionData[];
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }> = {
  active: { label: "Active", color: "text-green-400 bg-green-400/10", icon: CheckCircleIcon },
  cancelled: { label: "Cancelled", color: "text-red-400 bg-red-400/10", icon: XCircleIcon },
  past_due: { label: "Past Due", color: "text-yellow-400 bg-yellow-400/10", icon: ExclamationTriangleIcon },
  unpaid: { label: "Unpaid", color: "text-orange-400 bg-orange-400/10", icon: ExclamationTriangleIcon },
  trialing: { label: "Trial", color: "text-blue-400 bg-blue-400/10", icon: ClockIcon },
};

export default function SubscriptionManagement({ initialSubscriptions }: SubscriptionManagementProps) {
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>(initialSubscriptions);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null);
  const [invoicesModal, setInvoicesModal] = useState<{
    isOpen: boolean;
    subscriptionId: string | null;
    customerName: string;
    invoices: InvoiceData[];
    loading: boolean;
  }>({
    isOpen: false,
    subscriptionId: null,
    customerName: "",
    invoices: [],
    loading: false,
  });

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesFilter = filter === "all" || sub.status === filter;
    const matchesSearch = search === "" ||
      sub.name.toLowerCase().includes(search.toLowerCase()) ||
      sub.email.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: subscriptions.length,
    active: subscriptions.filter((s) => s.status === "active").length,
    cancelled: subscriptions.filter((s) => s.status === "cancelled").length,
    pastDue: subscriptions.filter((s) => s.status === "past_due").length,
    mrr: subscriptions
      .filter((s) => s.status === "active")
      .reduce((sum, s) => sum + s.amount, 0) / 100,
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100);
  };

  const handleCancel = async (subscription: SubscriptionData) => {
    setCancellingId(subscription.id);
    setConfirmCancel(null);

    const result = await cancelSubscriptionAction(subscription.id);

    if (result.success) {
      setSubscriptions((prev) =>
        prev.map((s) =>
          s.id === subscription.id
            ? { ...s, status: "cancelled", cancelledAt: new Date().toISOString() }
            : s
        )
      );
      toast.success("Subscription cancelled successfully");
    } else {
      toast.error(result.error || "Failed to cancel subscription");
    }

    setCancellingId(null);
  };

  const getStripeUrl = (stripeSubscriptionId: string) => {
    const isTest = stripeSubscriptionId.startsWith("sub_");
    const baseUrl = isTest
      ? "https://dashboard.stripe.com/test/subscriptions"
      : "https://dashboard.stripe.com/subscriptions";
    return `${baseUrl}/${stripeSubscriptionId}`;
  };

  const handleViewInvoices = async (subscription: SubscriptionData) => {
    setInvoicesModal({
      isOpen: true,
      subscriptionId: subscription.id,
      customerName: subscription.name,
      invoices: [],
      loading: true,
    });

    const result = await getSubscriptionInvoicesAction(subscription.id);

    if (result.success && result.invoices) {
      setInvoicesModal((prev) => ({
        ...prev,
        invoices: result.invoices!,
        loading: false,
      }));
    } else {
      toast.error(result.error || "Failed to load invoices");
      setInvoicesModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const closeInvoicesModal = () => {
    setInvoicesModal({
      isOpen: false,
      subscriptionId: null,
      customerName: "",
      invoices: [],
      loading: false,
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
          <p className="text-gray-400 text-sm font-inter">Total Subscriptions</p>
          <p className="text-2xl font-bold text-white font-iceland">{stats.total}</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
          <p className="text-gray-400 text-sm font-inter">Active</p>
          <p className="text-2xl font-bold text-green-400 font-iceland">{stats.active}</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
          <p className="text-gray-400 text-sm font-inter">Cancelled</p>
          <p className="text-2xl font-bold text-red-400 font-iceland">{stats.cancelled}</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
          <p className="text-gray-400 text-sm font-inter">Monthly Revenue</p>
          <p className="text-2xl font-bold text-gold font-iceland">${stats.mrr.toFixed(2)}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white font-inter placeholder-gray-500 focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>

        {/* Filter */}
        <div className="flex gap-2 flex-wrap">
          {["all", "active", "cancelled", "past_due"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium font-inter transition-colors ${
                filter === status
                  ? "bg-gold text-gray-900"
                  : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
              }`}
            >
              {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium font-inter text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium font-inter text-gray-400 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium font-inter text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium font-inter text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium font-inter text-gray-400 uppercase tracking-wider">
                  Next Billing
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium font-inter text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50 font-inter">
              {filteredSubscriptions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    No subscriptions found
                  </td>
                </tr>
              ) : (
                filteredSubscriptions.map((subscription) => {
                  const status = statusConfig[subscription.status] || statusConfig.active;
                  const StatusIcon = status.icon;
                  const isActive = subscription.status === "active";

                  return (
                    <tr key={subscription.id} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-white font-medium">{subscription.name}</p>
                          <p className="text-gray-400 text-sm">{subscription.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-300">{subscription.planName}</td>
                      <td className="px-4 py-4 text-gold font-medium">
                        {formatCurrency(subscription.amount)}/mo
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          <StatusIcon className="h-3.5 w-3.5" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-400 text-sm">
                        {subscription.status === "cancelled"
                          ? `Cancelled: ${formatDate(subscription.cancelledAt)}`
                          : formatDate(subscription.currentPeriodEnd)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {/* View Invoices */}
                          <button
                            onClick={() => handleViewInvoices(subscription)}
                            className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                            title="View Invoices"
                          >
                            <DocumentTextIcon className="h-4 w-4" />
                          </button>

                          {/* Stripe Link */}
                          <a
                            href={getStripeUrl(subscription.stripeSubscriptionId)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-gold transition-colors"
                            title="View in Stripe"
                          >
                            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                          </a>

                          {/* Cancel Button */}
                          {isActive && (
                            <>
                              {confirmCancel === subscription.id ? (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleCancel(subscription)}
                                    disabled={cancellingId === subscription.id}
                                    className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors disabled:opacity-50"
                                  >
                                    {cancellingId === subscription.id ? "..." : "Confirm"}
                                  </button>
                                  <button
                                    onClick={() => setConfirmCancel(null)}
                                    className="p-1 text-gray-400 hover:text-white transition-colors"
                                  >
                                    <XMarkIcon className="h-4 w-4" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setConfirmCancel(subscription.id)}
                                  className="px-2 py-1 text-xs bg-gray-700/50 text-gray-300 rounded hover:bg-red-500/20 hover:text-red-400 transition-colors"
                                >
                                  Cancel
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoices Modal */}
      {invoicesModal.isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl border border-gray-700 max-w-2xl w-full max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
              <div>
                <h3 className="text-lg font-bold text-white font-iceland">
                  Payment History
                </h3>
                <p className="text-sm text-gray-400 font-inter">
                  {invoicesModal.customerName}
                </p>
              </div>
              <button
                onClick={closeInvoicesModal}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {invoicesModal.loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
                </div>
              ) : invoicesModal.invoices.length === 0 ? (
                <p className="text-gray-400 text-center py-8 font-inter">
                  No invoices found
                </p>
              ) : (
                <div className="space-y-3">
                  {invoicesModal.invoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium font-inter">
                            {invoice.number || invoice.id.slice(0, 20)}
                          </p>
                          <p className="text-sm text-gray-400 font-inter">
                            {formatDate(invoice.created)}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-gold font-semibold font-inter">
                              {formatCurrency(invoice.amount)}
                            </p>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                invoice.status === "paid"
                                  ? "bg-green-400/10 text-green-400"
                                  : invoice.status === "open"
                                  ? "bg-yellow-400/10 text-yellow-400"
                                  : "bg-gray-400/10 text-gray-400"
                              }`}
                            >
                              {invoice.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            {invoice.invoiceUrl && (
                              <a
                                href={invoice.invoiceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                                title="View Invoice"
                              >
                                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                              </a>
                            )}
                            {invoice.invoicePdf && (
                              <a
                                href={invoice.invoicePdf}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-gray-400 hover:text-green-400 transition-colors"
                                title="Download PDF"
                              >
                                <ArrowDownTrayIcon className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
