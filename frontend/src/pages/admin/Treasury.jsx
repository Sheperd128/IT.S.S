import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { DollarSign, CheckCircle, XCircle, Plus, Minus, X, MessageSquare } from 'lucide-react';

export default function Treasury() {
  const { user } = useContext(AuthContext);
  const [claims, setClaims] = useState([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [formData, setFormData] = useState({ title: '', description: '', amount: '' });
  
  // Budget Adjustment State
  const [adjustAmount, setAdjustAmount] = useState('');

  // Review Modal State
  const [reviewModal, setReviewModal] = useState({ isOpen: false, claim: null, action: '', note: '' });

  // Security Flags
  const canApprove = user?.team === 'Executive' && ['President', 'Vice President', 'Treasurer'].includes(user?.title);
  // Strictly President or Treasurer for modifying the actual bank account limits
  const canModifyBudget = user?.team === 'Executive' && ['President', 'Treasurer'].includes(user?.title);

  useEffect(() => { 
    fetchClaims(); 
    fetchBudget();
  }, []);

  const fetchClaims = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('https://itss-backend-upy6.onrender.com/api/treasury', config);
      setClaims(data);
    } catch (error) { console.error('Failed to fetch claims'); }
  };

  const fetchBudget = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('https://itss-backend-upy6.onrender.com/api/treasury/budget', config);
      setTotalBudget(data.totalBudget);
    } catch (error) { console.error('Failed to fetch budget'); }
  };

  // --- CLAIM SUBMISSION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('https://itss-backend-upy6.onrender.com/api/treasury', formData, config);
      setFormData({ title: '', description: '', amount: '' });
      fetchClaims();
      alert("Fund request submitted to Treasury.");
    } catch (error) { alert('Failed to submit claim.'); }
  };

  // --- BUDGET ADJUSTMENT ---
  const handleBudgetAdjust = async (type) => {
    if (!adjustAmount || isNaN(adjustAmount) || adjustAmount <= 0) return alert('Enter a valid amount.');
    const amountToApply = type === 'add' ? Number(adjustAmount) : -Number(adjustAmount);
    
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put('https://itss-backend-upy6.onrender.com/api/treasury/budget', { amount: amountToApply }, config);
      setAdjustAmount('');
      fetchBudget();
    } catch (error) { alert('Failed to adjust budget'); }
  };

  // --- CLAIM REVIEW PROCESSING ---
  const openReviewModal = (claim, action) => {
    setReviewModal({ isOpen: true, claim, action, note: '' });
  };

  const submitReview = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`https://itss-backend-upy6.onrender.com/api/treasury/${reviewModal.claim._id}/status`, { 
        status: reviewModal.action,
        reviewerNote: reviewModal.note 
      }, config);
      setReviewModal({ isOpen: false, claim: null, action: '', note: '' });
      fetchClaims();
    } catch (error) { alert('Failed to process review'); }
  };

  // Math for the Dashboard
  const approvedTotal = claims.filter(c => c.status === 'Approved').reduce((acc, curr) => acc + curr.amount, 0);
  const pendingTotal = claims.filter(c => c.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0);
  const availableBalance = totalBudget - approvedTotal;

  return (
    <div className="text-itss-white font-consolas relative">
      <div className="mb-8 border-l-4 border-itss-primary pl-4">
        <h1 className="text-4xl font-stencil uppercase text-itss-white tracking-widest">Treasury Dept.</h1>
        <p className="text-zinc-400 text-sm">Financial logs and fund request approvals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-itss-dark border border-itss-gray p-6 shadow-neon relative">
          <p className="font-stencil text-zinc-500 text-xs mb-1 uppercase">Available Balance</p>
          <p className={`text-3xl font-bold mb-2 ${availableBalance < 0 ? 'text-itss-danger' : 'text-itss-primary'}`}>
            R {availableBalance.toLocaleString()}
          </p>
          
          {/* BUDGET CONTROLS (Only visible to Pres/Treasurer) */}
          {canModifyBudget && (
            <div className="mt-4 pt-4 border-t border-itss-gray">
              <p className="font-stencil text-[10px] text-zinc-500 mb-2 uppercase">Adjust Master Budget</p>
              <div className="flex items-center gap-2">
                <input 
                  type="number" value={adjustAmount} onChange={e => setAdjustAmount(e.target.value)} 
                  className="w-full bg-itss-black border border-itss-gray p-2 text-white focus:outline-none text-xs" placeholder="Amount..." 
                />
                <button onClick={() => handleBudgetAdjust('add')} className="bg-itss-success/20 text-itss-success border border-itss-success p-2 hover:bg-itss-success hover:text-black transition-colors"><Plus size={16}/></button>
                <button onClick={() => handleBudgetAdjust('subtract')} className="bg-itss-danger/20 text-itss-danger border border-itss-danger p-2 hover:bg-itss-danger hover:text-white transition-colors"><Minus size={16}/></button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-itss-dark border border-itss-gray p-6">
          <p className="font-stencil text-zinc-500 text-xs mb-1 uppercase">Total Allocated</p>
          <p className="text-3xl font-bold text-itss-white mb-2">R {approvedTotal.toLocaleString()}</p>
        </div>
        <div className="bg-itss-dark border border-itss-gray p-6">
          <p className="font-stencil text-zinc-500 text-xs mb-1 uppercase">Pending Requests</p>
          <p className="text-3xl font-bold text-itss-warning mb-2">R {pendingTotal.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CLAIMS FEED */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-stencil uppercase text-white mb-4 border-b border-itss-gray pb-2">Active Ledger</h2>
          {claims.length === 0 ? (
            <div className="bg-itss-dark border border-itss-gray p-8 text-center text-zinc-500">No transactions recorded.</div>
          ) : (
            claims.map(claim => (
              <div key={claim._id} className={`bg-itss-dark border-l-4 border-y border-r border-itss-gray p-5 flex flex-col md:flex-row justify-between gap-4 ${claim.status === 'Approved' ? 'border-l-itss-success' : claim.status === 'Rejected' ? 'border-l-itss-danger' : 'border-l-itss-warning'}`}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-itss-black border border-zinc-600 text-zinc-300 font-stencil text-[10px] px-2 py-1 uppercase">{claim.subcommittee}</span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 ${claim.status === 'Approved' ? 'bg-itss-success/20 text-itss-success' : claim.status === 'Rejected' ? 'bg-itss-danger/20 text-itss-danger' : 'bg-itss-warning/20 text-itss-warning'}`}>
                      {claim.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-white">{claim.title}</h3>
                  <p className="text-sm text-zinc-400 mb-2">{claim.description}</p>
                  
                  {/* DISPLAY REVIEWER NOTE IF IT EXISTS */}
                  {claim.reviewerNote && claim.status !== 'Pending' && (
                    <div className="mt-3 bg-itss-black border border-zinc-800 p-3 flex gap-3 items-start">
                      <MessageSquare size={16} className={claim.status === 'Approved' ? 'text-itss-success' : 'text-itss-danger'} />
                      <div>
                        <p className="text-[10px] font-stencil text-zinc-500 uppercase mb-1">Treasury Note:</p>
                        <p className="text-xs text-zinc-300 font-sans italic">"{claim.reviewerNote}"</p>
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-zinc-500 mt-4">Requested by: {claim.requestedBy} on {new Date(claim.createdAt).toLocaleDateString()}</p>
                </div>
                
                <div className="flex flex-col items-end justify-between min-w-[120px]">
                  <span className="text-2xl font-bold text-itss-white font-mono">R {claim.amount}</span>
                  
                  {canApprove && claim.status === 'Pending' && (
                    <div className="flex flex-col gap-2 mt-4 w-full">
                      <button onClick={() => openReviewModal(claim, 'Approved')} className="w-full text-itss-success border border-itss-success hover:bg-itss-success hover:text-black py-2 flex justify-center items-center gap-2 text-xs font-bold uppercase transition-colors">
                        <CheckCircle size={14}/> Approve
                      </button>
                      <button onClick={() => openReviewModal(claim, 'Rejected')} className="w-full text-itss-danger border border-itss-danger hover:bg-itss-danger hover:text-white py-2 flex justify-center items-center gap-2 text-xs font-bold uppercase transition-colors">
                        <XCircle size={14}/> Deny
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* SUBMIT CLAIM FORM */}
        <div className="bg-itss-dark border border-itss-gray p-6 h-fit sticky top-24 shadow-neon rounded-xl">
          <h3 className="text-xl font-stencil uppercase text-white mb-6 flex items-center gap-2">
            <DollarSign size={20} className="text-itss-primary"/> Request Funds
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-stencil text-zinc-400 mb-1">Request Title</label>
              <input type="text" required value={formData.title} onChange={e=>setFormData({...formData, title:e.target.value})} className="w-full bg-itss-black border border-itss-gray p-3 text-white focus:border-itss-primary focus:outline-none" placeholder="e.g. Hackathon Catering" />
            </div>
            
            <div>
              <label className="block text-xs font-stencil text-zinc-400 mb-1">Estimated Cost (ZAR)</label>
              <div className="flex items-center bg-itss-black border border-itss-gray focus-within:border-itss-primary">
                <span className="text-zinc-500 font-bold ml-4">R</span>
                <input type="number" required value={formData.amount} onChange={e=>setFormData({...formData, amount:e.target.value})} className="w-full bg-transparent p-3 text-white focus:outline-none font-mono" placeholder="0.00" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-stencil text-zinc-400 mb-1">Detailed Justification</label>
              <textarea required value={formData.description} onChange={e=>setFormData({...formData, description:e.target.value})} className="w-full bg-itss-black border border-itss-gray p-3 text-white h-24 focus:border-itss-primary focus:outline-none" placeholder="Breakdown of costs..." />
            </div>

            <button type="submit" className="bg-itss-primary text-itss-black font-bold uppercase tracking-widest px-8 py-4 w-full hover:bg-white transition-colors">
              Submit Claim
            </button>
          </form>
        </div>
      </div>

      {/* --- REVIEW MODAL (POPUP) --- */}
      {reviewModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-md bg-itss-dark border-2 p-6 rounded-xl shadow-2xl relative ${reviewModal.action === 'Approved' ? 'border-itss-success' : 'border-itss-danger'}`}>
            <button onClick={() => setReviewModal({isOpen: false, claim: null, action: '', note: ''})} className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors">
              <X size={24} />
            </button>

            <h2 className={`text-2xl font-stencil uppercase mb-2 ${reviewModal.action === 'Approved' ? 'text-itss-success' : 'text-itss-danger'}`}>
              {reviewModal.action === 'Approved' ? 'Approve Funds' : 'Deny Request'}
            </h2>
            <p className="text-zinc-400 text-sm mb-6">Provide a mandatory note for the {reviewModal.claim.subcommittee} team regarding this decision.</p>

            <div className="bg-itss-black border border-itss-gray p-4 mb-6">
              <p className="font-bold text-white mb-1">{reviewModal.claim.title}</p>
              <p className="font-mono text-itss-warning">R {reviewModal.claim.amount}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-stencil text-zinc-400 mb-1">Reviewer Note (Required)</label>
                <textarea 
                  required 
                  value={reviewModal.note} 
                  onChange={e => setReviewModal({...reviewModal, note: e.target.value})} 
                  className="w-full bg-itss-black border border-itss-gray p-3 text-white h-24 focus:outline-none focus:border-white" 
                  placeholder="Explain why this is approved or denied..." 
                />
              </div>
              
              <button 
                onClick={submitReview}
                disabled={!reviewModal.note.trim()}
                className={`w-full py-4 font-bold uppercase tracking-widest transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${reviewModal.action === 'Approved' ? 'bg-itss-success text-black hover:bg-white' : 'bg-itss-danger text-white hover:bg-white hover:text-black'}`}
              >
                Confirm {reviewModal.action}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}