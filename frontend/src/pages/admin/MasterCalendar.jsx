import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { Calendar as CalendarIcon, MapPin, Trash2, ChevronLeft, ChevronRight, Clock, X } from 'lucide-react';

export default function MasterCalendar() {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('');
  const [formData, setFormData] = useState({ title: '', description: '', location: '', organizingSubcommittee: user?.team || 'Events' });

  // Secretaries can edit/create (but it goes to Pending status)
  const canEdit = user?.team === 'Executive' || ['Lead', 'Deputy Lead', 'Secretary'].includes(user?.title);
  // Only Pres, VP, and Exec Secretary can approve
  const canApprove = user?.team === 'Executive' && ['President', 'Vice President', 'Secretary'].includes(user?.title);

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await axios.get('https://itss-backend-upy6.onrender.com/api/operations/events');
      setEvents(data);
    } catch (error) { console.error('Failed to fetch events'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formDate || !formTime) return alert("Please select both a date and a time.");

    try {
      const combinedDate = new Date(`${formDate}T${formTime}`).toISOString();
      const payload = { ...formData, date: combinedDate };

      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('https://itss-backend-upy6.onrender.com/api/operations/events', payload, config);
      
      setFormData({ title: '', description: '', location: '', organizingSubcommittee: user?.team || 'Events' });
      setFormDate('');
      setFormTime('');
      fetchEvents();
      alert("Event Scheduled! (Sent for Exec Approval if you are a regular Secretary).");
    } catch (error) { 
      alert(error.response?.data?.message || 'Database rejected the payload. Check your inputs.'); 
    }
  };

  const approveEvent = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`https://itss-backend-upy6.onrender.com/api/operations/events/${id}/status`, { status: 'Approved' }, config);
      fetchEvents();
      setSelectedEvent(null); // Close modal on approve
    } catch (error) { alert('Approval failed'); }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`https://itss-backend-upy6.onrender.com/api/operations/events/${id}`, config);
      fetchEvents();
      setSelectedEvent(null);
    } catch (error) { alert('Delete failed'); }
  };

  const upcomingEvents = events.filter(e => new Date(e.date) >= new Date() && e.status === 'Approved').sort((a, b) => new Date(a.date) - new Date(b.date));
  const featuredEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null;

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const prevMonth = () => setCurrentDate(new Date(year, currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, currentDate.getMonth() + 1, 1));

  const handleDayClick = (dayNum) => {
    if (!canEdit) return;
    const selectedDate = new Date(year, currentDate.getMonth(), dayNum);
    const formatted = new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
    setFormDate(formatted);
  };

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
    <div className="text-itss-white font-consolas relative pb-20">
      <div className="mb-8 border-l-4 border-itss-primary pl-4">
        <h1 className="text-4xl font-stencil uppercase text-itss-white tracking-widest">Master Calendar</h1>
        <p className="text-zinc-400 text-sm">Unified society scheduling grid.</p>
      </div>

      {featuredEvent && (
        <div className="mb-10 bg-itss-dark border border-itss-gray shadow-neon flex flex-col md:flex-row relative overflow-hidden">
          <div className="bg-itss-primary text-itss-black p-6 md:p-8 flex flex-col justify-center items-center md:w-1/4">
            <span className="font-bold text-xs uppercase tracking-widest opacity-80">Next Event</span>
            <span className="text-5xl font-stencil mt-1">{new Date(featuredEvent.date).getDate()}</span>
            <span className="text-xl font-bold uppercase">{new Date(featuredEvent.date).toLocaleString('default', { month: 'short' })}</span>
          </div>
          <div className="p-6 md:p-8 flex-1 flex flex-col justify-center z-10">
            <div className="inline-block px-2 py-1 bg-itss-gray text-zinc-300 font-stencil text-[10px] mb-3 w-fit border border-zinc-600">
              {featuredEvent.organizingSubcommittee}
            </div>
            <h2 className="text-2xl md:text-3xl font-stencil text-itss-white uppercase mb-2">{featuredEvent.title}</h2>
            <div className="flex flex-wrap gap-4 text-xs text-itss-primary">
              <div className="flex items-center gap-1"><Clock size={14}/> {new Date(featuredEvent.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
              <div className="flex items-center gap-1"><MapPin size={14}/> {featuredEvent.location}</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 bg-itss-dark border border-itss-gray p-4 shadow-magazine-dark">
          
          <div className="flex justify-between items-center mb-6 border-b border-itss-gray pb-4">
            <h2 className="text-2xl md:text-3xl font-stencil uppercase tracking-widest text-itss-white">{monthName} {year}</h2>
            <div className="flex gap-2">
              <button onClick={prevMonth} className="p-2 bg-itss-gray hover:bg-zinc-700 transition-colors rounded"><ChevronLeft size={24} className="text-itss-primary"/></button>
              <button onClick={nextMonth} className="p-2 bg-itss-gray hover:bg-zinc-700 transition-colors rounded"><ChevronRight size={24} className="text-itss-primary"/></button>
            </div>
          </div>

          <div className="overflow-x-auto pb-2">
            <div className="min-w-[700px]">
              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center font-stencil uppercase text-xs text-itss-primary py-2">{day}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2 auto-rows-fr">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`blank-${i}`} className="min-h-[120px] bg-itss-black border border-itss-gray/50"></div>
                ))}
                
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const dayEvents = events.filter(ev => {
                    const evDate = new Date(ev.date);
                    return evDate.getDate() === dayNum && evDate.getMonth() === currentDate.getMonth() && evDate.getFullYear() === year;
                  });

                  const isToday = new Date().getDate() === dayNum && new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === year;

                  return (
                    <div 
                      key={dayNum} 
                      onClick={() => handleDayClick(dayNum)}
                      className={`min-h-[120px] p-2 border flex flex-col transition-colors ${canEdit ? 'cursor-pointer hover:border-itss-gray' : ''} ${isToday ? 'border-itss-primary bg-itss-primary/10' : 'border-itss-gray bg-itss-black'}`}
                    >
                      <span className={`text-sm font-bold mb-2 ${isToday ? 'text-itss-primary' : 'text-zinc-400'}`}>{dayNum}</span>
                      
                      <div className="flex flex-col gap-1 overflow-y-auto">
                        {dayEvents.map(ev => (
                          <div 
                            key={ev._id} 
                            onClick={(e) => { e.stopPropagation(); setSelectedEvent(ev); }} 
                            className={`text-[10px] p-1 border-l-2 font-consolas truncate cursor-pointer ${ev.status === 'Pending' ? 'bg-itss-warning/20 border-itss-warning text-itss-warning border-dashed' : getEventColor(ev.organizingSubcommittee)}`}
                          >
                            {ev.status === 'Pending' && '⚠️ '} 
                            {new Date(ev.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {ev.title}
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

        {canEdit && (
          <div className="bg-itss-dark border border-itss-gray p-6 h-fit sticky top-24 shadow-neon rounded-lg">
            <h3 className="text-xl font-stencil uppercase text-itss-white mb-6 flex items-center gap-2">
              <CalendarIcon size={20} className="text-itss-primary"/> Schedule Event
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-stencil text-zinc-400 mb-1">Event Name</label>
                <input type="text" required value={formData.title} onChange={e=>setFormData({...formData, title:e.target.value})} className="w-full bg-itss-black border border-itss-gray p-3 text-itss-white focus:border-itss-primary focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-stencil text-zinc-400 mb-1">Date</label>
                  <input type="date" required value={formDate} onChange={e=>setFormDate(e.target.value)} className="w-full bg-itss-black border border-itss-gray p-3 text-itss-white focus:border-itss-primary focus:outline-none font-mono text-xs cursor-pointer" />
                </div>
                <div>
                  <label className="block text-xs font-stencil text-zinc-400 mb-1">Time</label>
                  <input type="time" required value={formTime} onChange={e=>setFormTime(e.target.value)} className="w-full bg-itss-black border border-itss-gray p-3 text-itss-white focus:border-itss-primary focus:outline-none font-mono text-xs cursor-pointer" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-stencil text-zinc-400 mb-1">Location</label>
                <div className="flex items-center bg-itss-black border border-itss-gray focus-within:border-itss-primary">
                  <MapPin size={16} className="text-zinc-500 ml-3" />
                  <input type="text" required value={formData.location} onChange={e=>setFormData({...formData, location:e.target.value})} className="w-full bg-transparent p-3 text-itss-white focus:outline-none" placeholder="Lab 4 / Discord" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-stencil text-zinc-400 mb-1">Team</label>
                <select value={formData.organizingSubcommittee} onChange={e=>setFormData({...formData, organizingSubcommittee:e.target.value})} className="w-full bg-itss-black border border-itss-gray p-3 text-itss-white focus:border-itss-primary focus:outline-none">
                  <option value="Executive">Executive</option>
                  <option value="Academics">Academics</option>
                  <option value="Events">Events</option>
                  <option value="Wellness">Wellness</option>
                  <option value="Research">Research</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-stencil text-zinc-400 mb-1">Description</label>
                <textarea required value={formData.description} onChange={e=>setFormData({...formData, description:e.target.value})} className="w-full bg-itss-black border border-itss-gray p-3 text-itss-white h-24 focus:border-itss-primary focus:outline-none" />
              </div>
              <button type="submit" className="bg-itss-primary text-itss-black font-bold uppercase tracking-widest px-8 py-4 w-full hover:bg-white transition-colors">
                Publish Event
              </button>
            </form>
          </div>
        )}
      </div>

      {/* EVENT DETAILS MODAL POPUP */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`bg-itss-dark border shadow-neon w-full max-w-lg relative p-6 md:p-8 rounded-xl ${selectedEvent.status === 'Pending' ? 'border-itss-warning' : 'border-itss-gray'}`}>
            <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
            
            <div className="flex gap-2 mb-4">
              <div className="inline-block px-3 py-1 bg-itss-black text-itss-primary font-stencil text-xs border border-itss-primary/30">
                {selectedEvent.organizingSubcommittee}
              </div>
              {selectedEvent.status === 'Pending' && (
                <div className="inline-block px-3 py-1 bg-itss-warning/20 text-itss-warning font-stencil text-xs border border-itss-warning uppercase">
                  Pending Exec Approval
                </div>
              )}
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
            
            <p className="font-consolas text-zinc-400 leading-relaxed mb-8 border-l-2 border-itss-gray pl-4">
              {selectedEvent.description}
            </p>

            <div className="flex flex-col md:flex-row gap-3">
              {canApprove && selectedEvent.status === 'Pending' && (
                <button 
                  onClick={() => approveEvent(selectedEvent._id)} 
                  className="flex-1 flex justify-center items-center gap-2 bg-itss-success text-itss-black py-3 font-bold uppercase tracking-widest hover:bg-white transition-all rounded"
                >
                  Approve Request
                </button>
              )}

              {canEdit && (
                <button 
                  onClick={() => deleteEvent(selectedEvent._id)} 
                  className="flex-1 flex justify-center items-center gap-2 bg-itss-danger/10 text-itss-danger border border-itss-danger/50 py-3 font-bold uppercase tracking-widest hover:bg-itss-danger hover:text-white transition-all rounded"
                >
                  <Trash2 size={18} /> Terminate
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}