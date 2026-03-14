import { useState } from "react";
import { FaGoogle } from "react-icons/fa";

export default function WelcomePage() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center">Welcome to PeaceinMe!</h2>
        <p className="text-gray-500 text-center mb-6">Your journey to better mental health starts here.</p>
        
        <button className="flex items-center justify-center w-full bg-blue-600 text-white px-4 py-2 rounded-lg mb-4 hover:bg-blue-700">
          <FaGoogle className="mr-2" /> Log in with Google
        </button>
        
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="px-3 text-gray-400">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <form>
          <label className="block mb-2 text-gray-600">Full Name</label>
          <input type="text" name="fullName" value={form.fullName} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg mb-4" placeholder="Enter your full name" />

          <label className="block mb-2 text-gray-600">Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg mb-4" placeholder="Enter your email" />

          <label className="block mb-2 text-gray-600">Password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg mb-4" placeholder="Enter your password" />

          <label className="block mb-2 text-gray-600">Confirm Password</label>
          <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg mb-4" placeholder="Confirm your password" />

          <button className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Sign Up</button>
        </form>
      </div>
    </div>
  );
}
