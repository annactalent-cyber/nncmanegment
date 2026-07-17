// Supabase CDN version - no build tool required
const SUPABASE_URL = 'https://supabase.polmarkai.pro'
const SUPABASE_ANON_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc1ODQzOTM4MCwiZXhwIjo0OTE0MTEyOTgwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.7ROiaPsoKBpCCz4qDr1Uc2LfyNUo2bomy0Woc_QAR5s'

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn("Supabase credentials are missing!")
}

// Use the global supabase object loaded via CDN script tag
const { createClient } = supabase
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export { supabaseClient as supabase }
