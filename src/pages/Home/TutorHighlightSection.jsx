import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';

const TutorHighlightSection = () => {


   
    const { data: tutors = [], isLoading } = useQuery({

        queryKey: ['highlightedTutors'],

        queryFn: async () => {

            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/tutors`);
            return res.data.slice(0, 4); 

        }


    });



    if (isLoading || tutors.length === 0) return null;



    return (

        <div className="my-16 bg-base-200 py-12 rounded-lg">

            <div className="container mx-auto px-4">

                <h2 className="text-3xl font-bold text-center mb-10">Meet Our Expert Tutors</h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {tutors.map(tutor => (
                        <div key={tutor._id} className="flex flex-col items-center">
                            <div className="avatar">

                                <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                    <img src={tutor.photoURL || 'https://i.ibb.co/6X4gLFr/user.png'} alt={tutor.name} />
                                </div>
                                
                            </div>
                            <h4 className="font-semibold mt-4">{tutor.name}</h4>
                        </div>
                    ))}
                </div>


                <div className="text-center mt-12">
                    <Link to="/tutors" className="btn btn-primary">View All Tutors</Link>
                </div>


            </div>



        </div>


    );
};

export default TutorHighlightSection;