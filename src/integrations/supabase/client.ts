// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://hohyoyenvrupegrglrut.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvaHlveWVudnJ1cGVncmdscnV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2MzQ0NTksImV4cCI6MjA2NTIxMDQ1OX0.1-q6UjKFLaZWJSOhboConLM1HAfKr4P84YEAVfJ8Acg";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);