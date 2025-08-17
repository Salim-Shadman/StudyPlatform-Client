import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import toast from 'react-hot-toast';

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
        return () => { clearTimeout(handler); };
    }, [value, delay]);

    return debouncedValue;

};



const ViewAllUsers = () => {


    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const queryClient = useQueryClient();
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const { data, isLoading } = useQuery({
        queryKey: ['users', debouncedSearchTerm, currentPage],
        queryFn: async () => {
            const token = localStorage.getItem('access-token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
                headers: { authorization: `Bearer ${token}` },
                params: {
                    search: debouncedSearchTerm,
                    page: currentPage,
                    limit: 10
                }
            });
            return res.data;
        },

    });
    



    useEffect(() => {

        setCurrentPage(1);
    }, [debouncedSearchTerm]);




    const users = data?.users || [];

    const totalPages = data?.totalPages || 1;

    const updateRoleMutation = useMutation({


        mutationFn: ({ userId, newRole }) => {
            const token = localStorage.getItem('access-token');
            return axios.patch(`${import.meta.env.VITE_API_URL}/api/admin/users/update-role/${userId}`,
                { role: newRole }, { headers: { authorization: `Bearer ${token}` } }
            );


        },

        onSuccess: () => {

            toast.success("User's role has been updated.");
            queryClient.invalidateQueries({ queryKey: ['users'] });

        },

        onError: () => toast.error('Failed to update user role.'),

    });

    const handleRoleChange = (userId, newRole) => {

        updateRoleMutation.mutate({ userId, newRole });

    };

    const getRoleBadge = (role) => {

        const styles = { student: 'badge-info', tutor: 'badge-success', admin: 'badge-primary' };
        return <div className={`badge ${styles[role]} capitalize font-semibold`}>{role}</div>;

    };

    return (
        <div className="w-full">
            
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Manage All Users</h1>
            
            <div className="form-control mb-6 relative">
                <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                <input
                    type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name or email..." className="input input-bordered w-full max-w-xs pl-10" />
            </div>

            {isLoading ? (
                <div className="text-center"><span className="loading loading-spinner loading-lg"></span></div>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto bg-base-100 rounded-lg shadow">
                         <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Address</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id} className="hover">
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phoneNumber || 'N/A'}</td>
                                        <td>{user.address || 'N/A'}</td>
                                        <td>{getRoleBadge(user.role)}</td>
                                        <td>
                                            <div className="dropdown dropdown-left">
                                                <label tabIndex={0} className="btn btn-sm btn-outline">Change Role</label>
                                                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40">
                                                    <li><a onClick={() => handleRoleChange(user._id, 'student')}>Make Student</a></li>
                                                    <li><a onClick={() => handleRoleChange(user._id, 'tutor')}>Make Tutor</a></li>
                                                    <li><a onClick={() => handleRoleChange(user._id, 'admin')}>Make Admin</a></li>
                                                </ul>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Mobile Card View */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {users.map((user) => (
                            <div key={user._id} className="card bg-base-100 shadow-lg">
                                <div className="card-body p-4">
                                    <h2 className="card-title text-base">{user.name}</h2>
                                    <p className="text-sm text-gray-500 break-all">{user.email}</p>
                                    <p className="text-sm text-gray-500">Phone: {user.phoneNumber || 'N/A'}</p>
                                    <p className="text-sm text-gray-500">Address: {user.address || 'N/A'}</p>
                                    <div className="flex justify-between items-center mt-2">
                                        {getRoleBadge(user.role)}
                                        <div className="dropdown dropdown-end">
                                            <label tabIndex={0} className="btn btn-xs btn-outline">Change Role</label>
                                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-32">
                                                <li><a onClick={() => handleRoleChange(user._id, 'student')}>Student</a></li>
                                                <li><a onClick={() => handleRoleChange(user._id, 'tutor')}>Tutor</a></li>
                                                <li><a onClick={() => handleRoleChange(user._id, 'admin')}>Admin</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center mt-8">
                        <div className="join">
                            <button
                                onClick={() => setCurrentPage(old => Math.max(old - 1, 1))}
                                disabled={currentPage === 1}
                                className="join-item btn"
                            >«</button>
                            
                            {[...Array(totalPages).keys()].map(pageNumber => (
                                <button
                                    key={pageNumber + 1}
                                    onClick={() => setCurrentPage(pageNumber + 1)}
                                    className={`join-item btn ${currentPage === pageNumber + 1 ? 'btn-active' : ''}`}
                                >{pageNumber + 1}</button>
                            ))}

                            <button
                                onClick={() => setCurrentPage(old => Math.min(old + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="join-item btn"
                            >»</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ViewAllUsers;