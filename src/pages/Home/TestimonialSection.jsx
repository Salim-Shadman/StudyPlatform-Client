import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';

const TestimonialSection = () => {
    
    const { data: reviews = [], isLoading } = useQuery({
        queryKey: ['testimonials'],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/reviews`);
            return res.data;
        }
    });



   
    if (isLoading || reviews.length === 0) {
        return null;
    }



    return (
        <div className="my-16">


            <h2 className="text-3xl font-bold text-center mb-10">What Our Students Say</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                
                {reviews.slice(0, 3).map((review) => (

                    <div key={review._id} className="card bg-base-100 shadow-lg border">

                        <div className="card-body">

                            <div className="flex items-center gap-4">
                                <div className="avatar">
                                    <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                        <img src={review.studentImage || 'https://i.ibb.co/6X4gLFr/user.png'} alt={review.studentName} />
                                    </div>
                                </div>





                                <div>

                                    <h3 className="font-bold">{review.studentName}</h3>
                                    <div className="flex text-orange-400">
                                        {[...Array(review.rating)].map((_, i) => <FaStar key={i} />)}
                                    </div>

                                </div>



                            </div>


                            <p className="mt-4 text-gray-600 italic">"{review.reviewText}"</p>


                        </div>
                    </div>



                ))}


            </div>
        </div>
    );
};

export default TestimonialSection;