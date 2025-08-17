import { useContext, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { AuthContext } from '../../../contexts/AuthContext';
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';

const ViewAllTutorMaterials = () => {

    const { user } = useContext(AuthContext);
    const queryClient = useQueryClient();
    const { register, handleSubmit, setValue } = useForm();

    const [isModalOpen, setModalOpen] = useState(false);

    const [selectedMaterial, setSelectedMaterial] = useState(null);






    const { data: materials = [], isLoading } = useQuery({

        queryKey: ['myAllMaterials', user?.email],

        queryFn: async () => {

            const token = localStorage.getItem('access-token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/materials/my-materials`, { headers: { authorization: `Bearer ${token}` } });
            return res.data;

        },

        enabled: !!user?.email,

    });





    const updateMutation = useMutation({

        mutationFn: (updatedData) => {

            const token = localStorage.getItem('access-token');
            return axios.patch(`${import.meta.env.VITE_API_URL}/api/materials/${selectedMaterial._id}`, updatedData, { headers: { authorization: `Bearer ${token}` } });

        },
        onSuccess: () => {

            Swal.fire('Updated!', 'Material has been updated.', 'success');
            queryClient.invalidateQueries({ queryKey: ['myAllMaterials'] });
            setModalOpen(false);

        },

        onError: () => Swal.fire('Error!', 'Could not update material.', 'error'),


    });
    



    const deleteMutation = useMutation({


        mutationFn: (materialId) => {

            const token = localStorage.getItem('access-token');
            return axios.delete(`${import.meta.env.VITE_API_URL}/api/materials/${materialId}`, { headers: { authorization: `Bearer ${token}` } });

        },

        onSuccess: () => {

            Swal.fire('Deleted!', 'The material has been removed.', 'success');
            queryClient.invalidateQueries({ queryKey: ['myAllMaterials'] });



        },
    });





    const openUpdateModal = (material) => {

        setSelectedMaterial(material);
        setValue('title', material.title);
        setValue('imageUrl', material.imageUrl);
        setValue('documentLink', material.documentLink);
        setModalOpen(true);

    };





    const handleUpdateSubmit = (data) => {
        updateMutation.mutate(data);
    };




    const handleDelete = (materialId) => {

        Swal.fire({
            title: 'Are you sure?', text: "You won't be able to revert this!", icon: 'warning',
            showCancelButton: true, confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) deleteMutation.mutate(materialId);
        });


    };




    if (isLoading) return <div>Loading your materials...</div>;

    return (
        <div className="w-full p-4">

            <h1 className="text-3xl font-bold mb-6">All My Uploaded Materials</h1>
            {materials.length === 0 && <p>You have not uploaded any materials yet.</p>}


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {materials.map(material => (

                    <div key={material._id} className="card bg-base-100 shadow-xl">
                        {material.imageUrl && <figure><img src={material.imageUrl} alt={material.title} className="h-40 w-full object-cover" /></figure>}
                        <div className="card-body">
                            <h2 className="card-title">{material.title}</h2>
                            <p className="text-xs text-gray-500">Session: {material.sessionId?.sessionTitle || "N/A"}</p>
                            <div className="card-actions justify-end mt-4">
                                <button onClick={() => openUpdateModal(material)} className="btn btn-info btn-sm">Update</button>
                                <button onClick={() => handleDelete(material._id)} className="btn btn-error btn-sm">Delete</button>
                            </div>
                        </div>

                    </div>

                ))}

            </div>


            {isModalOpen && (

                <dialog className="modal modal-open">

                     <div className="modal-box w-11/12 max-w-2xl">

                        <h3 className="font-bold text-lg">Update Material</h3>


                        <form onSubmit={handleSubmit(handleUpdateSubmit)} className="py-4 space-y-4">



                            <div>
                                <label className="label"><span className="label-text">Title</span></label>
                                <input {...register("title", { required: true })} type="text" className="input input-bordered w-full" />
                            </div>


                             <div>
                                <label className="label"><span className="label-text">Image URL</span></label>
                                <input {...register("imageUrl")} type="url" className="input input-bordered w-full" />
                            </div>


                            <div>
                                <label className="label"><span className="label-text">Resource Link</span></label>
                                <input {...register("documentLink")} type="url" className="input input-bordered w-full" />
                            </div>

                            <div className="modal-action">
                                <button type="submit" className="btn btn-primary" disabled={updateMutation.isLoading}>Save Changes</button>
                                <button type="button" className="btn" onClick={() => setModalOpen(false)}>Cancel</button>
                            </div>
                            
                        </form>


                    </div>

                </dialog>
            )}

        </div>
    );
};

export default ViewAllTutorMaterials;