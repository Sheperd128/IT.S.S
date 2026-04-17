import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await login(formData);
    if (result.success) {
      // Route based on role
      const storedUser = JSON.parse(localStorage.getItem('userInfo'));
      if (storedUser.team === 'Executive') {
        navigate('/admin'); 
      } else {
        navigate('/arcade');
      }
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-zinc-950">
      <div className="w-full max-w-md bg-zinc-900 p-8 md:p-12 border-2 border-zinc-700 shadow-xl">
        
        <div className="text-center mb-10">
          <h2 className="text-4xl font-colossus text-white uppercase tracking-wider mb-2">HUB ACCESS</h2>
          <p className="font-stencil text-zinc-400 uppercase tracking-widest text-sm">Authorized Personnel Only</p>
        </div>

        {error && <div className="bg-red-900/20 text-red-400 p-4 mb-6 font-mono text-sm border-l-4 border-red-500">ERROR: {error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6 text-white font-sans font-bold">
          <div>
            <label className="block font-stencil tracking-widest text-xs mb-2 text-zinc-400">Email Address</label>
            <input type="email" name="email" required onChange={handleChange} className="w-full border border-zinc-700 p-3 bg-zinc-950 focus:outline-none focus:border-white" />
          </div>

          <div>
            <label className="block font-stencil tracking-widest text-xs mb-2 text-zinc-400">Password</label>
            <input type="password" name="password" required onChange={handleChange} className="w-full border border-zinc-700 p-3 bg-zinc-950 focus:outline-none focus:border-white" />
          </div>

          <button type="submit" className="w-full bg-white text-black py-4 uppercase font-bold tracking-widest hover:bg-zinc-300 transition-colors mt-4">
            Authenticate
          </button>
        </form>

        {/* ADDED SIGNUP LINK */}
        <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
          <p className="font-mono text-xs text-zinc-400 mb-2">Not registered in the system?</p>
          <Link to="/join" className="font-stencil uppercase tracking-widest text-sm text-white hover:underline">
            Join The Network →
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;