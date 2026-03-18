import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://db5qiif9scgjz8e41w.database.nocode.cn";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzQ2OTc5MjAwLCJleHAiOjE5MDQ3NDU2MDB9.83p6K3JQ_xaUvsen-7iosCcDzXDyK_Sn6vVWMGhTjMY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

