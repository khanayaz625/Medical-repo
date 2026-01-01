import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { Printer, Activity, FileText, Stethoscope, PlusCircle, Share2, ClipboardList, Check, X, ArrowRight, ShieldCheck, Heart, User } from 'lucide-react';

const CHECKUP_TYPES = [
    { id: 'cbc', name: 'Hematology Panel (CBC)', price: 15, sub: 'Complete Blood Count Analysis' },
    { id: 'widal', name: 'Widal Serology', price: 12, sub: 'Typhoid Detection Protocol' },
    { id: 'fullbody', name: 'Comprehensive Bio-Care', price: 60, sub: 'Full System Diagnostic' },
    { id: 'sugar', name: 'Glucose Homeostasis', price: 8, sub: 'Blood Sugar Fasting' },
    { id: 'lipid', name: 'Cardiovascular Lipid', price: 25, sub: 'Lipid Profile Analysis' },
    { id: 'thyroid', name: 'Endocrine Thyroid', price: 20, sub: 'Thyroid Function Protocol' },
    { id: 'liver', name: 'Hepatic Function (LFT)', price: 18, sub: 'Liver Diagnostic Suite' }
];

const Checkups = () => {
    const [checkups, setCheckups] = useState([]);
    const [formData, setFormData] = useState({
        patientName: '',
        age: '',
        gender: 'Male',
        contact: '',
        selectedCheckups: []
    });
    const [viewReport, setViewReport] = useState(null);
    const fetchCheckups = React.useCallback(async () => {
        try {
            const res = await API.get('/api/checkups');
            setCheckups(res.data);
        } catch (_err) {
            console.error(_err);
        }
    }, []);

    const CURRENCY = '₹';

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchCheckups();
        }, 0);
        return () => clearTimeout(timer);
    }, [fetchCheckups]);

    const calculateTotal = () => {
        return formData.selectedCheckups.reduce((acc, id) => {
            const type = CHECKUP_TYPES.find(t => t.id === id);
            return acc + (type ? type.price : 0);
        }, 0);
    };

    const handleCheckboxChange = (id) => {
        setFormData(prev => {
            if (prev.selectedCheckups.includes(id)) {
                return { ...prev, selectedCheckups: prev.selectedCheckups.filter(x => x !== id) };
            } else {
                return { ...prev, selectedCheckups: [...prev.selectedCheckups, id] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.selectedCheckups.length === 0) return;

        const checkupNames = formData.selectedCheckups.map(id => CHECKUP_TYPES.find(t => t.id === id)?.name).join(', ');

        const payload = {
            patientName: formData.patientName,
            age: formData.age,
            gender: formData.gender,
            contact: formData.contact,
            checkupType: checkupNames,
            totalCost: calculateTotal(),
            checkupDetails: { tests: formData.selectedCheckups }
        };

        try {
            await API.post('/api/checkups', payload);
            fetchCheckups();
            setFormData({
                patientName: '', age: '', gender: 'Male', contact: '', selectedCheckups: []
            });
        } catch (_err) {
            console.error(_err);
        }
    };

    const shareOnWhatsApp = (report) => {
        const total = report.totalCost;
        let message = `*Diagnostic Report - MediStore Pro*\n`;
        message += `Patient: ${report.patientName}\n`;
        message += `Tests: ${report.checkupType}\n`;
        message += `*Total Paid: ${CURRENCY}${total}*\n`;
        message += `\nValidated by MediStore Intelligent Diagnostics.`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    };

    if (viewReport) {
        return (
            <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-background/95 backdrop-blur-md no-print" onClick={() => setViewReport(null)}></div>
                <div className="glass-card w-full max-w-4xl relative overflow-hidden animate-float">
                    <div className="p-8 bg-white text-slate-900 border-b-4 border-primary shadow-2xl relative">
                        {/* Report Header */}
                        <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-200">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-violet">
                                    <Activity size={32} />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900">MediStore <span className="text-primary">Medical</span></h1>
                                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Pathology & Bio-Analysis Center</p>
                                </div>
                            </div>
                            <div className="text-right space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Digital Reference</p>
                                <p className="text-lg font-bold tracking-tighter">#{viewReport._id.slice(-8)}</p>
                            </div>
                        </div>

                        {/* Patient Metadata */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Subject</label>
                                <p className="font-bold text-lg">{viewReport.patientName}</p>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Telemetry</label>
                                <p className="font-bold text-lg">{viewReport.age}y / {viewReport.gender}</p>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Protocol Date</label>
                                <p className="font-bold text-sm">{new Date(viewReport.createdAt).toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Status</label>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    <ShieldCheck size={12} /> Validated
                                </div>
                            </div>
                        </div>

                        {/* Analysis Body */}
                        <div className="space-y-6 mb-12">
                            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                                <span className="w-8 h-[2px] bg-primary"></span>
                                Lab Analysis Breakdown
                            </h3>
                            <table className="w-full">
                                <thead>
                                    <tr className="border-y border-slate-200">
                                        <th className="py-4 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest">Diagnostic Test</th>
                                        <th className="py-4 text-center text-[10px] font-black uppercase text-slate-400 tracking-widest">Inference</th>
                                        <th className="py-4 text-right text-[10px] font-black uppercase text-slate-400 tracking-widest">Settlement</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {viewReport.checkupType.split(', ').map((test, idx) => (
                                        <tr key={idx}>
                                            <td className="py-4 font-bold text-slate-800">{test}</td>
                                            <td className="py-4 text-center">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 px-3 py-1 rounded-full">Processing...</span>
                                            </td>
                                            <td className="py-4 text-right font-mono font-bold text-slate-400">---</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer & Signature */}
                        <div className="flex justify-between items-end">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-slate-300">
                                    <Heart size={32} fill="currentColor" />
                                    <div className="text-[8px] font-black uppercase leading-tight tracking-[0.1em]">
                                        Medical Grade <br /> Intelligent System
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Financial Settlement</p>
                                <p className="text-3xl font-black text-slate-900 mb-8">{CURRENCY}{viewReport.totalCost}</p>
                                <div className="w-48 h-12 border-b border-slate-900 flex items-end justify-center pb-2">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Chief Pathologist Sign</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons (Floating) */}
                        <div className="no-print absolute top-4 right-4 flex gap-2">
                            <button onClick={() => shareOnWhatsApp(viewReport)} className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all">
                                <Share2 size={18} />
                            </button>
                            <button onClick={() => window.print()} className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                                <Printer size={18} />
                            </button>
                            <button onClick={() => setViewReport(null)} className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center hover:bg-red-600 hover:text-white transition-all">
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20 px-4">
            <div className="container mx-auto max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Diagnostic Terminal */}
                    <div className="lg:col-span-12 glass-card p-8! flex items-center justify-between mb-2">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <Stethoscope size={32} className="text-primary" />
                                <h1 className="text-3xl font-bold tracking-tight">Diagnostic Command</h1>
                            </div>
                            <p className="text-slate-500 text-sm font-medium">Pathology registration & result management terminal</p>
                        </div>
                        <Activity size={40} className="text-primary/20 animate-pulse hidden md:block" />
                    </div>

                    <div className="lg:col-span-7 space-y-8">
                        <div className="glass-card p-10! border-primary/20 bg-primary/5 h-full">
                            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                                <PlusCircle className="text-primary" /> Initialize Diagnostic Protocol
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Patient Identity</label>
                                        <div className="relative group">
                                            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary" />
                                            <input required type="text" value={formData.patientName} onChange={e => setFormData({ ...formData, patientName: e.target.value })} placeholder="Legal Full Name" className="input-field pl-11!" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Contact Protocol</label>
                                        <input required type="text" value={formData.contact} onChange={e => setFormData({ ...formData, contact: e.target.value })} placeholder="+1 (000) 000-0000" className="input-field" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Subject Age</label>
                                        <input required type="number" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} placeholder="Years" className="input-field" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Biological Gender</label>
                                        <select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })} className="input-field cursor-pointer">
                                            <option>Male</option>
                                            <option>Female</option>
                                            <option>Non-Binary</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Analysis Suite Selection</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                        {CHECKUP_TYPES.map(type => {
                                            const isSelected = formData.selectedCheckups.includes(type.id);
                                            return (
                                                <button
                                                    key={type.id}
                                                    type="button"
                                                    onClick={() => handleCheckboxChange(type.id)}
                                                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left group ${isSelected
                                                        ? 'bg-primary/20 border-primary/40 shadow-violet'
                                                        : 'bg-white/3 border-white/5 hover:border-white/20'
                                                        }`}
                                                >
                                                    <div>
                                                        <p className={`font-bold transition-all ${isSelected ? 'text-white' : 'text-slate-300'}`}>{type.name}</p>
                                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{type.sub}</p>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-1">
                                                        <span className={`font-mono font-bold ${isSelected ? 'text-white' : 'text-primary'}`}>{CURRENCY}{type.price}</span>
                                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${isSelected ? 'bg-primary scale-110' : 'bg-white/5 scale-90'}`}>
                                                            {isSelected && <Check size={12} className="text-white" />}
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-white/10">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Calculated Cost Pool</p>
                                        <div className="text-4xl font-black text-white">{CURRENCY}{calculateTotal()}</div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={formData.selectedCheckups.length === 0}
                                        className="btn-primary py-5! px-10! disabled:opacity-20"
                                    >
                                        Register Protocol
                                        <ArrowRight size={20} />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-5 space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-bold flex items-center gap-3">
                                <ClipboardList size={22} className="text-secondary" />
                                Diagnostic History
                            </h3>
                            <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">
                                {checkups.length} Records
                            </div>
                        </div>

                        <div className="space-y-4 max-h-[850px] overflow-y-auto pr-4 custom-scrollbar">
                            {checkups.map(checkup => (
                                <div key={checkup._id} className="glass-card p-6! flex justify-between items-center group hover:border-primary/40 transition-all">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary/20 group-hover:text-primary transition-all shadow-lg border border-white/5">
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-lg text-white leading-tight">{checkup.patientName}</p>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{new Date(checkup.createdAt).toLocaleDateString()} @ {new Date(checkup.createdAt).toLocaleTimeString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {checkup.checkupType.split(', ').map((t, i) => (
                                                <span key={i} className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 bg-white/3 border border-white/5 text-slate-400 rounded-lg group-hover:border-primary/10">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-right space-y-4">
                                        <div className="font-mono font-black text-2xl text-primary">{CURRENCY}{checkup.totalCost}</div>
                                        <button
                                            className="btn-outline py-2.5! px-4! text-xs! rounded-xl! border-primary/20 text-primary hover:bg-primary! hover:text-white!"
                                            onClick={() => setViewReport(checkup)}
                                        >
                                            <FileText size={14} /> Intelligence Report
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {checkups.length === 0 && (
                                <div className="p-20 text-center border-2 border-dashed border-white/5 rounded-3xl opacity-30">
                                    <Activity size={48} className="mx-auto mb-4" />
                                    <p className="text-xs font-black uppercase tracking-[0.2em]">Telemetry Grid Offline</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkups;
