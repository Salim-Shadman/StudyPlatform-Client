import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const TutorsPage = () => {
    const { data: tutors = [], isLoading, error } = useQuery({
        queryKey: ['tutors'],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/tutors`);
            return res.data;
        }
    });

    if (isLoading) {
        return <div className="text-center my-12"><span className="loading loading-spinner loading-lg"></span></div>;
    }

    if (error) {
        return <div className="text-center my-12 text-red-500">Could not fetch tutors.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-10">Our Expert Tutors</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {tutors.map(tutor => (
                    <div key={tutor._id} className="card bg-base-100 shadow-xl border border-gray-200 transition-transform hover:scale-105">
                        <figure className="px-10 pt-10">
                            <img src={tutor.photoURL || 'https://i.ibb.co/d5bC4T8/default-avatar.jpg'} alt={tutor.name} className="rounded-full w-24 h-24 object-cover ring ring-primary ring-offset-base-100 ring-offset-2" />
                        </figure>
                        <div className="card-body items-center text-center">
                            <h2 className="card-title">{tutor.name}</h2>
                            <p className="text-sm text-gray-500">{tutor.email}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TutorsPage;