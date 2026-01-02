import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Stethoscope,
    Users,
    ShieldCheck,
    LogOut,
    Menu,
    X,
    Pill,
    ChevronRight
} from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { label: 'Inventory', path: '/inventory', icon: Pill },
        { label: 'Diagnostics', path: '/checkups', icon: Stethoscope },
        { label: 'Client CRM', path: '/leads', icon: Users },
        ...(user?.role === 'admin' ? [{ label: 'Operational Control', path: '/staff', icon: ShieldCheck }] : []),
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] px-4 py-4 pointer-events-none no-print">
            <div className="container mx-auto max-w-7xl pointer-events-auto">
                <div className="glass-card !rounded-2xl !p-2 flex items-center justify-between px-6 py-3 border-white/5 bg-background/40 backdrop-blur-2xl">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center group-hover:bg-primary transition-all duration-500 shadow-violet">
                            <Pill size={22} className="text-primary group-hover:text-white transition-colors" />
                        </div>
                        <div>
                            <span className="font-display font-bold text-lg tracking-tight">MediStore</span>
                            <span className="text-primary italic ml-1 font-bold">Pro</span>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${isActive(item.path)
                                    ? 'bg-primary text-white shadow-violet shadow-lg scale-105'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <item.icon size={16} />
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Profile */}
                    <div className="hidden lg:flex items-center gap-4 pl-4 border-l border-white/10">
                        <div className="text-right">
                            <p className="text-xs font-bold uppercase tracking-widest text-primary">{user?.role}</p>
                            <p className="text-sm font-bold truncate max-w-[100px]">{user?.username}</p>
                        </div>
                        <button
                            onClick={logout}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300"
                            title="Log Out System"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                <div className={`lg:hidden mt-3 transition-all duration-500 transform ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}`}>
                    <div className="glass-card !p-4 border-white/5 bg-background/80 overflow-hidden">
                        <div className="space-y-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center justify-between p-4 rounded-xl transition-all ${isActive(item.path)
                                        ? 'bg-primary/20 text-primary border border-primary/20'
                                        : 'text-slate-400 hover:bg-white/5'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon size={20} />
                                        <span className="font-bold">{item.label}</span>
                                    </div>
                                    <ChevronRight size={16} className={isActive(item.path) ? 'opacity-100' : 'opacity-30'} />
                                </Link>
                            ))}
                            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between px-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                        {user?.username?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">{user?.username}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary">{user?.role}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={logout}
                                    className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
