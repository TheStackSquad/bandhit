//src/app/api/like/route.js

import { createServerSupabaseClient } from '@/lib/supabaseClient';

export async function POST(req) {
  const supabase = createServerSupabaseClient();

  try {
    const { eventId, sessionId } = await req.json();
    if (!eventId || !sessionId) {
      return Response.json(
        { error: 'Missing required parameters: eventId or sessionId' },
        { status: 400 }
      );
    }

    // Check existing like
    const { data: existingLike, error: queryError } = await supabase
      .from('event_likes')
      .select('id')
      .eq('event_id', eventId)
      .eq('session_id', sessionId)
      .maybeSingle();

    if (queryError) {
      console.error('[Like API] Query error:', queryError.message);
      return Response.json(
        { error: 'Database query failed' },
        { status: 500 }
      );
    }

    // Get total likes count
    const { data: likesCount,
      //eslint-disable-next-line no-unused-vars
      error: countError } = await supabase
      .from('event_likes')
      .select('id', { count: 'exact' })
      .eq('event_id', eventId);

    const totalLikes = likesCount?.length || 0;

    // If like exists, handle unlike
    if (existingLike) {
      const { error: deleteError } = await supabase
        .from('event_likes')
        .delete()
        .eq('id', existingLike.id);

      if (deleteError) {
        console.error('[Like API] Delete error:', deleteError.message);
        return Response.json(
          { error: 'Failed to unlike event' },
          { status: 500 }
        );
      }

      return Response.json({
        liked: false,
        eventId: eventId,
        likesCount: totalLikes - 1,
        message: 'Unliked successfully'
      }, { status: 200 });
    }

    // Handle like
    const { error: insertError } = await supabase
      .from('event_likes')
      .insert({
        event_id: eventId,
        session_id: sessionId,
        created_at: new Date().toISOString()
      });

    if (insertError) {
      console.error('[Like API] Insert error:', insertError.message);
      return Response.json(
        { error: 'Failed to save like' },
        { status: 500 }
      );
    }

    return Response.json({
      liked: true,
      eventId: eventId,
      likesCount: totalLikes + 1,
      message: 'Liked successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('[Like API] Error:', error.message);
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Add GET endpoint to retrieve like status
export async function GET(req) {
  const supabase = createServerSupabaseClient();
  const url = new URL(req.url);
  const eventId = url.searchParams.get('eventId');
  const sessionId = url.searchParams.get('sessionId');

  if (!eventId || !sessionId) {
    return Response.json(
      { error: 'Missing required parameters: eventId or sessionId' },
      { status: 400 }
    );
  }

  try {
    // Check if event is liked by this session
    const { data: existingLike, error: likeError } = await supabase
      .from('event_likes')
      .select('id')
      .eq('event_id', eventId)
      .eq('session_id', sessionId)
      .maybeSingle();

    if (likeError) {
      console.error('[Like API] Query error:', likeError.message);
      return Response.json(
        { error: 'Database query failed' },
        { status: 500 }
      );
    }

    // Get total likes count
    const { data: likesCount, error: countError } = await supabase
      .from('event_likes')
      .select('id', { count: 'exact' })
      .eq('event_id', eventId);

    if (countError) {
      console.error('[Like API] Count error:', countError.message);
      return Response.json(
        { error: 'Failed to get likes count' },
        { status: 500 }
      );
    }

    return Response.json({
      liked: !!existingLike,
      eventId: eventId,
      likesCount: likesCount.length,
    }, { status: 200 });
  } catch (error) {
    console.error('[Like API] Error:', error.message);
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}