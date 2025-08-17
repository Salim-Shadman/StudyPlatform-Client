import { useContext, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../../../contexts/AuthContext';
import axios from 'axios';
import Swal from 'sweetalert2';

const ViewStudyMaterials = () => {
    const { user } = useContext(AuthContext);
    const [selectedSessionId, setSelectedSessionId] = useState(null);





//logged in user er booked session fetch korar jonno query use korlam
    const { data: bookedSessions = [], isLoading: isLoadingSessions } = useQuery({

        queryKey: ['bookedSessionsForMaterials', user?.email],
        queryFn: async () => {

            const token = localStorage.getItem('access-token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/student/my-booked-sessions`, { headers: { authorization: `Bearer ${token}` } });
            return res.data;

        },
        enabled: !!user?.email,


    });




//selected session er material fetch korar query banano done
    const { data: materials = [], isLoading: isLoadingMaterials } = useQuery({

        queryKey: ['materials', selectedSessionId],


        queryFn: async () => {

            const token = localStorage.getItem('access-token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/materials/session/${selectedSessionId}`, { headers: { authorization: `Bearer ${token}` } });
            return res.data;



        },

        enabled: !!selectedSessionId,

    });
    





    const handleDownload = async (imageUrl, title) => {



        try {


            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = title || 'study-material-image';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {

            Swal.fire('Download Failed', 'Could not download the image.', 'error');

        }



    };






    return (
        <div className="w-full p-4">

            <h1 className="text-3xl font-bold mb-6">View Study Materials</h1>

            <div className="mb-8">

                <h2 className="text-xl font-semibold mb-2">Select a session to view materials:</h2>

                {isLoadingSessions && <p>Loading your sessions...</p>}



                <div className="flex flex-wrap gap-2">

                    {bookedSessions.map(booking => (
                        <button 
                            key={booking._id}
                            className={`btn ${selectedSessionId === booking.sessionId?._id ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setSelectedSessionId(booking.sessionId?._id)}>
                            {booking.sessionId?.sessionTitle || 'Session Removed'}
                        </button>
                    ))}

                </div>



            </div>




            <div className="divider"></div>





            <div>


                <h2 className="text-xl font-semibold mb-4">Materials for Selected Session</h2>

                {isLoadingMaterials && <p>Loading materials...</p>}

                {!selectedSessionId && <p>Please select a session from above.</p>}
                {selectedSessionId && !isLoadingMaterials && materials.length === 0 && <p>No materials uploaded for this session yet.</p>}


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {materials.map(material => (

                        <div key={material._id} className="card bg-base-100 shadow-xl">

                            {material.imageUrl && <figure><img src={material.imageUrl} alt={material.title} className="h-48 w-full object-cover" /></figure>}
                            <div className="card-body">

                                <h2 className="card-title">{material.title}</h2>

                                
                                <div className="card-actions justify-end mt-4">
                                    {material.imageUrl && <button onClick={() => handleDownload(material.imageUrl, material.title)} className="btn btn-secondary btn-sm">Download Image</button>}
                                    {material.documentLink && <a href={material.documentLink} target="_blank" rel="noopener noreferrer" className="btn btn-info btn-sm">View Link</a>}
                                </div>

                            </div>

                        </div>



                    ))}



                </div>
            </div>
        </div>
    );
};

export default ViewStudyMaterials;