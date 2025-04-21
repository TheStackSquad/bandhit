//src/app/api/dataDelete/route.js
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabaseClient';
import { deleteUserAccountAndData } from '@/lib/dataDeletionService';

export async function POST(
  //eslint-disable-next-line no-unused-vars
  request) {
  const supabase = createServerSupabaseClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;

    try {
      await deleteUserAccountAndData(userId);
      return NextResponse.json({ message: 'Data deletion initiated successfully.' }, { status: 200 });
    } catch (error) {
      console.error('Error initiating data deletion:', error);
      return NextResponse.json({ error: 'Failed to initiate data deletion.' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error getting user from Supabase Auth:', error);
    return NextResponse.json({ error: 'Authentication error.' }, { status: 401 });
  }
}