import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { FaUserGraduate, FaChalkboardTeacher, FaUserShield } from 'react-icons/fa';

const LoginHistoryPage = () => {
    const [filter, setFilter] = useState(''); 

    const { data: history = [], isLoading } = useQuery({
        
        queryKey: ['loginHistory', filter],


        queryFn: async () => {
            const token = localStorage.getItem('access-token');
          


            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/login-history`, {
                headers: { authorization: `Bearer ${token}` },
                params: { role: filter || undefined } 
            });

            return res.data;
        }



    });





    const getRoleIcon = (role) => {



        switch (role) {

            case 'student':
                return <FaUserGraduate className="text-info" title="Student" />;
            case 'tutor':
                return <FaChalkboardTeacher className="text-success" title="Tutor" />;
            case 'admin':
                return <FaUserShield className="text-primary" title="Admin" />;
            default:
                return null;
        }



    };




    if (isLoading) {
        return <div className="text-center my-10"><span className="loading loading-lg"></span></div>;
    }



    return (
        <div className="w-full p-4">

            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">User Login History</h1>
               
                <div className="form-control w-full max-w-xs mt-4 sm:mt-0">


                    <select
                        className="select select-bordered"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="">All Users</option>

                        <option value="student">Students Only</option>

                        <option value="tutor">Tutors Only</option>

                        <option value="admin">Admins Only</option>

                    </select>


                </div>
            </div>




            <p className="mb-4 text-base-content/80">
                Showing the last 100 login records {filter && `for "${filter}s"`}.
            </p>

            <div className="overflow-x-auto">

                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Login Time</th>
                        </tr>
                    </thead>

                    <tbody>
                        {history.map((record, index) => (
                            <tr key={record._id} className="hover">
                                <th>{index + 1}</th>
                                <td>{record.name}</td>
                                <td>{record.email}</td>
                                <td className="text-center text-xl">
                                    {getRoleIcon(record.role)}
                                </td>
                                <td>{new Date(record.loginTime).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                    
                </table>
            </div>



        </div>
    );
};

export default LoginHistoryPage;