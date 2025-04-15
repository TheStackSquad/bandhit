//src/app/page.js
'use client';

import HomeUI from '@/components/UI/homeLaout/homeUI';
// import { useGetEventsQuery } from '@/reduxStore/api/eventsApi';

export default function Home() {
  // Fetch events immediately
  // const { data: events, isLoading, error } = useGetEventsQuery();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      {/* {isLoading && <p>Loading events...</p>}
      {error && <p className="text-red-500">Failed to load events: {error.message}</p>} */}

      {/* <HomeUI events={events} /> */}
      <HomeUI />
    </div>
  );
}

