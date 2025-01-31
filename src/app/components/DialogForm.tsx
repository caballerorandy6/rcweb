import React from "react";

const DialogForm = () => {
  return (
    <form>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Us</h2>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
          Name
        </label>
        <input
          type="text"
          id="name"
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Your Name"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
          Email
        </label>
        <input
          type="email"
          id="email"
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Your Email"
          required
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 font-medium mb-2"
          htmlFor="message"
        >
          Message
        </label>
        <textarea
          id="message"
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Your Message"
          rows={4}
          required
        />
      </div>
      <div className="mt-4">
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
        >
          Send Message
        </button>
      </div>
    </form>
  );
};

export default DialogForm;
