import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { FileText, Upload, Trash2, Copy, Lock, Globe, Users, Loader, Link as LinkIcon, HardDrive } from 'lucide-react';

export default function DocumentVault() {
  const { user } = useContext(AuthContext);
  const [documents, setDocuments] = useState([]);
  const [activeTab, setActiveTab] = useState('Meeting Minutes');
  const [uploading, setUploading] = useState(false); 
  
  // NEW: Toggle between 'file' and 'link'
  const [uploadMethod, setUploadMethod] = useState('file'); 
  
  const [formData, setFormData] = useState({ 
    title: '', category: 'Meeting Minutes', fileUrl: '', textContent: '', 
    visibility: 'Public', targetSubcommittee: 'All' 
  });

  const canUpload = user?.team === 'Executive' || user?.title === 'Lead' || user?.title === 'Deputy Lead';

  useEffect(() => { fetchDocuments(); }, []);

  const fetchDocuments = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('https://itss-backend-upy6.onrender.com/api/documents', config);
      setDocuments(data);
    } catch (error) { console.error('Failed to fetch docs'); }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('document', file); 
    setUploading(true);

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post('https://itss-backend-upy6.onrender.com/api/upload', uploadData, config);
      
      setFormData({ ...formData, fileUrl: data });
      setUploading(false);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'File upload failed. Ensure it is a valid format.');
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.category !== 'Comms' && !formData.fileUrl) {
      return alert("Please provide a file or a link.");
    }

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('https://itss-backend-upy6.onrender.com/api/documents', formData, config);
      
      // NEW: Log this action to the Audit system silently
      await axios.post('https://itss-backend-upy6.onrender.com/api/audit', {
        action: `Uploaded a new ${formData.category}`,
        details: `Document: ${formData.title}`
      }, config).catch(() => {}); // Ignore audit errors so it doesn't break upload

      setFormData({ title: '', category: 'Meeting Minutes', fileUrl: '', textContent: '', visibility: 'Public', targetSubcommittee: 'All' });
      fetchDocuments();
      alert("Record secured in Vault.");
    } catch (error) { alert('Upload failed'); }
  };

  const deleteDoc = async (id, title) => {
    if (!window.confirm('Permanently archive this record?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`https://itss-backend-upy6.onrender.com/api/documents/${id}`, config);
      
      // Audit Log
      await axios.post('https://itss-backend-upy6.onrender.com/api/audit', {
        action: `Deleted a document`, details: `Document: ${title}`
      }, config).catch(() => {});

      fetchDocuments();
    } catch (error) { alert('Archive failed'); }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard for WhatsApp!');
  };

  const filteredDocs = documents.filter(d => d.category === activeTab);

  return (
    <div className="text-itss-white font-consolas relative">
      <div className="mb-8 border-l-4 border-itss-primary pl-4 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-stencil uppercase text-itss-white tracking-widest">Document Vault</h1>
          <p className="text-zinc-400 text-sm">Secure repository for minutes, policies, and comms.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* VAULT FEED */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-wrap gap-2 border-b border-itss-gray pb-4">
            {['Meeting Minutes', 'Official Policy', 'Template', 'Comms'].map(tab => (
              <button 
                key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-stencil text-xs uppercase tracking-widest transition-colors ${activeTab === tab ? 'bg-itss-primary text-itss-black' : 'bg-itss-dark border border-itss-gray text-zinc-400 hover:text-white'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredDocs.length === 0 ? (
              <div className="bg-itss-dark border border-itss-gray p-8 text-center text-zinc-500">No records found in this sector.</div>
            ) : (
              filteredDocs.map(doc => (
                <div key={doc._id} className="bg-itss-dark border border-itss-gray p-5 shadow-neon relative group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <FileText className="text-itss-primary" size={24}/>
                      <div>
                        <h3 className="font-bold text-lg text-white">{doc.title}</h3>
                        <p className="text-xs text-zinc-400">By {doc.uploadedBy} ({doc.uploaderTeam}) - {new Date(doc.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-itss-black border border-zinc-700">
                      {doc.visibility === 'ExecOnly' ? <><Lock size={10} className="text-itss-danger"/> Execs</> : 
                       doc.visibility === 'SubcommitteeOnly' ? <><Users size={10} className="text-itss-warning"/> {doc.targetSubcommittee}</> : 
                       <><Globe size={10} className="text-itss-success"/> Public</>}
                    </div>
                  </div>

                  {doc.category === 'Comms' && doc.textContent ? (
                    <div className="mt-4 bg-itss-black border border-zinc-800 p-4">
                      <p className="text-sm text-zinc-300 font-sans italic whitespace-pre-wrap">{doc.textContent}</p>
                      <button onClick={() => copyToClipboard(doc.textContent)} className="mt-3 flex items-center gap-2 text-xs text-itss-primary hover:text-white transition-colors uppercase font-bold">
                        <Copy size={14}/> Copy for WhatsApp
                      </button>
                    </div>
                  ) : doc.fileUrl ? (
                    <a href={doc.fileUrl.startsWith('http') ? doc.fileUrl : `https://itss-backend-upy6.onrender.com${doc.fileUrl}`} target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm text-itss-primary hover:text-white transition-colors font-bold uppercase tracking-widest">
                      [ Access Attached Record ]
                    </a>
                  ) : null}

                  {canUpload && (
                    <button onClick={() => deleteDoc(doc._id, doc.title)} className="absolute bottom-4 right-4 text-zinc-600 hover:text-itss-danger opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={16}/>
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* UPLOAD FORM */}
        {canUpload && (
          <div className="bg-itss-dark border border-itss-gray p-6 h-fit sticky top-24 shadow-neon rounded-xl">
            <h3 className="text-xl font-stencil uppercase text-white mb-6 flex items-center gap-2">
              <Upload size={20} className="text-itss-primary"/> Secure New Record
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-stencil text-zinc-400 mb-1">Document Title</label>
                <input type="text" required value={formData.title} onChange={e=>setFormData({...formData, title:e.target.value})} className="w-full bg-itss-black border border-itss-gray p-3 text-white focus:border-itss-primary focus:outline-none" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-stencil text-zinc-400 mb-1">Category</label>
                  <select value={formData.category} onChange={e=>setFormData({...formData, category:e.target.value})} className="w-full bg-itss-black border border-itss-gray p-3 text-white focus:border-itss-primary focus:outline-none">
                    <option value="Meeting Minutes">Minutes</option>
                    <option value="Official Policy">Policy</option>
                    <option value="Template">Template</option>
                    <option value="Comms">WhatsApp Comms</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-stencil text-zinc-400 mb-1">Access Level</label>
                  <select value={formData.visibility} onChange={e=>setFormData({...formData, visibility:e.target.value})} className="w-full bg-itss-black border border-itss-gray p-3 text-white focus:border-itss-primary focus:outline-none">
                    <option value="Public">General / Public</option>
                    <option value="SubcommitteeOnly">Subcommittee Only</option>
                    <option value="ExecOnly">Executive Only</option>
                  </select>
                </div>
              </div>

              {formData.visibility === 'SubcommitteeOnly' && (
                 <div>
                  <label className="block text-xs font-stencil text-zinc-400 mb-1">Target Team</label>
                  <select value={formData.targetSubcommittee} onChange={e=>setFormData({...formData, targetSubcommittee:e.target.value})} className="w-full bg-itss-black border border-itss-gray p-3 text-white focus:border-itss-primary focus:outline-none">
                    <option value="Academics">Academics</option>
                    <option value="Events">Events</option>
                    <option value="Wellness">Wellness</option>
                    <option value="Research">Research</option>
                  </select>
                </div>
              )}

              {/* DYNAMIC UPLOAD SECTION */}
              {formData.category === 'Comms' ? (
                <div>
                  <label className="block text-xs font-stencil text-zinc-400 mb-1">Pre-written Message</label>
                  <textarea required value={formData.textContent} onChange={e=>setFormData({...formData, textContent:e.target.value})} className="w-full bg-itss-black border border-itss-gray p-3 text-white h-32 focus:border-itss-primary focus:outline-none" placeholder="Draft WhatsApp message here..." />
                </div>
              ) : (
                <div className="bg-itss-black border border-itss-gray p-4">
                  
                  {/* File vs Link Toggle */}
                  <div className="flex gap-2 mb-4 border-b border-zinc-800 pb-3">
                    <button type="button" onClick={() => setUploadMethod('file')} className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 ${uploadMethod === 'file' ? 'bg-itss-primary text-black' : 'bg-zinc-900 text-zinc-500 hover:text-white'}`}>
                      <HardDrive size={14}/> File
                    </button>
                    <button type="button" onClick={() => setUploadMethod('link')} className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 ${uploadMethod === 'link' ? 'bg-itss-primary text-black' : 'bg-zinc-900 text-zinc-500 hover:text-white'}`}>
                      <LinkIcon size={14}/> URL Link
                    </button>
                  </div>

                  {uploadMethod === 'file' ? (
                    <div>
                      <label className="block text-xs font-stencil text-itss-primary mb-2 uppercase">Select Local File</label>
                      <input 
                        type="file" accept=".pdf,.zip,.txt,.doc,.docx" onChange={uploadFileHandler} 
                        className="w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-bold file:bg-itss-primary file:text-itss-black hover:file:bg-white cursor-pointer" 
                      />
                      <p className="text-[10px] text-zinc-500 mt-2 uppercase tracking-widest">Formats allowed: PDF, ZIP, TXT, DOC, DOCX</p>
                      {uploading && <p className="text-xs text-itss-warning mt-2 flex items-center gap-2 font-bold"><Loader size={14} className="animate-spin" /> Uploading to server...</p>}
                      {formData.fileUrl && !uploading && !formData.fileUrl.startsWith('http') && <p className="text-xs text-itss-success mt-2 font-bold flex items-center gap-1">✓ File Attached</p>}
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-stencil text-itss-primary mb-2 uppercase">External Link (Google Drive, Docs)</label>
                      <input 
                        type="url" 
                        value={formData.fileUrl} 
                        onChange={e => setFormData({...formData, fileUrl: e.target.value})} 
                        className="w-full bg-itss-dark border border-zinc-700 p-2 text-white focus:outline-none focus:border-itss-primary text-sm" 
                        placeholder="https://..." 
                      />
                    </div>
                  )}
                </div>
              )}

              <button 
                type="submit" 
                disabled={uploading || (formData.category !== 'Comms' && !formData.fileUrl)}
                className="bg-itss-primary text-itss-black font-bold uppercase tracking-widest px-8 py-4 w-full hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-magazine-dark"
              >
                Encrypt & Save
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}