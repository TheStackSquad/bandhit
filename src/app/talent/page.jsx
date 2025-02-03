// src/app/talents/page.jsx
import VideoReel from '@/components/UI/reels';

const TalentsPage = () => {
  // This would typically come from an API or database
  const reels = [
    {
      id: 1,
      videoUrl: '/videos/performance1.mp4',
      userAvatar: '/avatars/user1.jpg',
      username: 'sarah_dancer',
      description: 'Contemporary dance performance to "The Swan"',
      timestamp: '2 hours ago',
      likes: 234,
      comments: 45,
      shares: 12,
    },
    {
      id: 2,
      videoUrl: '/videos/performance2.mp4',
      userAvatar: '/avatars/user2.jpg',
      username: 'mike_vocals',
      description: 'Original song - "Summer Nights"',
      timestamp: '5 hours ago',
      likes: 156,
      comments: 28,
      shares: 8,
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