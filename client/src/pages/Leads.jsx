import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { Plus, Search, Trash2, Phone, Mail, FileText, Users, Filter, MoreHorizontal, CheckCircle2, Clock, XCircle, MessageSquare } from 'lucide-react';

const Leads = () => {
    const [leads, setLeads] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        status: 'New',
        notes: ''
    });

    const fetchLeads = React.useCallback(async () => {
        try {
            const res = await API.get('/api/leads');
            setLeads(res.data);
        } catch (_err) {
            console.error(_err);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchLeads();
        }, 0);
        return () => clearTimeout(timer);
    }, [fetchLeads]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/api/leads', formData);
            fetchLeads();
            setShowForm(false);
            setFormData({ name: '', contact: '', status: 'New', notes: '' });
        } catch {
            console.error('Error saving lead');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this inquiry record from CRM?')) return;
        try {
            await API.delete(`/api/leads/${id}`);
            fetchLeads();
        } catch {
            console.error('Delete failed');
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            await API.put(`/api/leads/${id}`, { status: newStatus });
            fetchLeads();
        } catch {
            console.error('Update failed');
        }
    };

    const filteredLeads = leads.filter(l =>
        l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.contact.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusConfig = (status) => {
        switch (status) {
            case 'New': return { color: 'text-violet-400 bg-violet-400/10 border-violet-400/20', icon: Clock };
            case 'Contacted': return { color: 'text-blue-400 bg-blue-400/10 border-blue-400/20', icon: MessageSquare };
            case 'Converted': return { color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', icon: CheckCircle2 };
            case 'Lost': return { color: 'text-rose-400 bg-rose-400/10 border-rose-400/20', icon: XCircle };
            default: return { color: 'text-slate-400 bg-slate-400/10 border-slate-400/20', icon: MoreHorizontal };
        }
    };

    return (
        <div className="pt-32 pb-20 px-4">
            <div className="container mx-auto max-w-7xl">

                {/* CRM Header Dashboard */}
                <div className="glass-card p-8! mb-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-secondary/20 rounded-2xl flex items-center justify-center text-secondary shadow-cyan">
                                <Users size={24} />
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight">Client Hub</h1>
                        </div>
                        <p className="text-slate-500 text-sm font-medium">Strategic Relationship Management & Conversion Pipeline</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="relative group">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-secondary transition-colors" />
                            <input
                                type="text"
                                placeholder="Filter records..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input-field p-3.5! pl-11! sm:w-64"
                            />
                        </div>
                        <button
                            className="btn-secondary py-3.5! px-6! whitespace-nowrap"
                            onClick={() => setShowForm(!showForm)}
                        >
                            <Plus size={20} />
                            Register Entry
                        </button>
                    </div>
                </div>

                {/* Entry Form Modal Drawer */}
                <div className={`transition-all duration-500 overflow-hidden ${showForm ? 'max-h-[600px] mb-10 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="glass-card p-10! border-secondary/20 bg-secondary/5">
                        <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-secondary rounded-full"></span>
                            Intelligence Gathering
                        </h3>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Subject Name</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Enter full name"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="input-field p-3.5! rounded-xl!"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Contact Protocol</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Phone or Digitized Mail"
                                    value={formData.contact}
                                    onChange={e => setFormData({ ...formData, contact: e.target.value })}
                                    className="input-field p-3.5! rounded-xl!"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Pipeline Status</label>
                                <select
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    className="input-field p-3.5! rounded-xl! appearance-none cursor-pointer"
                                >
                                    <option value="New">Initial Contact</option>
                                    <option value="Contacted">Active Discussion</option>
                                    <option value="Converted">Closed Successfully</option>
                                    <option value="Lost">Archive / Lost</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Context Notes</label>
                                <input
                                    type="text"
                                    placeholder="Brief brief..."
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                    className="input-field p-3.5! rounded-xl!"
                                />
                            </div>
                            <div className="lg:col-span-4 flex justify-end gap-3 mt-4">
                                <button type="button" className="btn-outline py-3!" onClick={() => setShowForm(false)}>Abort</button>
                                <button type="submit" className="btn-secondary py-3! px-10!">Commit Registry</button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* CRM Records Table */}
                <div className="table-container">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="table-header pl-8">Inquiry Subject</th>
                                <th className="table-header">Communication</th>
                                <th className="table-header">Pipeline Stage</th>
                                <th className="table-header hidden xl:table-cell">Observer Notes</th>
                                <th className="table-header pr-8 text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLeads.map(lead => {
                                const status = getStatusConfig(lead.status);
                                return (
                                    <tr key={lead._id} className="table-row group">
                                        <td className="p-6 pl-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold group-hover:bg-secondary/20 group-hover:text-secondary transition-colors border border-white/5">
                                                    {lead.name?.charAt(0).toUpperCase() || '?'}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white text-lg tracking-tight">{lead.name || 'Unknown Subject'}</div>
                                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Reg: {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'N/A'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex flex-col gap-1">
                                                <div className="text-sm font-bold text-slate-300">{lead.contact || 'No Protocol'}</div>
                                                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 italic">
                                                    <Phone size={10} /> Secure Line Active
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <select
                                                    className={`appearance-none bg-transparent border-none font-black text-[10px] uppercase tracking-widest cursor-pointer outline-none px-3 py-1.5 rounded-full border border-current ${status.color}`}
                                                    value={lead.status}
                                                    onChange={(e) => updateStatus(lead._id, e.target.value)}
                                                >
                                                    <option value="New">Initial</option>
                                                    <option value="Contacted">Active</option>
                                                    <option value="Converted">Won</option>
                                                    <option value="Lost">Lost</option>
                                                </select>
                                                <status.icon size={16} className={status.color.split(' ')[0]} />
                                            </div>
                                        </td>
                                        <td className="p-6 text-slate-400 text-sm italic font-medium hidden xl:table-cell max-w-[200px] truncate">
                                            {lead.notes || 'No telemetry data provided'}
                                        </td>
                                        <td className="p-6 pr-8 text-right">
                                            <button
                                                className="w-10 h-10 inline-flex items-center justify-center rounded-xl bg-red-500/5 text-red-500/30 hover:bg-red-500 hover:text-white transition-all duration-300 transform group-hover:scale-110"
                                                onClick={() => handleDelete(lead._id)}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {filteredLeads.length === 0 && (
                        <div className="p-24 text-center space-y-4">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto opacity-20">
                                <Users size={32} />
                            </div>
                            <p className="text-slate-600 font-black uppercase tracking-[0.3em] text-[10px]">Registry Empty | Standby for input</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Leads;
