import { createClient } from "@supabase/supabase-js"

// TODO: Replace with your actual project credentials
// In a real project, use process.env.PLASMO_PUBLIC_SUPABASE_URL
const SUPABASE_URL = "https://xhjvkyofmhcyxuafmtsj.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoanZreW9mbWhjeXh1YWZtdHNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2MzM0ODIsImV4cCI6MjA4MTIwOTQ4Mn0.homVkOPYwV7gZH2CXIFVxM_2s8eJDPT-jafDkMq-T08"

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
