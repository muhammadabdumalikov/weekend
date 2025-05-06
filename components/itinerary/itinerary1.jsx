import { useState } from 'react';

export default function TravelItinerary() {
  const [activeDay, setActiveDay] = useState(1);
  
  const itineraryData = [
    {
      day: 1,
      title: "Airport Pick Up",
      description: "Like on all of our trips, we can collect you from the airport when you land and take you directly to your hotel. The first Day is just a check-in Day so you have this freedom to explore the city and get settled in. The first Day is just a check-in Day so you have this freedom to explore the city and get settled in.",
      highlight: true
    },
    {
      day: 2,
      title: "Temples & River Cruise",
      description: "Visit the stunning temples of Thailand and enjoy a relaxing river cruise.",
      highlight: false
    },
    {
      day: 3,
      title: "Massage & Overnight Train",
      description: "Experience traditional Thai massage and travel on an overnight train.",
      highlight: false
    },
    {
      day: 4,
      title: "Khao Sok National Park",
      description: "Explore the beautiful landscapes of Khao Sok National Park.",
      highlight: false
    },
    {
      day: 5,
      title: "Travel to Koh Phangan",
      description: "Journey to the tropical island paradise of Koh Phangan.",
      highlight: false
    },
    {
      day: 6,
      title: "Morning Chill & Muay Thai Lesson",
      description: "Relax in the morning and learn the basics of Muay Thai.",
      highlight: false
    },
    {
      day: 7,
      title: "Island Boat Trip",
      description: "Enjoy a day exploring nearby islands by boat.",
      highlight: true
    }
  ];

  return (
    <div className="mt-6">      
      <div className="relative overflow-hidden max-w-[80%]">
        {/* Vertical line that spans the entire timeline */}
        <div className="absolute left-3 top-5 bottom-5 border-l-2 border-dashed border-orange-500 h-full"></div>
        
        {itineraryData.map((day, index) => (
          <div key={day.day} className="relative flex mb-2 last:mb-0 justify-center">
            {/* Circle marker */}
            <div className="relative flex-shrink-0 mr-6 mt-1">
              <div 
                className={`w-6 h-6 rounded-full flex items-center justify-center z-10 
                  ${day.highlight 
                    ? 'bg-orange-500' 
                    : 'border-2 border-orange-500 bg-white'}
                `}
                onClick={() => setActiveDay(day.day)}
              >
                {day.highlight && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 pb-4 items-start">
              <div className="fw-500 mb-2">
                Day {day.day}: {day.title}
              </div>
              {(activeDay === day.day || day.day === 1) && (
                <p className="text-gray-700">{day.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}