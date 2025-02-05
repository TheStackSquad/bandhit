// src/app/talents/page.jsx
import VideoReel from '@/components/UI/reels';

const TalentsPage = () => {
  // This would typically come from an API or database
  const reels = [
    {
      id: 1,
      videoUrl: '/videos/performance1.mp4',
      userAvatar: '/uploads/dashboardDefault/Ayinla.webp',
      username: 'EgunMogaji',
      description: 'Vintage Apala "E Wa Gbo Orin Tuntun"',
      timestamp: '2 hours ago',
      likes: 834,
      comments: 655,
      shares: 1205,
    },
    {
      id: 2,
      videoUrl: '/videos/performance2.mp4',
      userAvatar: '/uploads/dashboardDefault/salawaAbeni.webp',
      username: 'Waka Queen',
      description: 'Original song - "Senior Ladies Medley"',
      timestamp: '5 hours ago',
      likes: 556,
      comments: 228,
      shares: 89,
    },
    // Add more reels as needed
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Discover Talents</h1>
        <div className="space-y-6">
          {reels.map((reel) => (
            <VideoReel
              key={reel.id}
              {...reel}
              isOrganizer={true} // This would typically be determined by user role
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TalentsPage;