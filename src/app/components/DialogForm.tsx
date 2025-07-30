import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@hookform/error-message";
import { FormSshema, FormData } from "@/libs/zod";
import { toast } from "sonner";

interface DialogFormProps {
  closeModal: () => void;
}

const DialogForm = ({ closeModal }: DialogFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(FormSshema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await fetch("/api/receive-mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Message sent successfully!");
        reset();
        closeModal();
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 bg-gray-900 p-6 rounded-xl shadow-lg"
    >
      <h2 className="text-4xl text-gold font-bold text-center font-iceland">
        Let&apos;s Connect
      </h2>

      {/** Name Field */}
      <>
        <input
          {...register("name")}
          type="text"
          id="name"
          className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-gold transition font-inter"
          placeholder="Full Name"
        />
        <ErrorMessage
          errors={errors}
          name="name"
          render={({ message }) => (
            <p className="text-red-500 text-sm mt-1 font-inter">{message}</p>
          )}
        />
      </>

      {/** Email Field */}
      <>
        <input
          {...register("email")}
          type="email"
          id="email"
          className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-gold transition font-inter"
          placeholder="Email"
        />
        <ErrorMessage
          errors={errors}
          name="email"
          render={({ message }) => (
            <p className="text-red-500 text-sm mt-1 font-inter">{message}</p>
          )}
        />
      </>

      {/** Phone Field */}
      <>
        <input
          {...register("phone")}
          type="tel"
          id="phone"
          className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-gold transition font-inter"
          placeholder="Phone Number"
        />
        <ErrorMessage
          errors={errors}
          name="phone"
          render={({ message }) => (
            <p className="text-red-500 text-sm mt-1 font-inter">{message}</p>
          )}
        />
      </>

      {/** Message Field */}
      <>
        <textarea
          {...register("message")}
          id="message"
          className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-gold transition font-inter"
          placeholder="Type your message..."
          rows={4}
        />
        <ErrorMessage
          errors={errors}
          name="message"
          render={({ message }) => (
            <p className="text-red-500 text-sm mt-1 font-inter">{message}</p>
          )}
        />
      </>

      {/** Submit Button */}
      <button
        type="submit"
        className="w-full py-3 text-lg font-semibold text-white bg-gold/80 hover:bg-gold rounded-lg transition shadow-md font-inter"
      >
        Send Message
      </button>
    </form>
  );
};

export default DialogForm;
