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