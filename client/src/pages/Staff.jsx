import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { Plus, Trash2, Key, Shield, User, Fingerprint, Calendar, Clock, AlertCircle, X, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Staff = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(null);
    const [formData, setFormData] = useState({
        username: '', password: '', role: 'employee'
    });
    const [newPassword, setNewPassword] = useState('');

    const fetchUsers = React.useCallback(async () => {
        try {
            const res = await API.get('/api/users');
            setUsers(res.data);
        } catch (_err) {
            console.error(_err);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers();
        }, 0);
        return () => clearTimeout(timer);
    }, [fetchUsers]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/api/users', formData);
            fetchUsers();
            setShowForm(false);
            setFormData({ username: '', password: '', role: 'employee' });
        } catch {
            console.error('Error adding staff');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Terminate this user access?')) return;
        try {
            await API.delete(`/api/users/${id}`);
            fetchUsers();
        } catch {
            console.error('Error deleting staff');
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        try {
            await API.put(`/api/users/${showPasswordModal}/password`, { password: newPassword });
            setShowPasswordModal(null);
            setNewPassword('');
        } catch {
            console.error('Error updating password');
        }
    };

    if (user?.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="glass-card p-12! text-center max-w-lg border-red-500/20">
                    <AlertCircle size={64} className="text-red-500 mx-auto mb-6" />
                    <h1 className="text-3xl font-bold mb-4">Access Restricted</h1>
                    <p className="text-slate-500 font-medium">This terminal requires high-level administrative clearance. Your attempt has been logged.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20 px-4">
            <div className="container mx-auto max-w-7xl">

                {/* Admin Header */}
                <div className="glass-card p-8! mb-10 border-primary/20 bg-primary/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center text-primary shadow-violet">
                            <Shield size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Access Control</h1>
                            <p className="text-slate-500 text-sm font-medium">User provisioning and security management</p>
                        </div>
                    </div>
                    <button
                        className="btn-primary px-8! py-4!"
                        onClick={() => setShowForm(!showForm)}
                    >
                        <Plus size={20} />
                        provision account
                    </button>
                </div>

                {/* Provisioning Form */}
                <div className={`transition-all duration-500 overflow-hidden ${showForm ? 'max-h-[500px] mb-10 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="glass-card p-10! border-primary/20 bg-primary/5">
                        <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                            <Fingerprint className="text-primary" /> Security Credential Generation
                        </h3>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">System Identity</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Unique user identifier"
                                    value={formData.username}
                                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                                    className="input-field p-3.5! rounded-xl!"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Initial Key</label>
                                <input
                                    required
                                    type="password"
                                    placeholder="Secure string"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    className="input-field p-3.5! rounded-xl!"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Logic Role</label>
                                <select
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    className="input-field p-3.5! rounded-xl! appearance-none cursor-pointer"
                                >
                                    <option value="employee">Standard User</option>
                                    <option value="admin">System Architect</option>
                                </select>
                            </div>
                            <div className="md:col-span-3 flex justify-end gap-3 pt-4 border-t border-white/5">
                                <button type="button" className="btn-outline py-3!" onClick={() => setShowForm(false)}>Cancel</button>
                                <button type="submit" className="btn-primary py-3! px-10!">Finalize Access</button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Users Table */}
                <div className="table-container">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="table-header pl-8">Internal UID</th>
                                <th className="table-header">Identity</th>
                                <th className="table-header">Clearance Level</th>
                                <th className="table-header">Registration</th>
                                <th className="table-header pr-8 text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id} className="table-row group">
                                    <td className="p-6 pl-8">
                                        <div className="font-mono text-[10px] font-black text-slate-600 group-hover:text-primary transition-colors">
                                            MEM_ID_{u._id.slice(-8).toUpperCase()}
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all border border-white/5 font-bold">
                                                {u.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="font-bold text-white tracking-tight flex items-center gap-2">
                                                {u.username}
                                                {u.username === user.username && (
                                                    <span className="text-[8px] px-2 py-0.5 bg-primary/20 text-primary border border-primary/20 rounded-full font-black tracking-widest">ACTIVE TERMINAL</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${u.role === 'admin' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-400/20' : 'bg-blue-500/10 text-blue-400 border-blue-400/20'}`}>
                                            {u.role === 'admin' ? <span className="flex items-center gap-1.5"><Shield size={12} /> ARCHITECT</span> : <span className="flex items-center gap-1.5"><User size={12} /> OPERATOR</span>}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                                            <Calendar size={12} className="text-slate-600" />
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="p-6 pr-8 text-right">
                                        <div className="flex gap-2 justify-end">
                                            <button
                                                className="btn-outline py-2! px-3! text-[10px]! rounded-lg! border-white/5 hover:border-primary/50 text-slate-500 hover:text-primary"
                                                onClick={() => setShowPasswordModal(u._id)}
                                            >
                                                <Key size={14} /> RESET KEY
                                            </button>
                                            {u.username !== 'admin' && u.username !== user.username && (
                                                <button
                                                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-500/5 text-red-500/30 hover:bg-red-500 hover:text-white transition-all group-hover:scale-110"
                                                    onClick={() => handleDelete(u._id)}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Password Reset Portal */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" onClick={() => setShowPasswordModal(null)}></div>
                    <div className="glass-card w-full max-w-md p-1 relative border-primary/20 overflow-hidden animate-float">
                        <div className="p-8 space-y-8">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-bold flex items-center gap-3">
                                        <Key className="text-primary" /> Key Rebuild
                                    </h3>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Generating new secure fragment</p>
                                </div>
                                <button onClick={() => setShowPasswordModal(null)} className="p-2 hover:bg-white/5 rounded-full text-slate-500 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handlePasswordChange} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">New Secure Cipher</label>
                                    <input
                                        type="password"
                                        required
                                        className="input-field p-4!"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Input new strong key string"
                                        autoFocus
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button type="button" className="btn-outline flex-1" onClick={() => setShowPasswordModal(null)}>Abort</button>
                                    <button type="submit" className="btn-primary flex-1">Update Core</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Staff;
