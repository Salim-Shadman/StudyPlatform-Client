import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import { FaStar, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import toast from 'react-hot-toast';

const StarRating = ({ rating = 0 }) => {
    const totalStars = 5;
    const roundedRating = Math.round(rating);
    return (
        <div className="flex items-center gap-1">
            {[...Array(totalStars)].map((_, index) => (
                <FaStar key={index} className={index < roundedRating ? "text-orange-400" : "text-gray-300"} />
            ))}
        </div>
    );
};

const SessionDetailsPage = () => {
    const { id } = useParams();
    const { user, dbUser, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const { data, isLoading, error } = useQuery({
        queryKey: ['sessionDetails', id],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/sessions/${id}`);
            return res.data;
        }
    });

    // FIX: Restored the handleBookNow and bookFreeSession functions
    const handleBookNow = () => {
        if (!user) {
            toast.error("You must log in to book a session.");
            navigate('/login', { state: { from: location } });
            return;
        }
        
        if (data.session.registrationFee > 0) {
            navigate(`/dashboard/payment/${id}`);
        } else {
            bookFreeSession();
        }
    };

    const bookFreeSession = async () => {
        const toastId = toast.loading("Booking your session...");
        try {
            const token = localStorage.getItem('access-token');
            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/student/book-session/${id}`, {},
                { headers: { authorization: `Bearer ${token}` } }
            );
            toast.success("Successfully booked this free session!", { id: toastId });
            navigate('/dashboard/my-booked-sessions');
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Could not book the session.";
            toast.error(errorMessage, { id: toastId });
        }
    };

    if (isLoading || authLoading) {
        return <div className="text-center my-20"><span className="loading loading-spinner loading-lg"></span></div>;
    }
    
    if (error) {
        return <div className="text-center my-20 text-red-500">Error loading session details: {error.message}</div>;
    }

    const { session, reviews, tutor, averageRating } = data;
    const isRegistrationOpen = new Date(session.registrationEndDate) > new Date();
    const isButtonDisabled = !user || dbUser?.role !== 'student';

    return (
        <div className="py-12 bg-base-200">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">

                {/* Main Sessioon er details */}
                <div className="lg:col-span-2 bg-base-100 shadow-xl rounded-lg p-6 md:p-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">{session.sessionTitle}</h1>

                    <div className='flex items-center gap-2 mb-4'>
                        <StarRating rating={averageRating} />
                        <span className="font-semibold">({averageRating} / 5.0 from {reviews.length} reviews)</span>
                    </div>

                    <p className="mb-6 text-base-content/80">{session.sessionDescription}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm p-4 bg-base-200 rounded-md">

                        <p><strong>Registration Starts:</strong> {new Date(session.registrationStartDate).toLocaleDateString()}</p>
                        <p><strong>Registration Ends:</strong> {new Date(session.registrationEndDate).toLocaleDateString()}</p>
                        <p><strong>Class Starts:</strong> {new Date(session.classStartDate).toLocaleDateString()}</p>
                        <p><strong>Class Ends:</strong> {new Date(session.classEndDate).toLocaleDateString()}</p>
                        <p><strong>Duration:</strong> {session.sessionDuration}</p>
                        <p><strong>Fee:</strong> <span className="font-bold text-lg">{session.registrationFee > 0 ? `$${session.registrationFee}` : 'Free'}</span></p>
                    </div>
                    {isRegistrationOpen ? (
                        <button onClick={handleBookNow} className="btn btn-primary w-full btn-lg" disabled={isButtonDisabled}>
                            Book Now
                        </button>
                    ) : (
                        <button className="btn btn-disabled w-full btn-lg">Registration Closed</button>
                    )}
                    {isButtonDisabled && user && <p className="text-center text-red-500 mt-2 text-sm">Booking is only available for students.</p>}
                </div>

                {/* Tutor Information Card */}
                <div className="lg:col-span-1">
                    <div className="bg-base-100 shadow-xl rounded-lg p-6 sticky top-24">
                        <h3 className="text-xl font-bold mb-4 border-b pb-2">Tutor Information</h3>
                        <div className="flex items-center gap-4">
                            <div className="avatar">
                                <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                    <img src={tutor?.photoURL || 'https://i.ibb.co/d5bC4T8/default-avatar.jpg'} alt={tutor?.name} />
                                </div>
                            </div>
                            <div>
                                <p className="font-bold text-lg">{tutor?.name}</p>
                                <p className="text-sm text-base-content/70">{session.tutorEmail}</p>
                            </div>
                        </div>
                        <div className="divider my-4"></div>
                        <div className="space-y-3">
                            {tutor?.phoneNumber && (
                                <div className="flex items-center gap-3">
                                    <FaPhone className="text-primary" />
                                    <span>{tutor.phoneNumber}</span>
                                </div>
                            )}
                            {tutor?.address && (
                                <div className="flex items-start gap-3">
                                    <FaMapMarkerAlt className="text-primary mt-1" />
                                    <span>{tutor.address}</span>
                                </div>
                            )}
                             {!tutor?.phoneNumber && !tutor?.address && (
                                <p className="text-sm text-base-content/60 italic">No additional contact information provided.</p>
                            )}
                        </div>
                    </div>
                </div>
                





                {/* Reviews Section */}
                <div className="lg:col-span-2 mt-8 lg:mt-0">
                     <h2 className="text-3xl font-bold mb-6">Student Reviews</h2>
                    <div className="space-y-6">
                        {reviews && reviews.length > 0 ? (
                            reviews.map(review => (
                                <div key={review._id} className="card bg-base-100 shadow-lg">
                                    <div className="card-body">
                                        <div className="flex items-center mb-4">
                                            <div className="avatar mr-4">
                                                <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                                    <img src={review.studentImage || 'https://i.ibb.co/d5bC4T8/default-avatar.jpg'} alt={review.studentName} />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-bold">{review.studentName}</p>
                                                <StarRating rating={review.rating} />
                                            </div>
                                        </div>
                                        <p className="text-gray-700">{review.reviewText}</p>
                                    </div>
                                </div>
                            ))
                        ) : (

                            <div className="bg-base-100 p-6 rounded-lg shadow-md text-center">
                                <p>No reviews yet for this session.</p>
                            </div>
                            
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SessionDetailsPage;