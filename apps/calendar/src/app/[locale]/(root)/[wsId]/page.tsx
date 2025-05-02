import CalendarClientPage from './client';
import { getPermissions, getWorkspace } from '@/lib/workspace-helper';
import { createClient } from '@tuturuuu/supabase/next/server';
import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{
    wsId: string;
  }>;
}

export default async function CalendarPage({ params }: PageProps) {
  const { wsId } = await params;
  const workspace = await getWorkspace(wsId);

  const { withoutPermission } = await getPermissions({
    wsId,
  });

  const supabase = await createClient();

  const { data: googleToken } = await supabase
    .from('calendar_auth_tokens')
    .select('*')
    .eq('ws_id', wsId)
    .maybeSingle();

  if (withoutPermission('manage_calendar')) redirect(`/${wsId}`);
  if (!workspace) return null;

  return <CalendarClientPage googleToken={googleToken} workspace={workspace} />;
}
