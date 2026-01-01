import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Key, User, ArrowRight } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(username, password);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px] animate-pulse"></div>

            <div className="glass-card w-full max-w-[450px] p-10 relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-3xl mb-6 ring-1 ring-primary/20">
                        <Shield size={42} className="text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold mb-3 tracking-tight">MediStore <span className="text-primary italic">Pro</span></h1>
                    <p className="text-slate-400 font-medium">Precision Management System</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-2xl mb-8 flex items-center gap-3 animate-shake">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                        <p className="text-sm font-semibold">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500 ml-1">Username</label>
                        <div className="relative group">
                            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="System User ID"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="input-field pl-12"
                                autoComplete="username"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500 ml-1">Secure Key</label>
                        <div className="relative group">
                            <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="input-field pl-12"
                                autoComplete="current-password"
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary w-full group py-5">
                        Initialize Access
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <div className="mt-12 text-center pt-8 border-t border-white/5">
                    <p className="text-xs uppercase tracking-widest text-slate-500 mb-6 font-bold">Public Portal access</p>
                    <Link to="/book-appointment" className="inline-flex items-center gap-2 text-secondary hover:text-white transition-all font-bold group">
                        Booking Diagnostics
                        <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary transition-all">
                            <ArrowRight size={14} className="group-hover:text-white" />
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
