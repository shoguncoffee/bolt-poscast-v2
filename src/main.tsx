import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Supabase from './supabase/client.js';
import App from './App.js';
import './index.css';

const { data, error } = await Supabase.auth.getUser();
console.log('current user:', data);

if (data.user === null) {
  const { data, error } = await Supabase.auth.signInAnonymously();
  console.log('create user:', data);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={' '}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);