import React from 'react';
import Layout from '../components/Layout';
import { Calendar, MapPin, Clock } from 'lucide-react';

const TrainingEvents = () => {
  const events = [
    {
      id: 1,
      title: "Advanced Front Office Management",
      date: "Nov 15, 2023",
      time: "09:00 AM - 04:00 PM",
      location: "Kigali Convention Centre",
      price: "50,000 RWF",
      image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Workshop"
    },
    {
      id: 2,
      title: "Housekeeping Excellence Certification",
      date: "Nov 22, 2023",
      time: "08:30 AM - 05:00 PM",
      location: "Proline Training Center",
      price: "45,000 RWF",
      image: "https://images.unsplash.com/photo-1584622050111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Certification"
    },
    {
      id: 3,
      title: "Revenue Management Masterclass",
      date: "Dec 05, 2023",
      time: "10:00 AM - 03:00 PM",
      location: "Online (Zoom)",
      price: "30,000 RWF",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Masterclass"
    }
  ];

  return (
    <Layout>
      <div className="bg-navy-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">Training & Events</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Upskill with our industry-leading workshops, certifications, and networking events.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow group">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-gold-500 text-navy-900 text-xs font-bold px-3 py-1 rounded-full uppercase">
                  {event.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-navy-900 mb-2 line-clamp-2">{event.title}</h3>
                
                <div className="space-y-2 text-sm text-gray-600 mb-6">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gold-500" />
                    {event.date}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gold-500" />
                    {event.time}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gold-500" />
                    {event.location}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-lg font-bold text-navy-900">{event.price}</span>
                  <button className="text-gold-600 font-bold hover:text-gold-700 text-sm uppercase tracking-wide">
                    Register Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default TrainingEvents;
