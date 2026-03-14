import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('service_e1mbixk', 'template_o34y1no', form.current, {
        publicKey: 'M13mIfyr6b6lNGIIZ',
      })
      .then(
        () => {
          console.log('SUCCESS!');
          alert('Message sent successfully!');
        },
        (error) => {
          console.log('FAILED...', error.text);
          alert('Failed to send message.');
        }
      );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Contact Us
        </h2>
        <form ref={form} onSubmit={sendEmail} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-gray-700 font-medium">Name</label>
            <input
              type="text"
              name="user_name"
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Your Name"
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              name="user_email"
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Your Email"
              required
            />
          </div>

          {/* Message Field */}
          <div>
            <label className="block text-gray-700 font-medium">Message</label>
            <textarea
              name="message"
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none h-32"
              placeholder="Your Message"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;
