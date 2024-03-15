import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { createClient } from "@supabase/supabase-js"
import { SessionContextProvider } from "@supabase/auth-helpers-react";

const supabase = createClient(
  "https://hximvjzbghwhlbasgjjg.supabase.co", //project-url 
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4aW12anpiZ2h3aGxiYXNnampnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTAzMzY0NDksImV4cCI6MjAyNTkxMjQ0OX0.bwm9OxaxsX2aFUnhnl9GsVXOWAn3FYcwzbqA5ZrI7zk"
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
      <App />
    </SessionContextProvider>
  </React.StrictMode>,
)
