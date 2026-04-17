import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '', email: '', phoneNumber: '', 
    password: '', confirmPassword: '',
    team: 'Executive', title: 'President'
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    const result = await register(formData);
    if (result.success) {
      navigate('/dashboard'); 
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl bg-itss-white p-8 md:p-12 shadow-magazine-dark border-4 border-itss-black">
        
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-colossus text-itss-black uppercase tracking-wider mb-2">
            System Initialization
          </h2>
          <p className="font-stencil text-itss-dark uppercase tracking-widest text-sm">
            Create Super Admin Account
          </p>
        </div>

        {error && (
          <div className="bg-itss-black text-itss-white p-4 mb-6 font-mono text-sm border-l-4 border-red-500">
            ERROR: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-itss-black font-sans font-bold">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block uppercase tracking-widest text-xs mb-2">Full Name</label>
              <input type="text" name="name" required onChange={handleChange}
                className="w-full border-2 border-itss-black p-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-itss-black" />
            </div>
            <div>
              <label className="block uppercase tracking-widest text-xs mb-2">Email Address</label>
              <input type="email" name="email" required onChange={handleChange}
                placeholder="Enter email address"
                className="w-full border-2 border-itss-black p-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-itss-black" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block uppercase tracking-widest text-xs mb-2">Phone Number</label>
              <input type="tel" name="phoneNumber" required onChange={handleChange}
                className="w-full border-2 border-itss-black p-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-itss-black" />
            </div>
            
            {/* Added a split layout for Team and Title so it perfectly fits your roster */}
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block uppercase tracking-widest text-xs mb-2">Team</label>
                <select name="team" onChange={handleChange} className="w-full border-2 border-itss-black p-3 bg-transparent">
                  <option value="Executive">Executive</option>
                  <option value="Academics">Academics</option>
                  <option value="Events">Events</option>
                  <option value="Wellness">Wellness</option>
                  <option value="Research">Research</option>
                </select>
              </div>
              <div className="w-1/2">
                <label className="block uppercase tracking-widest text-xs mb-2">Title</label>
                <select name="title" onChange={handleChange} className="w-full border-2 border-itss-black p-3 bg-transparent">
                  <option value="President">President</option>
                  <option value="Vice Leader">Vice Leader</option>
                  <option value="Treasurer">Treasurer</option>
                  <option value="Secretary">Secretary</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block uppercase tracking-widest text-xs mb-2">Password</label>
              <input type="password" name="password" required onChange={handleChange}
                className="w-full border-2 border-itss-black p-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-itss-black" />
            </div>
            <div>
              <label className="block uppercase tracking-widest text-xs mb-2">Confirm Password</label>
              <input type="password" name="confirmPassword" required onChange={handleChange}
                className="w-full border-2 border-itss-black p-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-itss-black" />
            </div>
          </div>

          {/* Password Hint Box */}
          <div className="text-xs text-itss-dark font-mono bg-gray-100 p-3 border-l-4 border-itss-black mt-2">
            <span className="font-bold">SECURITY CLEARANCE RULES:</span> Password must be at least 8 characters long and include an uppercase letter, lowercase letter, number, and special character (@$!%*?&#). Email must be an official @vossie.net or @gmail.com address.
          </div>

          <button type="submit" 
            className="w-full bg-itss-black text-itss-white py-4 uppercase font-stencil tracking-widest text-lg hover:bg-itss-dark transition-colors mt-8 shadow-magazine cursor-pointer">
            [ Initialize Profile ]
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;