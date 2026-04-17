import { useParams, Link } from 'react-router-dom';

const subData = {
  academics: {
    title: 'Academics',
    tagline: 'Bridging the gap between theory and industry.',
    mission: 'Our focus is to ensure no coder is left behind. We provide the resources, tutorials, and peer support needed to excel in the IT faculty.',
    initiatives: ['MERN Stack & Web Dev Bootcamps', 'Unity Game Development Workshops', 'Peer-to-Peer Tutoring Sessions', 'Exam Prep & Code Reviews']
  },
  wellness: {
    title: 'Wellness',
    tagline: 'Healthy minds write healthy code.',
    mission: 'We believe in balancing screen time with physical and mental well-being. We organize activities to keep the society active and engaged outside the IDE.',
    initiatives: ['Inter-faculty Basketball & Soccer', 'Valorant & Esports LAN Tournaments', 'Mental Health & Tech-Break Seminars', 'Campus Hikes & Socials']
  },
  events: {
    title: 'Events',
    tagline: 'Building the culture of the IT faculty.',
    mission: 'We are the architects of the student experience, planning everything from massive hackathons to casual networking evenings.',
    initiatives: ['Annual 24-Hour Hackathons', 'Tech Networking Mixers', 'End-of-Year IT Gala', 'Guest Speaker Panels']
  },
  research: {
    title: 'Research & Support',
    tagline: 'The analytical engine of the society.',
    mission: 'We support the other subcommittees by conducting student feedback research, securing sponsorships, contacting external companies and speakers, and organizing our community outreach programs.',
    initiatives: ['Corporate Sponsorship Acquisition', 'Student Feedback Analytics', 'Industry Speaker Outreach', 'Community Tech Programs']
  }
};

export default function Subcommittee() {
  const { name } = useParams();
  const data = subData[name.toLowerCase()];

  if (!data) return <div className="text-white text-center py-20 font-colossus text-3xl">Subcommittee Not Found</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="text-zinc-400 hover:text-white font-mono text-xs uppercase mb-8 inline-block border-b border-zinc-600 pb-1">
          ← Return to Home
        </Link>
        
        <div className="mb-12 border-l-4 border-white pl-6">
          <h1 className="text-5xl md:text-7xl font-colossus text-white uppercase tracking-wider">{data.title}</h1>
          <p className="font-stencil tracking-widest text-zinc-400 mt-2">{data.tagline}</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-8 shadow-magazine-dark mb-8">
          <h2 className="text-2xl font-bold uppercase text-white mb-4">Mission Directive</h2>
          <p className="font-mono text-zinc-300 leading-relaxed">{data.mission}</p>
        </div>

        <div>
          <h2 className="text-2xl font-colossus uppercase text-white mb-6">Core Initiatives</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.initiatives.map((item, index) => (
              <div key={index} className="border border-zinc-700 bg-zinc-900 p-6 flex items-center gap-4 hover:border-white transition-colors">
                <div className="font-colossus text-3xl text-zinc-700">0{index + 1}</div>
                <div className="font-bold uppercase tracking-wider">{item}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}