import { useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { AuthContext } from '../../../contexts/AuthContext';
import toast from 'react-hot-toast';

const ViewMySessions = () => {
    const { user } = useContext(AuthContext);
    const queryClient = useQueryClient();

    const { data: mySessions = [], isLoading } = useQuery({

        queryKey: ['mySessions', user?.email],
        queryFn: async () => {
            const token = localStorage.getItem('access-token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/sessions/my-sessions/tutor`, {
                headers: { authorization: `Bearer ${token}` }
            });
            return res.data;
        },
        enabled: !!user?.email,

    });

    const rerequestMutation = useMutation({

        mutationFn: (sessionId) => {
            const token = localStorage.getItem('access-token');
            return axios.patch(`${import.meta.env.VITE_API_URL}/api/sessions/rerequest-approval/${sessionId}`, {}, {
                headers: { authorization: `Bearer ${token}` }
            });
        },

        onSuccess: () => {
            toast.success('Your re-approval request has been sent.');
            queryClient.invalidateQueries({ queryKey: ['mySessions'] });
        },
        onError: (error) => toast.error(error.response?.data?.message || 'Could not send request.'),

    });



    const handleRerequest = (sessionId) => {
        rerequestMutation.mutate(sessionId);
    };

    const getStatusBadge = (status) => {

        const styles = {
            pending: 'badge-warning',
            approved: 'badge-success',
            rejected: 'badge-error',
        };

        return <div className={`badge ${styles[status]} capitalize`}>{status}</div>;

    };




    if (isLoading) {

        return <div className="text-center my-10"><span className="loading loading-lg"></span></div>;

    }

    return (

        <div className="w-full p-4">

            <h1 className="text-3xl font-bold mb-6">My Study Sessions</h1>

            {mySessions.length === 0 ? (

                <div className="text-center p-8 bg-base-200 rounded-lg">
                    <p className="text-lg">You have not created any sessions yet.</p>
                </div>

            ) : (
                <div className="overflow-x-auto bg-base-100 rounded-lg shadow">

                    <table className="table w-full">

                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th>Status</th>
                                <th>Admin Feedback</th>
                                <th className='text-center'>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {mySessions.map((session, index) => (
                                <tr key={session._id} className="hover">
                                    <th>{index + 1}</th>
                                    <td>{session.sessionTitle}</td>
                                    <td>{getStatusBadge(session.status)}</td>
                                    <td>
                                        
                                        {session.status === 'rejected' ? (
                                            <div className="text-xs text-error">
                                                <p><strong>Reason:</strong> {session.rejectionReason}</p>
                                                <p><strong>Feedback:</strong> {session.feedback}</p>
                                            </div>
                                        ) : session.status === 'pending' ? (
                                            <span className="text-xs text-base-content/60 italic">Awaiting admin review...</span>
                                        ) : (
                                             <span className="text-xs text-base-content/60">N/A</span>
                                        )}
                                    </td>
                                    
                                    <td className='text-center'>
                                      
                                        {session.status === 'rejected' ? (
                                            <button
                                                onClick={() => handleRerequest(session._id)}
                                                className="btn btn-primary btn-xs"
                                                disabled={rerequestMutation.isLoading}>
                                                Request Again
                                            </button>
                                        ) : (
                                            <button className="btn btn-xs" disabled>No Actions</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>


                    </table>



                </div>
            )}
        </div>
    );
};

export default ViewMySessions;