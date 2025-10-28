"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { searchBusinessContactsAction, type BusinessContact } from "@/actions/contacts/searchBusinessContactsAction";
import { importBusinessContactsAction } from "@/actions/contacts/importBusinessContactsAction";

const BUSINESS_CATEGORIES = [
  { value: "restaurant", label: "Restaurants" },
  { value: "cafe", label: "Cafes" },
  { value: "gym", label: "Gyms" },
  { value: "spa", label: "Spas" },
  { value: "hair_salon", label: "Hair Salons" },
  { value: "beauty_salon", label: "Beauty Salons" },
  { value: "dentist", label: "Dentists" },
  { value: "doctor", label: "Doctors" },
  { value: "lawyer", label: "Lawyers" },
  { value: "accounting", label: "Accountants" },
  { value: "real_estate_agency", label: "Real Estate Agencies" },
  { value: "plumber", label: "Plumbers" },
  { value: "electrician", label: "Electricians" },
  { value: "car_wash", label: "Car Washes" },
  { value: "bakery", label: "Bakeries" },
  { value: "bar", label: "Bars" },
  { value: "hotel", label: "Hotels" },
  { value: "store", label: "Retail Stores" },
  { value: "pharmacy", label: "Pharmacies" },
  { value: "veterinary_care", label: "Veterinary Care" },
];

interface BusinessContactFinderProps {
  onImportComplete?: () => void;
}

