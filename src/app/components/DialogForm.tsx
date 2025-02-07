import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@hookform/error-message";
import { FormSshema, FormData } from "@/libs/zod";

const DialogForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormSshema),
  });

  const onSubmit: SubmitHandler<FormData> = (data) => console.log(data);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 bg-gray-900 p-6 rounded-xl shadow-lg"
    >
      <h2 className="text-2xl font-bold text-white text-center">
        Let&apos;s Connect
      </h2>

      {/** Name Field */}
      <div>
        <label className="block text-gray-400 font-medium mb-1" htmlFor="name">
          Name
        </label>
        <input
          {...register("name")}
          type="text"
          id="name"
          className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-gold transition"
          placeholder="Full Name"
        />
        <ErrorMessage
          errors={errors}
          name="name"
          render={({ message }) => (
            <p className="text-red-500 text-sm mt-1">{message}</p>
          )}
        />
      </div>

      {/** Email Field */}
      <div>
        <label className="block text-gray-400 font-medium mb-1" htmlFor="email">
          Email
        </label>
        <input
          {...register("email")}
          type="email"
          id="email"
          className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-gold transition"
          placeholder="Email"
        />
        <ErrorMessage
          errors={errors}
          name="email"
          render={({ message }) => (
            <p className="text-red-500 text-sm mt-1">{message}</p>
          )}
        />
      </div>

      {/** Phone Field */}
      <div>
        <label className="block text-gray-400 font-medium mb-1" htmlFor="phone">
          Phone Number
        </label>
        <input
          {...register("phone")}
          type="tel"
          id="phone"
          className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-gold transition"
          placeholder="Phone Number"
        />
        <ErrorMessage
          errors={errors}
          name="phone"
          render={({ message }) => (
            <p className="text-red-500 text-sm mt-1">{message}</p>
          )}
        />
      </div>

      {/** Message Field */}
      <div>
        <label
          className="block text-gray-400 font-medium mb-1"
          htmlFor="message"
        >
          Message
        </label>
        <textarea
          {...register("message")}
          id="message"
          className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-gold transition"
          placeholder="Type your message..."
          rows={4}
        />
        <ErrorMessage
          errors={errors}
          name="message"
          render={({ message }) => (
            <p className="text-red-500 text-sm mt-1">{message}</p>
          )}
        />
      </div>

      {/** Submit Button */}
      <button
        type="submit"
        className="w-full py-3 text-lg font-semibold text-white bg-gold/80 hover:bg-gold rounded-lg transition shadow-md"
      >
        Send Message
      </button>
    </form>
  );
};

export default DialogForm;
