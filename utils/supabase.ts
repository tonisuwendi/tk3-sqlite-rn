
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://aaqkzjemodgpgexmsxrg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhcWt6amVtb2RncGdleG1zeHJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5ODc4NTgsImV4cCI6MjA2MjU2Mzg1OH0.kKfYs1wuflTIHQWQeTtvF1WX1zfhpFP7TT9xGW0nf84',
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });