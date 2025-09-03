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
    <div className="relative">
      {/* Efecto de fondo con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-purple-500/5 rounded-2xl blur-xl"></div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative space-y-6 bg-gradient-to-br from-gray-900/95 to-gray-800/95 p-8 rounded-2xl shadow-2xl backdrop-blur-sm border border-gray-700/50 hover:border-gold/30 transition-all duration-500"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-gold/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-purple-500/10 rounded-full blur-2xl"></div>

        <div className="relative">
          <h2 className="text-4xl md:text-5xl text-gold  font-bold text-center font-iceland tracking-wide">
            Let&apos;s Connect
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-4 rounded-full"></div>
        </div>

        {/** Name Field */}
        <div className="group">
          <div className="relative">
            <input
              {...register("name")}
              type="text"
              id="name"
              className="w-full p-4 bg-gray-800/80 text-white rounded-xl border border-gray-700/60 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-300 font-inter placeholder-gray-400 hover:bg-gray-800 peer backdrop-blur-sm"
              placeholder="Full Name"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gold/0 via-gold/5 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
          <ErrorMessage
            errors={errors}
            name="name"
            render={({ message }) => (
              <p className="text-red-400 text-sm mt-2 font-inter animate-pulse flex items-center">
                <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                {message}
              </p>
            )}
          />
        </div>

        {/** Email Field */}
        <div className="group">
          <div className="relative">
            <input
              {...register("email")}
              type="email"
              id="email"
              className="w-full p-4 bg-gray-800/80 text-white rounded-xl border border-gray-700/60 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-300 font-inter placeholder-gray-400 hover:bg-gray-800 peer backdrop-blur-sm"
              placeholder="Email"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gold/0 via-gold/5 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
          <ErrorMessage
            errors={errors}
            name="email"
            render={({ message }) => (
              <p className="text-red-400 text-sm mt-2 font-inter animate-pulse flex items-center">
                <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                {message}
              </p>
            )}
          />
        </div>

        {/** Phone Field */}
        <div className="group">
          <div className="relative">
            <input
              {...register("phone")}
              type="tel"
              id="phone"
              className="w-full p-4 bg-gray-800/80 text-white rounded-xl border border-gray-700/60 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-300 font-inter placeholder-gray-400 hover:bg-gray-800 peer backdrop-blur-sm"
              placeholder="Phone Number"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gold/0 via-gold/5 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
          <ErrorMessage
            errors={errors}
            name="phone"
            render={({ message }) => (
              <p className="text-red-400 text-sm mt-2 font-inter animate-pulse flex items-center">
                <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                {message}
              </p>
            )}
          />
        </div>

        {/** Message Field */}
        <div className="group">
          <div className="relative">
            <textarea
              {...register("message")}
              id="message"
              className="w-full p-4 bg-gray-800/80 text-white rounded-xl border border-gray-700/60 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-300 font-inter placeholder-gray-400 hover:bg-gray-800 peer backdrop-blur-sm resize-none"
              placeholder="Type your message..."
              rows={5}
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gold/0 via-gold/5 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
          <ErrorMessage
            errors={errors}
            name="message"
            render={({ message }) => (
              <p className="text-red-400 text-sm mt-2 font-inter animate-pulse flex items-center">
                <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                {message}
              </p>
            )}
          />
        </div>

        {/** Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="relative w-full py-4 text-lg font-semibold text-black bg-gradient-to-r from-gold via-yellow-200 to-gold hover:from-yellow-200 hover:via-gold hover:to-yellow-200 rounded-xl transition-all duration-300 shadow-lg hover:shadow-gold/25 font-inter group overflow-hidden transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
            <span className="relative flex items-center justify-center">
              Send Message
              <svg
                className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default DialogForm;
