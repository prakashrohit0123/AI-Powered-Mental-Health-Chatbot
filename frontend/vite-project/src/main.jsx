
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
// import { BrowserRouter } from 'react-router-dom';
import HomePage from './components/HomePage.jsx';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react'; // Import ClerkProvider
import About from './components/About.jsx';
import Contact from './components/Header/Contact.jsx';


const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}




const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index element={<HomePage />} />
      <Route path='about' element={<About />} />
      <Route path='contact' element={<Contact />} />
    </Route>
  )
);


// Create the root for the React app and render it
const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </React.StrictMode>
);
