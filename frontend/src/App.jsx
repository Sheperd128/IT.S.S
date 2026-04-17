import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext'; // Theme Provider
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout'; 

// Subcommittee Pages
import Academics from './pages/subcommittees/Academics';
import EventsSub from './pages/subcommittees/EventsSub';
import Wellness from './pages/subcommittees/Wellness';
import Research from './pages/subcommittees/Research';

// Public Pages
import Home from './pages/public/Home';
import Register from './pages/public/Register';
import Login from './pages/public/Login';
import Join from './pages/public/Join';
import MeetTheTeam from './pages/public/MeetTheTeam';
import Events from './pages/public/Events';
import Profile from './pages/public/Profile'; // NEW: Profile Import

// Arcade
import ArcadeHub from './pages/arcade/ArcadeHub';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import TeamManager from './pages/admin/TeamManager';
import ProgressSheet from './pages/admin/ProgressSheet';
import SubcommitteeEditor from './pages/admin/SubcommitteeEditor';
import Settings from './pages/admin/Settings'; 
import MasterCalendar from './pages/admin/MasterCalendar';
import Treasury from './pages/admin/Treasury';
import DocumentVault from './pages/admin/DocumentVault';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col bg-itss-black">
            <Navbar />
            
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/join" element={<Join />} />
                <Route path="/team" element={<MeetTheTeam />} />
                <Route path="/events" element={<Events />} />
                
                {/* NEW: Profile Route */}
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                
                {/* Custom Subcommittee Pages */}
                <Route path="/subcommittee/academics" element={<Academics />} />
                <Route path="/subcommittee/events" element={<EventsSub />} />
                <Route path="/subcommittee/wellness" element={<Wellness />} />    
                <Route path="/subcommittee/research" element={<Research />} />    

                {/* The Arcade (For General Students) */}
                <Route path="/arcade" element={<ProtectedRoute><ArcadeHub /></ProtectedRoute>} />

                {/* ADMIN ROUTES (Wrapped in the Sidebar Layout) */}
                <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                  <Route index element={<Dashboard />} />
                  <Route path="tasks" element={<ProgressSheet />} />
                  <Route path="subcommittee-edit" element={<SubcommitteeEditor />} />
                  <Route path="team" element={<TeamManager />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="calendar" element={<MasterCalendar />} />
                  <Route path="treasury" element={<Treasury />} />
                  <Route path="vault" element={<DocumentVault />} />
                </Route>
                
              </Routes>
            </main>
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;