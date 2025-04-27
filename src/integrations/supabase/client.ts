
import { createClient } from '@supabase/supabase-js';

// Use hardcoded values instead of environment variables
const supabaseUrl = 'https://ctidzqynewvqxguhhknp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0aWR6cXluZXd2cXhndWhoa25wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzNzgzMDksImV4cCI6MjA1Nzk1NDMwOX0.duoo6n4oN7FV--pQrEKWQZlqoslDxr-6dshz83IV2w4';

export const supabase = createClient(supabaseUrl, supabaseKey);
