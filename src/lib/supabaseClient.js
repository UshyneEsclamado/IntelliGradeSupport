import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aheyuzhgllmwntjdaimi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoZXl1emhnbGxtd250amRhaW1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyMjcwMTQsImV4cCI6MjA3MDgwMzAxNH0.ajUd44jZfcj8TLOxqI0t2Fd75wE8NYQa03BEfuEbwdk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)