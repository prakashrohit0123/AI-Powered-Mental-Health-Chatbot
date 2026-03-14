
// import React from "react";
// import { Link } from "react-router-dom";
// import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

// const Header = () => {
//   return (
//     <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
//       {/* Logo */}
//       <Link to="/" className="text-2xl font-bold text-gray-800 flex items-center">
//         <span className="text-pink-500 text-3xl mr-2">❤</span> PeaceinMe
//       </Link>

//       {/* Navigation Links */}
//       <div className="flex items-center space-x-6">
//         <Link to="/" className="text-gray-700 hover:text-pink-500">Home</Link>
//         <Link to="/about" className="text-gray-700 hover:text-pink-500">About</Link>
//         <Link to="/contact" className="text-gray-700 hover:text-pink-500">Contact</Link>

//         {/* SignIn & User Icon */}
//         <SignedOut>
//           <SignInButton />
//         </SignedOut>
//         <SignedIn>
//           <UserButton />
//         </SignedIn>
//       </div>
//     </nav>
//   );
// };

// export default Header;


import React from "react";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";

const Header = () => {
  const { user } = useUser();

  const handleLogout = async () => {
    if (user) {
      try {
        // Delete chat history for the user on logout
        await fetch(`http://localhost:3000/chat/${user.id}`, {
          method: "DELETE",
        });
      } catch (error) {
        console.error("Error deleting chat history:", error);
      }
    }
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-gray-800 flex items-center">
        <span className="text-pink-500 text-3xl mr-2">❤</span> PeaceinMe
      </Link>

      <div className="flex items-center space-x-6">
        <Link to="/" className="text-gray-700 hover:text-pink-500">Home</Link>
        <Link to="/about" className="text-gray-700 hover:text-pink-500">About</Link>
        <Link to="/contact" className="text-gray-700 hover:text-pink-500">Contact</Link>

        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOut={handleLogout} /> {/* Call handleLogout on sign-out */}
        </SignedIn>
      </div>
    </nav>
  );
};

export default Header;