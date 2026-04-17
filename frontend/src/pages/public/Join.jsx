import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Join = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Notice we hardcode team: 'General' and title: 'Member' here
  const [formData, setFormData] = useState({
    name: '', email: '', phoneNumber: '', password: '', confirmPassword: '',
    team: 'General', title: 'Member'
  });
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) return setError('Passwords do not match');

    const result = await register(formData);
    if (result.success) {
      navigate('/dashboard'); // This will route them to the Game Hub automatically based on their role
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl bg-itss-white p-8 md:p-12 shadow-magazine-dark border-4 border-itss-black">
        
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-colossus text-itss-black uppercase tracking-wider mb-2">
            Join The Network
          </h2>
          <p className="font-stencil text-itss-dark uppercase tracking-widest text-sm">
            Student Registration Portal
          </p>
        </div>

        {error && <div className="bg-itss-black text-itss-white p-4 mb-6 font-mono text-sm border-l-4 border-red-500">ERROR: {error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6 text-itss-black font-sans font-bold">
          <div>
            <label className="block uppercase tracking-widest text-xs mb-2">Full Name</label>
            <input type="text" name="name" required onChange={handleChange} className="w-full border-2 border-itss-black p-3 bg-transparent" />
          </div>
          <div>
            <label className="block uppercase tracking-widest text-xs mb-2">Student Email (@vossie.net)</label>
            <input type="email" name="email" required onChange={handleChange} className="w-full border-2 border-itss-black p-3 bg-transparent" />
          </div>
          <div>
            <label className="block uppercase tracking-widest text-xs mb-2">Phone Number</label>
            <input type="tel" name="phoneNumber" required onChange={handleChange} className="w-full border-2 border-itss-black p-3 bg-transparent" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block uppercase tracking-widest text-xs mb-2">Password</label>
              <input type="password" name="password" required onChange={handleChange} className="w-full border-2 border-itss-black p-3 bg-transparent" />
            </div>
            <div>
              <label className="block uppercase tracking-widest text-xs mb-2">Confirm Password</label>
              <input type="password" name="confirmPassword" required onChange={handleChange} className="w-full border-2 border-itss-black p-3 bg-transparent" />
            </div>
          </div>

          <button type="submit" className="w-full bg-itss-black text-itss-white py-4 uppercase font-stencil tracking-widest text-lg hover:bg-itss-dark transition-colors shadow-magazine mt-4">
            [ Create Account ]
          </button>
        </form>
      </div>
    </div>
  );
};

export default Join;