import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import SessionCard from '../../components/SessionCard';

const FeaturedSessions = () => {



    const { data: sessions = [], isLoading, error } = useQuery({
        queryKey: ['sessions-featured'],


        queryFn: async () => {

            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/sessions?limit=6`);
            return res.data.sessions;

        }

    });




    if (isLoading) {
        return <div className="text-center my-10"><span className="loading loading-lg"></span></div>;
    }




    if (error) {
        return <div className="text-center my-10 text-red-500">Error loading sessions: {error.message}</div>;
    }




    return (
        <div className="my-16">


            <h2 className="text-3xl font-bold text-center mb-8">Available Study Sessions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sessions.map(session => (
                    <SessionCard key={session._id} session={session} />
                ))}
            </div>



        </div>
    );
};

export default FeaturedSessions;