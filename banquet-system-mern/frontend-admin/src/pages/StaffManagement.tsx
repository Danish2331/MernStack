import { useState, useEffect, FormEvent } from 'react';
import client from '../api/client'; // Correct client that uses 'token'
import { Trash2, UserPlus, Shield, X, Check } from 'lucide-react';

interface Staff {
    _id: string;
    name: string;
    email: string;
    role: string;
}

const StaffManagement = () => {
    const [staff, setStaff] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form Data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'ADMIN1'
    });

    const [error, setError] = useState('');

    const fetchStaff = async () => {
        try {
            setLoading(true);
            const res = await client.get('/admin/staff');
            setStaff(res.data);
        } catch (err) {
            console.error("Fetch Staff Error:", err);
            // Don't show error on 404/empty, just empty list
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const handleCreate = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await client.post('/admin/staff', formData);
            alert("Success: Staff Member Created");
            setShowModal(false);
            setFormData({ name: '', email: '', password: '', role: 'ADMIN1' });
            fetchStaff();
        } catch (err: any) {
            console.error("Create Error:", err);
            setError(err.response?.data?.message || 'Creation failed');
            alert("Error: " + (err.response?.data?.message || 'Creation failed'));
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this staff member?")) return;
        try {
            await client.delete(`/admin/staff/${id}`);
            fetchStaff();
        } catch (err: any) {
            alert("Delete Failed: " + (err.response?.data?.message || 'Unknown error'));
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold font-serif text-gray-800">Staff Management</h1>
                    <p className="text-sm text-gray-500">Manage admin access hierarchy</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-oberoi-gold to-yellow-600 text-white rounded shadow"
                >
                    <UserPlus size={18} />
                    Add New Staff
                </button>
            </div>

            {/* ERROR DISPLAY */}
            {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}

            {/* DATA TABLE */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan={4} className="text-center py-4">Loading...</td></tr>
                        ) : staff.length === 0 ? (
                            <tr><td colSpan={4} className="text-center py-4 text-gray-500">No staff members found.</td></tr>
                        ) : (
                            staff.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'ADMIN2' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            <Shield size={12} className="mr-1" />
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-full hover:bg-red-100 transition-all"
                                            title="Delete User"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h2 className="text-xl font-bold text-gray-800">Add Staff Member</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-oberoi-gold"
                                    placeholder="e.g. John Doe"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-oberoi-gold"
                                    placeholder="john@banquet.com"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-oberoi-gold"
                                    placeholder="••••••••"
                                    required
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-oberoi-gold"
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="ADMIN1">Clerk (Admin1)</option>
                                    <option value="ADMIN2">Manager (Admin2)</option>
                                </select>
                                <p className="text-xs text-gray-500 mt-1">Managers can create Clerks. SuperAdmin can create both.</p>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-gradient-to-r from-oberoi-gold to-yellow-600 text-white rounded-md hover:shadow-lg transition-all flex items-center gap-2"
                                >
                                    <Check size={16} />
                                    Save User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffManagement;
