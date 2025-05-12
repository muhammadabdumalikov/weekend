import { useState } from 'react';

export default function TravelItinerary() {
  const [activeDay, setActiveDay] = useState(1);
  
  const itineraryData = [
    {
      title: "Airport Pick Up (35 minutes)",
      description: "Like on all of our trips, we can collect you from the airport when you land and take you directly to your hotel. The first Day is just a check-in Day so you have this freedom to explore the city and get settled in. The first Day is just a check-in Day so you have this freedom to explore the city and get settled in.",
      highlight: true
    },
    {
      title: "Temples & River Cruise (40 minutes)",
      description: "Visit the stunning temples of Thailand and enjoy a relaxing river cruise.",
      highlight: false
    },
    {
      title: "Massage & Overnight Train (1 hour)",
      description: "Experience traditional Thai massage and travel on an overnight train.",
      highlight: false
    },
    {
      title: "Khao Sok National Park (40 minutes)",
      description: "Explore the beautiful landscapes of Khao Sok National Park.",
      highlight: false
    },
    {
      title: "Travel to Koh Phangan (3 hours)",
      description: "Journey to the tropical island paradise of Koh Phangan.",
      highlight: false
    },
    {
      title: "Morning Chill & Muay Thai Lesson (1 hour)",
      description: "Relax in the morning and learn the basics of Muay Thai.",
      highlight: false
    },
    {
      title: "Island Boat Trip (1 hour)",
      description: "Enjoy a day exploring nearby islands by boat.",
      highlight: true
    }
  ];

  return (
    <div className="mt-6">      
      <div className="relative overflow-hidden max-w-[80%]">
        {/* Vertical line that spans the entire timeline */}
        <div className="ml-10 absolute left-3 top-5 border-l-2 border-dashed border-orange-500 h-full"></div>
        
        {itineraryData.map((day, index) => (
          <div key={index} className="pl-10 pt-10 relative flex mb-2 last:mb-0 justify-center">
            {/* Circle marker */}
            <div className="relative flex-shrink-0 mr-6 mt-1">
              {/* Add animation only to the first circle */}
              {index === 0 && (
                <span className="absolute inline-flex h-5 w-5 rounded-full bg-orange-500 opacity-90 animate-ping left-0.5 top-0.5"></span>
              )}
              <div 
                className={`w-6 h-6 rounded-full flex items-center justify-center z-10 
                  ${day.highlight 
                    ? 'bg-orange-500'
                    : 'border-2 border-orange-500 bg-white'}
                `}
                onClick={() => setActiveDay(index + 1)}
              >
                {/* {day.highlight && <div className="w-2 h-2 bg-white rounded-full"></div>} */}
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 pb-4 items-start">
              <div className="fw-500 mb-2">
                {day.title}
              </div>
              {(activeDay === index + 1 || index === 0) && (
                <p className="text-gray-700">{day.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}