// src/components/data/eventsData.jsx


// data for categories section

export const upcomingEventsData = {
  "bookLaunch.webp": {
    id: "event-1",
    name: "Book Launch Party",
    time: "7:00 PM",
    date: "2024-09-15",
    price: "₦100",
    status: "Still Selling",
    venue: "The Book Nook"
  },
  "kigaliSplash.webp": {
    id: "event-2",
    name: "The Kigali Splash",
    time: "8:30 PM",
    date: "2024-10-20",
    price: "₦150",
    status: "Still Selling",
    venue: "Captain Morgan Collisieum"
  },
  "asake.webp": {
    id: "event-3",
    name: "The Homecoming",
    time: "6:00 PM",
    date: "2024-11-10",
    price: "₦50",
    status: "Still Selling",
    venue: "The Civic Centre"
  },
  "AsaPerforming.webp": {
    id: "event-4",
    name: "Asa: Back To Basics",
    time: "8:00 PM",
    date: "2024-12-01",
    price: "₦120",
    status: "Still Selling",
    venue: "The Jazz Club"
  },
  "olamide.webp": {
    id: "event-5",
    name: "YBNL All Star",
    time: "7:30 PM",
    date: "2025-01-15",
    price: "₦80",
    status: "Still Selling",
    venue: "Cinema 45"
  },
  "OjudeOba.webp": {
    id: "event-6",
    name: "Ojude Oba Festival",
    time: "10:00 AM",
    date: "2024-08-18",
    price: "₦200",
    status: "Sold Out",
    venue: "Cultural Center"
  },
  "felaInVersace.webp": {
    id: "event-7",
    name: "Underground Spiritual Movement",
    time: "9:00 PM",
    date: "2024-07-15",
    price: "₦180",
    status: "Still Selling",
    venue: "New Afrikan Shrine"
  },
  "eyoFestival.webp": {
    id: "event-8",
    name: "Eyo Festival",
    time: "9:00 AM",
    date: "2024-06-15",
    price: "₦150",
    status: "Sold Out",
    venue: "Lagos Island"
  },
  "beautifulNubia.webp": {
    id: "event-9",
    name: "Journey Into Sound",
    time: "7:00 PM",
    date: "2024-05-15",
    price: "₦120",
    status: "Still Selling",
    venue: "Motherlan'"
  },
  "blocParty.webp": {
    id: "event-10",
    name: "Eko For Show",
    time: "12:00 PM",
    date: "2024-04-15",
    price: "₦80",
    status: "Still Selling",
    venue: "The Park"
  },
  "stateoftheart.webp": {
    id: "event-11",
    name: "Art Workshop",
    time: "2:00 PM",
    date: "2024-03-15",
    price: "₦60",
    status: "Still Selling",
    venue: "The Art Studio"
  },
  "Osun.webp": {
    id: "event-12",
    name: "Osun Osogbo Festival",
    time: "8:00 AM",
    date: "2024-02-15",
    price: "₦100",
    status: "Sold Out",
    venue: "Osogbo Grove"
  }
};

// data for upcoming event
export const carouselImages = [
  {
    image: "/uploads/carouselAsset/tiwa.webp",
    name: "The Tiwa Savage Tour",
    eventDate: "2024-08-15"
  },
  {
    image: "/uploads/carouselAsset/diamondJimma.webp",
    name: "Awuyewuye Concert",
    eventDate: "2024-09-20"
  },
  {
    image: "/uploads/blogPageAsset/artGallery.webp",
    name: "Renaisance",
    eventDate: "2024-07-10"
  },
  {
    image: "/uploads/events/stagePlay.webp",
    name: "The Story Of Brother Jero",
    eventDate: "2024-10-05"
  },
  {
    image: "/uploads/blogPageAsset/dj.webp",
    name: "Dj Shadollar",
    eventDate: "2024-11-15"
  },
  {
    image: "/uploads/carouselAsset/sdc.webp",
    name: "SDC Music Fest",
    eventDate: "2024-06-25"
  },
  {
    image: "/uploads/carouselAsset/bandit-logo.webp",
    name: "Bandit: The Unvieling",
    eventDate: "2024-12-01"
  }
];

export function calculateDaysUntilEvent(eventDate) {
  const today = new Date();
  const event = new Date(eventDate);
  const timeDiff = event.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}