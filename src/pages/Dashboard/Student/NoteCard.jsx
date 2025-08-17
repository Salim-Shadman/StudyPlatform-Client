import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Swal from 'sweetalert2';

const NoteCard = ({ note, onEdit }) => {


    const queryClient = useQueryClient();




//note delete korar jonno mutation use kora holo
    const deleteNoteMutation = useMutation({


        mutationFn: (noteId) => {

            const token = localStorage.getItem('access-token');
            return axios.delete(`${import.meta.env.VITE_API_URL}/api/student/notes/${noteId}`, { headers: { authorization: `Bearer ${token}` } });

        },


        onSuccess: () => {



            Swal.fire("Deleted!", "Your note has been deleted.", "success");
            queryClient.invalidateQueries({ queryKey: ['notes'] });


        }

    });





//note delete er handeler
    const handleDelete = () => {


        Swal.fire({
            title: "Are you sure?", text: "You won't be able to revert this!", icon: "warning",
            showCancelButton: true, confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) deleteNoteMutation.mutate(note._id);
        });


    };


    return (
        <div className="card bg-base-100 shadow-xl">


            <div className="card-body">

                <h2 className="card-title">{note.title}</h2>
                <p className="whitespace-pre-wrap text-sm text-gray-600">{note.description}</p>


                <div className="card-actions justify-end mt-4">
                    <button onClick={onEdit} className="btn btn-sm btn-outline btn-info">Update</button>
                    <button onClick={handleDelete} className="btn btn-sm btn-outline btn-error" disabled={deleteNoteMutation.isLoading}>Delete</button>
                </div>


            </div>



        </div>
    );
};

export default NoteCard;