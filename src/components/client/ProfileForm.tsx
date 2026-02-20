"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@hookform/error-message";
import { toast } from "sonner";
import {
  UpdateClientProfileSchema,
  type UpdateClientProfileData,
} from "@/lib/zod";
import { updateClientProfileAction } from "@/actions/client/updateClientProfileAction";

interface ProfileFormProps {
  initialData: {
    name: string;
    email: string;
    phone: string | null;
  };
  onSuccess?: () => void;
}

export default function ProfileForm({
  initialData,
  onSuccess,
}: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateClientProfileData>({
    resolver: zodResolver(UpdateClientProfileSchema),
    defaultValues: {
      name: initialData.name,
      email: initialData.email,
      phone: initialData.phone || "",
    },
  });

  const onSubmit: SubmitHandler<UpdateClientProfileData> = async (data) => {
    const toastId = toast.loading("Updating profile...");

    try {
      const result = await updateClientProfileAction(data);

      if (result.success) {
        toast.success("Profile updated successfully!", { id: toastId });
        if (onSuccess) {
          onSuccess();
        }
      } else if (!result.success) {
        toast.error(result.error || "Failed to update profile", {
          id: toastId,
        });
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Something went wrong. Please try again.", { id: toastId });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name Field */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-300 mb-2 font-inter"
        >
          Full Name
        </label>
        <input
          {...register("name")}
          type="text"
          id="name"
          className="w-full px-4 py-3 bg-gray-800/50 text-white rounded-lg border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition-all font-inter"
          placeholder="Your full name"
        />
        <ErrorMessage
          errors={errors}
          name="name"
          render={({ message }) => (
            <p className="mt-1 text-sm text-red-400 font-inter">{message}</p>
          )}
        />
      </div>

      {/* Email Field */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-300 mb-2 font-inter"
        >
          Email Address
        </label>
        <input
          {...register("email")}
          type="email"
          id="email"
          className="w-full px-4 py-3 bg-gray-800/50 text-white rounded-lg border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition-all font-inter"
          placeholder="your.email@example.com"
        />
        <ErrorMessage
          errors={errors}
          name="email"
          render={({ message }) => (
            <p className="mt-1 text-sm text-red-400 font-inter">{message}</p>
          )}
        />
      </div>

      {/* Phone Field */}
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-300 mb-2 font-inter"
        >
          Phone Number (Optional)
        </label>
        <input
          {...register("phone")}
          type="tel"
          id="phone"
          className="w-full px-4 py-3 bg-gray-800/50 text-white rounded-lg border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition-all font-inter"
          placeholder="+1 (555) 123-4567"
        />
        <ErrorMessage
          errors={errors}
          name="phone"
          render={({ message }) => (
            <p className="mt-1 text-sm text-red-400 font-inter">{message}</p>
          )}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="relative w-full py-3 px-4 text-base font-semibold text-black bg-gradient-to-r from-gold via-yellow-200 to-gold hover:from-yellow-200 hover:via-gold hover:to-yellow-200 rounded-lg transition-all duration-300 shadow-lg hover:shadow-gold/25 font-inter group overflow-hidden transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12 disabled:translate-x-[-100%]"></div>
        <span className="relative flex items-center justify-center">
          {isSubmitting ? "Updating..." : "Update Profile"}
        </span>
      </button>
    </form>
  );
}
