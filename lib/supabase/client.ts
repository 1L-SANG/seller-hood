import { createBrowserClient } from '@supabase/ssr';

import type { Database } from '@/types/database';

/**
 * 클라이언트 사이드 Supabase 클라이언트 생성
 * Client Components에서 사용
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
