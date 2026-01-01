import React, { useState } from 'react';
import { Calendar, User, Phone, FileText, CheckCircle, ArrowLeft, Heart, Sparkles, ShieldCheck } from 'lucide-react';
import API from '../api/axios';
import { Link } from 'react-router-dom';

const BookAppointment = () => {
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        date: '',
        reason: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/api/public/appointment', formData);
            setSubmitted(true);
        } catch {
            console.error('Error booking appointment.');
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]"></div>
                <div className="glass-card max-w-md w-full text-center p-12 relative z-10 animate-float border-emerald-500/20">
                    <div className="w-24 h-24 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/10 border border-emerald-500/20">
                        <CheckCircle size={48} className="text-emerald-500" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4 tracking-tight">Protocol Initiated</h2>
                    <p className="text-slate-400 font-medium mb-10 leading-relaxed">
                        Diagnostics request received. A medical coordinator will reach out to <span className="text-emerald-400 font-bold">{formData.contact}</span> shortly.
                    </p>
                    <Link to="/login" className="btn-primary w-full bg-emerald-600! shadow-emerald-600/20! hover:shadow-emerald-600/40!">
                        Finalize & Exit
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative py-20 px-4 overflow-x-hidden">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[10%] left-[5%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-[150px]"></div>
                <div className="absolute bottom-[10%] right-[5%] w-[30%] h-[30%] bg-secondary/10 rounded-full blur-[150px]"></div>
            </div>

            <div className="container mx-auto max-w-2xl relative z-10">
                <Link to="/login" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-12 font-bold group">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary transition-all">
                        <ArrowLeft size={16} />
                    </div>
                    System Access
                </Link>

                <div className="glass-card p-12! border-primary/20 shadow-violet">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6 ring-1 ring-primary/20">
                            <Sparkles size={12} /> Diagnostic Scheduler
                        </div>
                        <h1 className="text-4xl font-bold mb-4 tracking-tight">Medical Clearance Request</h1>
                        <p className="text-slate-500 font-medium">Coordinate your specialized diagnostics with precision</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Legal Identity</label>
                                <div className="relative group">
                                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="text"
                                        required
                                        placeholder="Full Name"
                                        className="input-field p-3.5! pl-12!"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Contact Link</label>
                                <div className="relative group">
                                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-secondary transition-colors" />
                                    <input
                                        type="tel"
                                        required
                                        placeholder="Mobile Protocol"
                                        className="input-field p-3.5! pl-12!"
                                        value={formData.contact}
                                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Preferred Timeline</label>
                            <div className="relative group">
                                <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="date"
                                    required
                                    className="input-field pl-12! "
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Diagnostic Context</label>
                            <div className="relative group">
                                <FileText size={18} className="absolute left-4 top-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                                <textarea
                                    rows="4"
                                    placeholder="Briefly state symbols or symptoms..."
                                    className="input-field p-3.5! pl-12! resize-none"
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                ></textarea>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button type="submit" className="btn-primary w-full py-5! text-lg! rounded-2xl! group shadow-violet from-primary via-indigo-600 to-primary-dark">
                                INITIALIZE REQUEST
                                <ShieldCheck size={22} className="group-hover:scale-125 transition-transform" />
                            </button>
                        </div>
                    </form>

                    <div className="mt-12 flex items-center justify-between px-2 opacity-50">
                        <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest">
                            <Heart size={12} className="text-red-500" /> Human Centric Logistics
                        </div>
                        <div className="text-[8px] font-black uppercase tracking-widest">
                            © 2026 MediStore Industries
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookAppointment;
