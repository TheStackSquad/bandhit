// src/components/welcomeLayout/vendorFeatures.jsx

'use client';
import Image from "next/image";

const VendorFeatures = () => {
    // Mock vendors (replace with real data)
    const vendors = [
      {
        id: 1,
        name: "DJ Spark",
        service: "Music & Entertainment",
        rating: "⭐️⭐️⭐️⭐️⭐️",
        image: "/uploads/welcomeAsset/djPose_2_11zon.webp",
      },
      {
        id: 2,
        name: "Catering Delight",
        service: "Food & Beverages",
        rating: "⭐️⭐️⭐️⭐️",
        image: "/uploads/welcomeAsset/catering_11zon.webp",
      },
      {
        id: 3,
        name: "Photo Magic",
        service: "Photography",
        rating: "⭐️⭐️⭐️⭐️⭐️",
        image: "/uploads/welcomeAsset/photography_11zon.webp",
      },
    ];
  
    return (
      <div className="py-12 bg-gray-50">
        {/* Headline */}
        <h2 className="text-3xl font-bold text-center mb-8">
          For Vendors & Entertainers – Elevate Your Reach
        </h2>
  
        <div className="w-full px-4 mb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {vendors.map((vendor) => (
          <div
            key={vendor.id}
            className="w-full bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col items-center p-6 min-h-[250px]"
          >
            <div className="relative w-24 h-24 mb-4 flex-shrink-0">
              <Image
                src={vendor.image}
                alt={vendor.name}
                fill
                priority
                sizes="(max-width: 640px) 96px, (max-width: 1024px) 128px, 150px"
                className="rounded-full object-cover border-2 border-gray-100"
              />
            </div>
            <div className="flex flex-col items-center flex-grow">
              <h3 className="text-xl font-semibold text-center line-clamp-1">{vendor.name}</h3>
              <p className="text-sm text-gray-600 text-center mt-2 line-clamp-2">{vendor.service}</p>
              <p className="text-yellow-500 mt-auto pt-4">{vendor.rating}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  
        {/* How It Works */}
        <div className="max-w-3xl mx-auto mb-12 px-4">
          <h3 className="text-2xl font-bold text-center mb-6">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <span className="text-4xl mb-4">1</span>
              <h4 className="text-xl font-semibold">Create Profile</h4>
              <p className="text-gray-600">Showcase your services and portfolio.</p>
            </div>
            <div className="text-center">
              <span className="text-4xl mb-4">2</span>
              <h4 className="text-xl font-semibold">Get Discovered</h4>
              <p className="text-gray-600">Connect with event organizers.</p>
            </div>
            <div className="text-center">
              <span className="text-4xl mb-4">3</span>
              <h4 className="text-xl font-semibold">Get Hired</h4>
              <p className="text-gray-600">Secure bookings and grow your business.</p>
            </div>
          </div>
        </div>
  
        {/* Pricing Plans */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">Pricing Plans</h3>
          <p className="text-gray-600 mb-6">
            Choose a plan that suits your needs.{" "}
            <a href="/pricing" className="text-blue-600 hover:underline">
              View Full Pricing
            </a>
          </p>
        </div>
      </div>
    );
  };
  
  export default VendorFeatures;