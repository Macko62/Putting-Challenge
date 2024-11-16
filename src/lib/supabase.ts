import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nouygwpptstgzaghzgtz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vdXlnd3BwdHN0Z3phZ2h6Z3R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE3MDUyODAsImV4cCI6MjA0NzI4MTI4MH0.F3HG1j_5uU4cqOOmoRT-CRgoWtNwWxt4s0e9TDzwq-c';

export const supabase = createClient(supabaseUrl, supabaseKey);