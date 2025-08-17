import { useContext, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { AuthContext } from '../../../contexts/AuthContext';
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';

const UploadMaterials = () => {

    const { user } = useContext(AuthContext);
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset } = useForm();
    

    const [selectedSession, setSelectedSession] = useState(null);



    const { data: mySessions = [], isLoading } = useQuery({

        queryKey: ['mySessionsForUpload', user?.email],

        queryFn: async () => {

            const token = localStorage.getItem('access-token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/sessions/my-sessions/tutor`, { headers: { authorization: `Bearer ${token}` } });
            return res.data;

        },


        enabled: !!user?.email,


    });



    const approvedSessions = mySessions.filter(session => session.status === 'approved');


    //upload matrials mutation
    const uploadMutation = useMutation({


        mutationFn: (newMaterial) => {
            const token = localStorage.getItem('access-token');
            return axios.post(`${import.meta.env.VITE_API_URL}/api/materials/upload`, newMaterial, { headers: { authorization: `Bearer ${token}` } });
        },


        onSuccess: () => {

            Swal.fire('Uploaded!', 'Material has been uploaded successfully.', 'success');
            setSelectedSession(null);
            reset();
            queryClient.invalidateQueries(['myAllMaterials']);

        },

        onError: () => Swal.fire('Error!', 'Could not upload material.', 'error'),


    });






    const onSubmit = (data) => {

        uploadMutation.mutate({ ...data, sessionId: selectedSession._id });


    };



    if (isLoading) return <div>Loading sessions...</div>;



    return (


        <div className="w-full p-4">


            <h1 className="text-3xl font-bold mb-6">Upload Materials</h1>
            <p className="mb-4">You can upload materials for your approved sessions.</p>
            
            <div className="overflow-x-auto">



                <table className="table w-full">

                    <thead>
                        <tr><th>Session Title</th><th>Actions</th></tr>
                    </thead>

                    <tbody>
                        {approvedSessions.map(session => (
                            <tr key={session._id}>
                                <td>{session.sessionTitle}</td>
                                <td><button className="btn btn-primary btn-sm" onClick={() => setSelectedSession(session)}>Upload</button></td>
                            </tr>
                        ))}
                    </tbody>

                </table>



            </div>



            {selectedSession && (

                <dialog className="modal modal-open">


                    <div className="modal-box w-11/12 max-w-2xl">

                        <h3 className="font-bold text-lg">Upload for: {selectedSession?.sessionTitle}</h3>


                        <form onSubmit={handleSubmit(onSubmit)} className="py-4 space-y-4">

                            <div>
                                <label className="label"><span className="label-text">Material Title*</span></label>
                                <input {...register("title", { required: true })} type="text" className="input input-bordered w-full" />
                            </div>

                            <div>
                                <label className="label"><span className="label-text">Image URL (e.g., from ImgBB)</span></label>
                                <input {...register("imageUrl")} type="url" className="input input-bordered w-full" placeholder="https://example.com/image.jpg"/>
                            </div>

                            <div>
                                <label className="label"><span className="label-text">Resource Link (e.g., Google Drive)</span></label>
                                <input {...register("documentLink")} type="url" className="input input-bordered w-full" placeholder="https://docs.google.com/document/..."/>
                            </div>

                            <div className="modal-action">
                                <button type="submit" className="btn btn-primary" disabled={uploadMutation.isLoading}>Submit Material</button>
                                <button type="button" className="btn" onClick={() => setSelectedSession(null)}>Cancel</button>
                            </div>

                            
                        </form>


                    </div>



                </dialog>
            )}
        </div>
    );
};

export default UploadMaterials;