import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import SessionDetailsModal from './SessionDetailsModal';
import toast from 'react-hot-toast'; 

const ViewAllSessions = () => {
    const queryClient = useQueryClient();
    const [selectedSession, setSelectedSession] = useState(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [updateData, setUpdateData] = useState({
        status: '',
        registrationFee: 0,
        rejectionReason: '',
        feedback: ''
    });



    const { data: sessions = [], isLoading: isLoadingSessions } = useQuery({

        queryKey: ['allSessionsAdmin'],
        queryFn: async () => {
            const token = localStorage.getItem('access-token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/sessions`, {
                headers: { authorization: `Bearer ${token}` }
            });
            return res.data;
        }

    });



    const { data: sessionDetails, isLoading: isLoadingDetails } = useQuery({

        queryKey: ['sessionDetailsAdmin', selectedSession?._id],

        queryFn: async () => {
            const token = localStorage.getItem('access-token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/session-details/${selectedSession._id}`, {
                headers: { authorization: `Bearer ${token}` }
            });
            return res.data;
        },


        enabled: !!selectedSession && isDetailsModalOpen,

    });





    const updateStatusMutation = useMutation({

        mutationFn: (data) => {
            const token = localStorage.getItem('access-token');
            return axios.patch(`${import.meta.env.VITE_API_URL}/api/admin/sessions/update-status/${selectedSession._id}`, data, {
                headers: { authorization: `Bearer ${token}` }
            });
        },

        onSuccess: () => {
            
            toast.success('Session status has been updated.');
            
            queryClient.invalidateQueries({ queryKey: ['allSessionsAdmin'] });
            queryClient.invalidateQueries({ queryKey: ['sessions-all'] });
            queryClient.invalidateQueries({ queryKey: ['sessions-featured'] });

            setIsUpdateModalOpen(false);

        },

        onError: () => toast.error('Failed to update session status.'),

    });




    const openUpdateModal = (session) => {

        setSelectedSession(session);
        setUpdateData({
            status: session.status,
            registrationFee: session.registrationFee,
            rejectionReason: session.rejectionReason || '',
            feedback: session.feedback || ''
        });

        setIsUpdateModalOpen(true);

    };





    const openDetailsModal = (session) => {

        setSelectedSession(session);
        setIsDetailsModalOpen(true);

    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setUpdateData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateSubmit = (e) => {

        e.preventDefault();
        updateStatusMutation.mutate(updateData);

    };

    const getStatusBadge = (status) => {


        const styles = {
            pending: 'badge-warning',
            approved: 'badge-success',
            rejected: 'badge-error',
        };


        return <div className={`badge ${styles[status]} capitalize`}>{status}</div>;
    };




    if (isLoadingSessions) {
        return <div className="text-center my-10"><span className="loading loading-lg"></span></div>;
    }

    return (
        <div className="w-full p-4">

            <h1 className="text-3xl font-bold mb-6">Manage All Study Sessions</h1>

            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Tutor Email</th>
                            <th>Fee</th>
                            <th>Status</th>
                            <th className='text-center'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sessions.map((session) => (
                            <tr key={session._id} className="hover">
                                <td>{session.sessionTitle}</td>
                                <td>{session.tutorEmail}</td>
                                <td className="font-semibold">${session.registrationFee}</td>
                                <td>{getStatusBadge(session.status)}</td>
                                <td className='flex gap-2 justify-center'>
                                    <button onClick={() => openDetailsModal(session)} className="btn btn-outline btn-info btn-xs">View Details</button>
                                    <button onClick={() => openUpdateModal(session)} className="btn btn-primary btn-xs">Update Status</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>



            {isDetailsModalOpen && (
                isLoadingDetails ? 
                <div className="modal modal-open flex items-center justify-center"><span className="loading loading-spinner loading-lg"></span></div> :
                <SessionDetailsModal session={sessionDetails?.session} materials={sessionDetails?.materials} onClose={() => setIsDetailsModalOpen(false)} />
            )}

            {isUpdateModalOpen && (
                <dialog className="modal modal-open">
                    <div className="modal-box w-11/12 max-w-lg">
                        <button onClick={() => setIsUpdateModalOpen(false)} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        <h3 className="font-bold text-lg">Update Session: {selectedSession.sessionTitle}</h3>
                        
                        <form onSubmit={handleUpdateSubmit} className="py-4 space-y-4">
                            <div className="grid grid-cols-3 items-center gap-4">
                                <label className="label col-span-1"><span className="label-text font-semibold">Session Status</span></label>
                                <select name="status" value={updateData.status} onChange={handleFormChange} className="select select-bordered col-span-2">
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>


                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-3 items-center gap-4">
                                <label className="label col-span-1"><span className="label-text font-semibold">Fee ($)</span></label>
                                <input type="number" name="registrationFee" value={updateData.registrationFee} onChange={handleFormChange} className="input input-bordered col-span-2" />
                            </div>
                            
                            {updateData.status === 'rejected' && (
                                <>
                                    <div className="form-control">
                                        <label className="label"><span className="label-text font-semibold">Rejection Reason</span></label>
                                        <input type="text" name="rejectionReason" value={updateData.rejectionReason} onChange={handleFormChange} className="input input-bordered w-full" />
                                    </div>
                                    <div className="form-control">
                                        <label className="label"><span className="label-text font-semibold">Feedback to Tutor</span></label>
                                        <textarea name="feedback" value={updateData.feedback} onChange={handleFormChange} className="textarea textarea-bordered w-full"></textarea>
                                    </div>
                                </>
                            )}

                            <div className="modal-action">
                                <button type="submit" className="btn btn-primary" disabled={updateStatusMutation.isLoading}>Save Changes</button>
                                <button type="button" className="btn" onClick={() => setIsUpdateModalOpen(false)}>Cancel</button>
                            </div>
                        </form>


                        
                    </div>
                </dialog>
            )}
        </div>
    );
};

export default ViewAllSessions;