export default function BusinessContactFinder({ onImportComplete }: BusinessContactFinderProps) {
  const [isPending, startTransition] = useTransition();
  const [isSearching, setIsSearching] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const [businessType, setBusinessType] = useState("restaurant");
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState(5000);
  const [maxResults, setMaxResults] = useState(20);

  const [businesses, setBusinesses] = useState<BusinessContact[]>([]);
  const [selectedBusinesses, setSelectedBusinesses] = useState<Set<string>>(new Set());
  const [marketingConsent, setMarketingConsent] = useState(false);

  const handleSearch = async () => {
    if (!location.trim()) {
      toast.error("Please enter a location");
      return;
    }

    setIsSearching(true);
    setBusinesses([]);
    setSelectedBusinesses(new Set());

    startTransition(async () => {
      try {
        const result = await searchBusinessContactsAction(
          businessType,
          location,
          radius,
          maxResults
        );

        if (result.success && result.businesses) {
          setBusinesses(result.businesses);
          toast.success(`Found ${result.count} businesses`);
        } else {
          toast.error(result.message || "No businesses found");
        }
      } catch (error) {
        toast.error("Error searching for businesses");
        console.error(error);
      } finally {
        setIsSearching(false);
      }
    });
  };

  const handleToggleSelect = (placeId: string) => {
    const newSelected = new Set(selectedBusinesses);
    if (newSelected.has(placeId)) {
      newSelected.delete(placeId);
    } else {
      newSelected.add(placeId);
    }
    setSelectedBusinesses(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedBusinesses.size === businesses.length) {
      setSelectedBusinesses(new Set());
    } else {
      setSelectedBusinesses(new Set(businesses.map(b => b.placeId)));
    }
  };

  const handleImport = async () => {
    if (selectedBusinesses.size === 0) {
      toast.error("Please select at least one business to import");
      return;
    }

    const selectedContacts = businesses.filter(b => selectedBusinesses.has(b.placeId));

    setIsImporting(true);

    startTransition(async () => {
      try {
        const result = await importBusinessContactsAction(
          selectedContacts,
          marketingConsent
        );

        if (result.success) {
          toast.success(result.message);

          // Remove imported businesses from the list
          setBusinesses(prev => prev.filter(b => !selectedBusinesses.has(b.placeId)));
          setSelectedBusinesses(new Set());

          // Show errors if any
          if (result.errors && result.errors.length > 0) {
            console.log("Import errors:", result.errors);
          }

          // Refresh the contacts list
          if (onImportComplete) {
            onImportComplete();
          }
        } else {
          toast.error(result.message || "Failed to import contacts");
        }
      } catch (error) {
        toast.error("Error importing contacts");
        console.error(error);
      } finally {
        setIsImporting(false);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gold font-iceland">
          Business Contact Finder
        </h2>
        <p className="text-gray-400 font-inter mt-2">
          Search for local businesses and import them as contacts
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-gray-800 rounded-lg p-6 space-y-4 font-inter">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Business Type */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Business Category
            </label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-gold focus:outline-none"
            >
              {BUSINESS_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Location (City, State or Zip)
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Miami, FL or 33101"
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Radius */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Search Radius: {(radius / 1000).toFixed(1)} km
            </label>
            <input
              type="range"
              min="1000"
              max="20000"
              step="1000"
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Max Results */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Max Results: {maxResults}
            </label>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={maxResults}
              onChange={(e) => setMaxResults(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          disabled={isPending || isSearching}
          className="w-full bg-gold text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSearching ? "Searching..." : "Search Businesses"}
        </button>
      </div>

      {/* Results */}
      {businesses.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6 space-y-4 font-inter">
          {/* Import Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-gray-700">
            <div>
              <p className="text-white font-medium">
                {businesses.length} businesses found
              </p>
              <p className="text-sm text-gray-400">
                {selectedBusinesses.size} selected
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <label className="flex items-center cursor-pointer bg-gray-700 px-4 py-2 rounded-lg">
                <input
                  type="checkbox"
                  checked={marketingConsent}
                  onChange={(e) => setMarketingConsent(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-300">
                  Marketing consent
                </span>
              </label>

              <button
                onClick={handleSelectAll}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                {selectedBusinesses.size === businesses.length ? "Deselect All" : "Select All"}
              </button>

              <button
                onClick={handleImport}
                disabled={selectedBusinesses.size === 0 || isImporting}
                className="bg-gold text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isImporting ? "Importing..." : `Import ${selectedBusinesses.size} Selected`}
              </button>
            </div>
          </div>

          {/* Results Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-700 text-left">
                  <th className="px-4 py-3 text-sm font-medium text-gray-300">
                    <input
                      type="checkbox"
                      checked={selectedBusinesses.size === businesses.length && businesses.length > 0}
                      onChange={handleSelectAll}
                      className="cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-300">
                    Name
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-300">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-300">
                    Email (Inferred)
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-300">
                    Address
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {businesses.map((business) => (
                  <tr
                    key={business.placeId}
                    className={`hover:bg-gray-750 ${selectedBusinesses.has(business.placeId) ? "bg-gray-750" : ""}`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedBusinesses.has(business.placeId)}
                        onChange={() => handleToggleSelect(business.placeId)}
                        className="cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-white font-medium">
                        {business.name}
                      </span>
                      {business.website && (
                        <a
                          href={business.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-blue-400 hover:text-blue-300 text-xs"
                        >
                          Website
                        </a>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-300 text-sm">
                        {business.phone || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-300 text-sm">
                        {business.email || "—"}
                      </span>
                      {business.email && (
                        <span className="ml-2 text-yellow-500 text-xs" title="This email is inferred and may not be valid">
                          ⚠️
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-sm max-w-xs truncate">
                      {business.address || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Warning */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex gap-2">
              <span className="text-yellow-500 text-lg">⚠️</span>
              <div className="text-sm text-yellow-200">
                <p className="font-semibold mb-1">Important:</p>
                <ul className="list-disc list-inside space-y-1 text-yellow-200/90">
                  <li>Inferred emails may not be valid - verify before sending campaigns</li>
                  <li>Marketing consent is {marketingConsent ? "ENABLED" : "DISABLED"} for imported contacts</li>
                  <li>Always comply with CAN-SPAM, TCPA, and other marketing regulations</li>
                  <li>Review Google Places API Terms of Service</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
