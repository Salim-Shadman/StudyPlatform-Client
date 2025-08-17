import { useContext, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '../../../contexts/AuthContext';
import axios from 'axios';
import Swal from 'sweetalert2';

const ViewBookedSessions = () => {
    const { user, dbUser } = useContext(AuthContext);
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);




    const { data: bookedSessions = [], isLoading } = useQuery({

        queryKey: ['bookedSessions', user?.email],

        queryFn: async () => {

            const token = localStorage.getItem('access-token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/student/my-booked-sessions`, {
                headers: { authorization: `Bearer ${token}` }
            });

            return res.data;

        },
        enabled: !!user?.email,

    });





//review er jonno mutation
    const reviewMutation = useMutation({

        mutationFn: (reviewData) => {

            const token = localStorage.getItem('access-token');
            return axios.post(`${import.meta.env.VITE_API_URL}/api/student/create-review/${reviewData.sessionId}`, reviewData, { headers: { authorization: `Bearer ${token}` } });
        },

        onSuccess: () => {

            Swal.fire("Success!", "Your review has been submitted.", "success");
            setIsModalOpen(false);
            queryClient.invalidateQueries(['sessionDetails', selectedSession?.sessionId?._id]);

        },

        onError: (error) => Swal.fire("Error!", error.response?.data?.message || "Could not submit review.", "error"),

    });






//review submission er handler
    const handleReviewSubmit = (event) => {


        event.preventDefault();
        const form = event.target;
        const rating = form.rating.value;
        const reviewText = form.reviewText.value;



        reviewMutation.mutate({

            rating: parseInt(rating),
            reviewText,
            studentName: dbUser.name,
            studentImage: dbUser.photoURL,
            sessionId: selectedSession.sessionId._id,


        });

    };
    






    if (isLoading) {
        return <div className="text-center"><span className="loading loading-spinner loading-lg"></span></div>;
    }


    return (



        <div className="w-full p-4">

            <h1 className="text-3xl font-bold mb-6">My Booked Sessions</h1>


            <div className="overflow-x-auto">

                <table className="table w-full">

                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Session Title</th>
                            <th>Fee</th>
                            <th>Actions</th>
                        </tr>
                    </thead>


                    <tbody>
                        {bookedSessions.map((session, index) => (
                            <tr key={session._id}>
                                <th>{index + 1}</th>
                                <td>{session.sessionId?.sessionTitle || 'Session title not available'}</td>
                                <td>{session.sessionId?.registrationFee > 0 ? `$${session.sessionId.registrationFee}` : 'Free'}</td>
                                <td>
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => {
                                            setSelectedSession(session);
                                            setIsModalOpen(true);
                                        }}>
                                        Add Review
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>



                </table>
            </div>






                       {isModalOpen && selectedSession && (
                <dialog className="modal modal-open">
                    <div className="modal-box w-11/12 max-w-lg">
                        <h3 className="font-bold text-lg mb-4">Review: {selectedSession.sessionId?.sessionTitle}</h3>
                        
                        
                        <form onSubmit={handleReviewSubmit} className="space-y-4">
                            
                           {/* rating er jonno dropdown */}
                            <div className="form-control">


                                <label className="label">
                                    <span className="label-text">Rating</span>
                                </label>

                                <select name="rating" className="select select-bordered w-full" required defaultValue="5">

                                    <option value="5">5 Stars</option>
                                    <option value="4">4 Stars</option>
                                    <option value="3">3 Stars</option>
                                    <option value="2">2 Stars</option>
                                    <option value="1">1 Star</option>

                                </select>

                            </div>
                            



                            {/* review text area ekhane */}
                            <div className="form-control">

                                <label className="label">
                                    <span className="label-text">Your Review</span>
                                </label>

                                <textarea name="reviewText" className="textarea textarea-bordered h-24 w-full" placeholder="Write your review here..." required></textarea>

                            </div>
                            




                            {/* Modal Buttons */}
                            <div className="modal-action pt-4">

                                <button type="submit" className="btn btn-primary" disabled={reviewMutation.isLoading}>
                                    {reviewMutation.isLoading ? "Submitting..." : "Submit Review"}
                                </button>
                                <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>Close</button>

                            </div>



                        </form>



                    </div>
                    
                </dialog>
            )}
        </div>
    );
};

export default ViewBookedSessions;