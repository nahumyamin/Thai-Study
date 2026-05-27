import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://ciafqlimavxoenxljvrh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpYWZxbGltYXZ4b2VueGxqdnJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4OTA2MjIsImV4cCI6MjA5NTQ2NjYyMn0.Zsrk5o6ilEKgHJSNQpcZoHlB6RJRIhYEWqD_00DhA5g',
  { auth: { flowType: 'implicit' } },
);
