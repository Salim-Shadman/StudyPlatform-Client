import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Swal from 'sweetalert2';

const ViewAllAdminMaterials = () => {


    const queryClient = useQueryClient();


    const { data: materials = [], isLoading } = useQuery({
        queryKey: ['allMaterialsAdmin'],



        queryFn: async () => {

            const token = localStorage.getItem('access-token');

            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/materials`, {
                headers: { authorization: `Bearer ${token}` }
            });

            return res.data;
        }




    });


    //matrial delete er mutation
    const deleteMutation = useMutation({

        mutationFn: (materialId) => {

            const token = localStorage.getItem('access-token');
            return axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/materials/delete/${materialId}`, {
                headers: { authorization: `Bearer ${token}` }
            });

        },

        onSuccess: () => {

            Swal.fire('Deleted!', 'The material has been removed.', 'success');
            queryClient.invalidateQueries({ queryKey: ['allMaterialsAdmin'] });

        }
    });






    const handleDelete = (materialId) => {


        Swal.fire({

            title: 'Are you sure?', text: "This will permanently remove the material!", icon: 'warning',
            showCancelButton: true, confirmButtonText: 'Yes, remove it!'
        }).then((result) => {

            if (result.isConfirmed) {
                deleteMutation.mutate(materialId);
            }

        });



    };

    if (isLoading) return <div>Loading all materials...</div>;



    return (


        <div className="w-full p-4 md:p-8">

            <h1 className="text-3xl font-bold mb-6">Manage All Uploaded Materials</h1>


            <div className="overflow-x-auto">


                <table className="table w-full">

                    <thead>
                        <tr>
                            <th>Material Title</th><th>Tutor Email</th><th>Session Title</th><th>Action</th>
                        </tr>
                    </thead>

                    <tbody>

                        {materials.map((material) => (
                            <tr key={material._id} className="hover">
                                <td>{material.title}</td>
                                <td>{material.tutorEmail}</td>
                                <td>{material.sessionId?.sessionTitle || 'Session deleted'}</td>
                                <td>
                                    <button onClick={() => handleDelete(material._id)} className="btn btn-error btn-xs">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    
                </table>


            </div>




        </div>
    );
};

export default ViewAllAdminMaterials;