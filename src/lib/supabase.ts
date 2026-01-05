
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = 'https://yhaxtavgzplcllonzrhr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloYXh0YXZnenBsY2xsb256cmhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczNzIyNjQsImV4cCI6MjA4Mjk0ODI2NH0.obxScsb-o6T7YSaJV1K3MCXOfEb_KycSNCcCGSQZqqc';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);