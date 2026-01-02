import React, { useState, useEffect, useRef } from 'react';
import API from '../api/axios';
import { Upload, Printer, Search, Plus, Minus, Trash2, X, Share2, ShoppingCart, Package, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const ReceiptModal = ({ showReceipt, setShowReceipt, customerName, cart, CURRENCY, calculateTotal, shareOnWhatsApp, user }) => {
    const refNumber = React.useMemo(() => Date.now().toString().slice(-8), []);
    const receiptRef = useRef(null);

    const downloadPDF = async () => {
        console.log('Initiating Inventory PDF download...');
        const element = receiptRef.current;
        if (!element) {
            console.error('Receipt element not found');
            return;
        }

        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: true,
                backgroundColor: '#ffffff'
            });

            console.log('Canvas generated for inventory, creating PDF...');
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Invoice_${customerName.replace(/\s+/g, '_') || 'Customer'}_${refNumber}.pdf`);
            console.log('PDF save triggered');
        } catch (error) {
            console.error('PDF generation failed:', error);
        }
    };

    if (!showReceipt) return null;

    return (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4 modal-overlay overflow-y-auto">
            <div className="fixed inset-0 bg-background/95 backdrop-blur-md no-print" onClick={() => setShowReceipt(false)}></div>
            <div className="glass-card max-w-2xl w-full mx-4 overflow-hidden animate-float my-auto">
                <div className="p-6 bg-white/3 flex justify-between items-center border-b border-white/5 no-print">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                        <Printer size={20} className="text-primary" /> Invoice Intelligence
                    </h2>
                    <div className="flex gap-2">
                        <button className="p-2.5 rounded-xl bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white transition-all" onClick={shareOnWhatsApp} title="Share on WhatsApp">
                            <Share2 size={18} />
                        </button>
                        <button className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400 hover:bg-violet-500 hover:text-white transition-all" onClick={downloadPDF} title="Download PDF">
                            <Download size={18} />
                        </button>
                        <button className="p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all" onClick={() => window.print()} title="Print Invoice">
                            <Printer size={18} />
                        </button>
                        <button className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all" onClick={() => setShowReceipt(false)} title="Close">
                            <X size={18} />
                        </button>
                    </div>
                </div>

                <div ref={receiptRef} className="p-10 bg-white text-slate-900 min-h-[600px] relative">
                    <div className="flex justify-between items-start mb-12 border-b-2 border-slate-900 pb-8">
                        <div>
                            <h1 className="text-4xl font-black tracking-tighter uppercase mb-1">MediStore <span className="text-blue-600">Pro</span></h1>
                            <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">Precision Health Logistics</p>
                        </div>
                        <div className="text-right">
                            <p className="text-4xl font-light text-slate-300 uppercase tracking-[0.2em]">Invoice</p>
                            <p className="font-mono text-xs mt-2 font-black text-blue-600 tracking-tighter">REF: {refNumber}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-12 mb-12">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Client Profile</p>
                            <p className="text-2xl font-bold tracking-tight">{customerName || 'Anonymous Client'}</p>
                            <p className="text-sm text-slate-500 mt-1">Status: Verified Payment</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Transaction Metadata</p>
                            <div className="space-y-1 text-sm font-bold">
                                <p><span className="text-slate-400">Chronology:</span> {new Date().toLocaleDateString()}</p>
                                <p><span className="text-slate-400">Terminal ID:</span> <span className="text-blue-600">{user?.username}</span></p>
                            </div>
                        </div>
                    </div>

                    <table className="w-full mb-12">
                        <thead>
                            <tr className="border-y-2 border-slate-900">
                                <th className="py-4 text-left text-xs font-black uppercase tracking-widest text-slate-500">Inventory Item</th>
                                <th className="py-4 text-center text-xs font-black uppercase tracking-widest text-slate-500">Unit</th>
                                <th className="py-4 text-right text-xs font-black uppercase tracking-widest text-slate-500">Rate</th>
                                <th className="py-4 text-right text-xs font-black uppercase tracking-widest text-slate-500">Extended</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {cart.map((item, idx) => (
                                <tr key={idx}>
                                    <td className="py-5 font-bold text-slate-800">{item.name}</td>
                                    <td className="py-5 text-center font-mono text-sm">{item.cartQty}</td>
                                    <td className="py-5 text-right font-mono text-sm">{CURRENCY}{item.price.toFixed(2)}</td>
                                    <td className="py-5 text-right font-mono font-black text-slate-900">{CURRENCY}{(item.price * item.cartQty).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex justify-end p-8 bg-slate-50 rounded-3xl mb-12 border border-slate-100">
                        <div className="w-64 space-y-3">
                            <div className="flex justify-between text-sm font-bold text-slate-500">
                                <span>Sub-Total</span>
                                <span>{CURRENCY}{calculateTotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm font-bold text-slate-500">
                                <span>Adjustments</span>
                                <span>{CURRENCY}0.00</span>
                            </div>
                            <div className="flex justify-between text-2xl font-black text-slate-900 pt-3 border-t-2 border-slate-200">
                                <span>TOTAL</span>
                                <span className="text-blue-600">{CURRENCY}{calculateTotal().toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="inline-block px-4 py-1 bg-slate-100 rounded-full text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">
                            Health through Precision
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Inventory = () => {
    const [medicines, setMedicines] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState([]);
    const [showReceipt, setShowReceipt] = useState(false);
    const [customerName, setCustomerName] = useState('');
    const fileInputRef = useRef(null);
    const { user } = useAuth();
    const CURRENCY = '₹';

    const fetchMedicines = async () => {
        try {
            const res = await API.get('/api/medicines');
            setMedicines(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchMedicines();
    }, []);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);

        try {
            await API.post('/api/upload-medicines', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            fetchMedicines();
        } catch {
            console.error('Upload failed');
        }
    };

    const updateMedicine = async (id, field, value) => {
        const updated = medicines.map(m => m._id === id ? { ...m, [field]: value } : m);
        setMedicines(updated);
        try {
            await API.put(`/api/medicines/${id}`, { [field]: value });
        } catch {
            console.error('Update failed');
        }
    };

    const addToCart = (medicine) => {
        const existing = cart.find(item => item._id === medicine._id);
        if (existing) {
            setCart(cart.map(item => item._id === medicine._id ? { ...item, cartQty: item.cartQty + 1 } : item));
        } else {
            setCart([...cart, { ...medicine, cartQty: 1 }]);
        }
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item._id !== id));
    };

    const calculateTotal = () => {
        return cart.reduce((acc, item) => acc + (item.price * item.cartQty), 0);
    };

    const shareOnWhatsApp = () => {
        const total = calculateTotal().toFixed(2);
        let message = `*Medical Bill - MediStore Pro*\n`;
        message += `Customer: ${customerName || 'Valued Customer'}\n\n`;
        cart.forEach(item => {
            message += `${item.name} x ${item.cartQty}: ${CURRENCY}${item.price}\n`;
        });
        message += `\n*Total: ${CURRENCY}${total}*\n`;
        message += `Thank you for visiting!`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    };

    const filteredMedicines = medicines.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="pt-32 pb-20 px-4">
            <ReceiptModal
                showReceipt={showReceipt}
                setShowReceipt={setShowReceipt}
                customerName={customerName}
                cart={cart}
                CURRENCY={CURRENCY}
                calculateTotal={calculateTotal}
                shareOnWhatsApp={shareOnWhatsApp}
                user={user}
            />

            <div className="container mx-auto max-w-7xl no-print">
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    <div className="flex-1 w-full space-y-8">
                        <div className="glass-card p-8! flex flex-col md:flex-row gap-6 justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                                    <Package className="text-primary" /> Global Inventory
                                </h1>
                                <p className="text-slate-500 text-sm font-medium">Real-time stock management and POS gateway</p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                                <div className="relative group flex-1 sm:w-64">
                                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Scan or Search..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="input-field p-3! pl-11!"
                                    />
                                </div>
                                {user?.role === 'admin' && (
                                    <button
                                        onClick={() => fileInputRef.current.click()}
                                        className="btn-outline py-3! px-5!"
                                    >
                                        <Upload size={18} />
                                        Batch Upload
                                    </button>
                                )}
                                <input type="file" ref={fileInputRef} hidden accept=".xlsx, .xls" onChange={handleFileUpload} />
                            </div>
                        </div>

                        <div className="table-container">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr>
                                        <th className="table-header pl-8">Pharmaceutical Entity</th>
                                        <th className="table-header">Availability</th>
                                        <th className="table-header">Unit Price</th>
                                        <th className="table-header pr-8 text-right">Operation</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredMedicines.map(med => (
                                        <tr key={med._id} className="table-row">
                                            <td className="p-6 pl-8">
                                                <div className="font-bold text-lg text-white">{med.name}</div>
                                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">
                                                    ID: {med._id.slice(-8)} {med.batchNo ? `| BATCH: ${med.batchNo}` : ''}
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                {user?.role === 'admin' ? (
                                                    <div className="inline-flex items-center gap-3 p-2 bg-white/5 rounded-2xl border border-white/5">
                                                        <button
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                                                            onClick={() => updateMedicine(med._id, 'quantity', Math.max(0, med.quantity - 1))}
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className="font-mono font-bold w-12 text-center text-lg">{med.quantity}</span>
                                                        <button
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-green-500/20 text-green-400 transition-colors"
                                                            onClick={() => updateMedicine(med._id, 'quantity', med.quantity + 1)}
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase ${med.quantity < 10 ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                                                        <div className={`w-1.5 h-1.5 rounded-full ${med.quantity < 10 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                                                        {med.quantity} In Stock
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-6 font-mono font-bold text-lg">
                                                {user?.role === 'admin' ? (
                                                    <div className="relative group">
                                                        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-primary font-bold">{CURRENCY}</span>
                                                        <input
                                                            type="number"
                                                            value={med.price}
                                                            onChange={(e) => updateMedicine(med._id, 'price', e.target.value)}
                                                            className="bg-transparent border-none text-white focus:ring-0 w-24 pl-5 font-mono text-lg"
                                                        />
                                                    </div>
                                                ) : (
                                                    <span className="text-white">{CURRENCY}{med.price}</span>
                                                )}
                                            </td>
                                            <td className="p-6 pr-8 text-right">
                                                <button
                                                    onClick={() => addToCart(med)}
                                                    className="btn-primary p-3.5! rounded-xl! shadow-none! hover:scale-110! active:scale-95!"
                                                >
                                                    <Plus size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredMedicines.length === 0 && (
                                <div className="p-20 text-center space-y-4">
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                                        <Search size={32} className="text-slate-600" />
                                    </div>
                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Zero results found for your query</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="w-full lg:w-[400px] lg:sticky lg:top-36 space-y-6">
                        <div className="glass-card p-8! border-primary/20 shadow-violet relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3">
                                <span className="text-[10px] font-black tracking-widest uppercase text-primary bg-primary/10 px-3 py-1 rounded-full">Active POS</span>
                            </div>

                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                <ShoppingCart className="text-primary" /> Active Terminal
                            </h2>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase ml-1 tracking-widest text-slate-500">Client Identification</label>
                                    <input
                                        type="text"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        placeholder="Full Name"
                                        className="input-field p-3.5! rounded-xl!"
                                    />
                                </div>

                                <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                                    {cart.map(item => (
                                        <div key={item._id} className="flex justify-between items-center p-4 bg-white/3 rounded-2xl border border-white/5 group hover:border-primary/30 transition-all">
                                            <div className="space-y-1">
                                                <div className="font-bold text-white text-sm">{item.name}</div>
                                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{CURRENCY}{item.price} × {item.cartQty}</div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="font-mono font-bold text-primary">{CURRENCY}{(item.price * item.cartQty).toFixed(2)}</span>
                                                <button
                                                    onClick={() => removeFromCart(item._id)}
                                                    className="text-slate-600 hover:text-red-400 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {cart.length === 0 && (
                                        <div className="p-10 text-center border-2 border-dashed border-white/5 rounded-3xl">
                                            <p className="text-slate-600 font-bold uppercase tracking-widest text-[10px]">Queue Empty</p>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-6 border-t border-white/10 space-y-4">
                                    <div className="flex justify-between items-end">
                                        <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Aggregate Total</span>
                                        <span className="text-3xl font-black text-white tracking-tighter">
                                            <span className="text-primary mr-1 text-sm font-bold">{CURRENCY}</span>
                                            {calculateTotal().toFixed(2)}
                                        </span>
                                    </div>
                                    <button
                                        disabled={cart.length === 0}
                                        onClick={() => setShowReceipt(true)}
                                        className="btn-primary w-full py-5! rounded-2xl!"
                                    >
                                        <Printer size={20} />
                                        Initialize Settlement
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Inventory;
