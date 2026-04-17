import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar as CalendarIcon, MapPin, ChevronLeft, ChevronRight, Clock, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // NEW: State to control the popup modal
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/operations/events');
        setEvents(data);
      } catch (error) { console.error('Failed to fetch events'); }
    };
    fetchEvents();
  }, []);

  const upcomingEvents = events.filter(e => new Date(e.date) >= new Date()).sort((a, b) => new Date(a.date) - new Date(b.date));
  const featuredEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null;

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const prevMonth = () => setCurrentDate(new Date(year, currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, currentDate.getMonth() + 1, 1));

  const getEventColor = (team) => {
    switch(team) {
      case 'Academics': return 'bg-itss-primary/20 border-itss-primary text-itss-primary hover:bg-itss-primary/40';
      case 'Wellness': return 'bg-itss-success/20 border-itss-success text-itss-success hover:bg-itss-success/40';
      case 'Events': return 'bg-itss-secondary/20 border-itss-secondary text-itss-secondary hover:bg-itss-secondary/40';
      case 'Research': return 'bg-itss-orange/20 border-itss-orange text-itss-orange hover:bg-itss-orange/40';
      case 'Executive': return 'bg-itss-danger/20 border-itss-danger text-itss-danger hover:bg-itss-danger/40';
      default: return 'bg-itss-gray border-zinc-500 text-zinc-300';
    }
  };

  return (
    <div className="min-h-screen bg-itss-black text-itss-white py-16 px-4 font-consolas">
      <div className="max-w-6xl mx-auto">
        
        <Link to="/" className="text-zinc-400 hover:text-white font-stencil text-xs uppercase mb-8 inline-block border-b border-zinc-600 pb-1">
          ← Return to Home
        </Link>
        
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-stencil text-itss-primary uppercase tracking-wider mb-4">Event Matrix</h1>
          <p className="font-consolas tracking-widest text-zinc-400">Society Schedule & Logistics</p>
        </div>

        {/* FEATURED EVENT SECTION */}
        {featuredEvent && (
          <div className="mb-16 bg-itss-dark border border-itss-gray shadow-neon flex flex-col md:flex-row relative overflow-hidden rounded-xl">
            <div className="absolute -right-10 -top-10 text-[10rem] opacity-5 font-stencil text-white select-none">
              {new Date(featuredEvent.date).getDate()}
            </div>
            
            <div className="bg-itss-primary text-itss-black p-8 md:p-12 flex flex-col justify-center items-center md:w-1/3">
              <span className="font-bold text-lg uppercase tracking-widest opacity-80">Next Transmission</span>
              <span className="text-7xl font-stencil mt-2">{new Date(featuredEvent.date).getDate()}</span>
              <span className="text-2xl font-bold uppercase">{new Date(featuredEvent.date).toLocaleString('default', { month: 'long' })}</span>
            </div>

            <div className="p-8 md:p-12 flex-1 flex flex-col justify-center z-10">
              <div className="inline-block px-3 py-1 bg-itss-gray text-zinc-300 font-stencil text-xs mb-4 w-fit border border-zinc-600">
                {featuredEvent.organizingSubcommittee}
              </div>
              <h2 className="text-3xl md:text-5xl font-stencil text-white uppercase mb-4">{featuredEvent.title}</h2>
              <p className="font-consolas text-zinc-300 mb-6 leading-relaxed max-w-xl">{featuredEvent.description}</p>
              
              <div className="flex flex-wrap gap-6 font-bold text-sm text-itss-primary">
                <div className="flex items-center gap-2"><Clock size={16}/> {new Date(featuredEvent.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                <div className="flex items-center gap-2"><MapPin size={16}/> {featuredEvent.location}</div>
              </div>
            </div>
          </div>
        )}

        {/* CALENDAR GRID */}
        <div className="bg-itss-dark border border-itss-gray p-4 md:p-8 rounded-xl shadow-lg">
          
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-itss-gray pb-4 gap-4">
            <h2 className="text-2xl md:text-3xl font-stencil uppercase tracking-widest text-white">{monthName} {year}</h2>
            <div className="flex gap-2">
              <button onClick={prevMonth} className="p-3 bg-itss-gray hover:bg-zinc-700 transition-colors text-itss-primary rounded"><ChevronLeft size={20}/></button>
              <button onClick={nextMonth} className="p-3 bg-itss-gray hover:bg-zinc-700 transition-colors text-itss-primary rounded"><ChevronRight size={20}/></button>
            </div>
          </div>

          <div className="overflow-x-auto pb-4">
            <div className="min-w-[700px]">

              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center font-stencil uppercase text-xs text-itss-primary py-2">{day}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2 auto-rows-fr">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`blank-${i}`} className="min-h-[100px] md:min-h-[120px] bg-itss-black border border-itss-gray/30"></div>
                ))}
                
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const dayEvents = events.filter(ev => {
                    const evDate = new Date(ev.date);
                    return evDate.getDate() === dayNum && evDate.getMonth() === currentDate.getMonth() && evDate.getFullYear() === year;
                  });

                  const isToday = new Date().getDate() === dayNum && new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === year;

                  return (
                    <div key={dayNum} className={`min-h-[100px] md:min-h-[120px] p-2 border ${isToday ? 'border-itss-primary bg-itss-primary/10' : 'border-itss-gray bg-itss-black'} flex flex-col`}>
                      <span className={`text-xs md:text-sm font-bold mb-2 ${isToday ? 'text-itss-primary' : 'text-zinc-500'}`}>{dayNum}</span>
                      
                      <div className="flex flex-col gap-1 overflow-y-auto">
                        {dayEvents.map(ev => (
                          <div 
                            key={ev._id} 
                            onClick={() => setSelectedEvent(ev)} 
                            className={`text-[9px] md:text-[11px] p-1 border-l-2 font-consolas truncate cursor-pointer ${getEventColor(ev.organizingSubcommittee)}`}
                          >
                            {ev.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* EVENT DETAILS MODAL POPUP */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-itss-dark border border-itss-gray shadow-neon w-full max-w-lg relative p-6 md:p-8 rounded-xl">
            <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
            
            <div className="inline-block px-3 py-1 bg-itss-black text-itss-primary font-stencil text-xs mb-4 border border-itss-primary/30">
              {selectedEvent.organizingSubcommittee}
            </div>
            
            <h2 className="text-3xl font-stencil text-white uppercase mb-4 pr-8">{selectedEvent.title}</h2>
            
            <div className="flex flex-col gap-3 font-mono text-sm text-zinc-300 mb-6 bg-itss-black p-4 border border-itss-gray/50 rounded">
              <div className="flex items-center gap-2">
                <CalendarIcon size={16} className="text-itss-primary"/> 
                {new Date(selectedEvent.date).toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-itss-primary"/> 
                {new Date(selectedEvent.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-itss-primary"/> 
                {selectedEvent.location}
              </div>
            </div>
            
            <p className="font-consolas text-zinc-400 leading-relaxed">
              {selectedEvent.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}