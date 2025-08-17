import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useEffect } from 'react';

const NoteModal = ({ modalState, onClose }) => {



    const { isOpen, note } = modalState;
    const { register, handleSubmit, reset, setValue } = useForm();
    const queryClient = useQueryClient();


//note create /update er jonno mutation
    const mutation = useMutation({

        mutationFn: (noteData) => {

            const token = localStorage.getItem('access-token');

            const url = note 
                ? `${import.meta.env.VITE_API_URL}/api/student/notes/${note._id}` 
                : `${import.meta.env.VITE_API_URL}/api/student/notes/create`;
            const method = note ? 'patch' : 'post';

            return axios[method](url, noteData, { headers: { authorization: `Bearer ${token}` } });

        },


        onSuccess: () => {

            Swal.fire("Success!", `Note ${note ? 'updated' : 'created'} successfully.`, "success");
            queryClient.invalidateQueries({ queryKey: ['notes'] });
            onClose();

        },

        onError: () => Swal.fire("Error!", "An error occurred.", "error"),
    });





    useEffect(() => {

        if (note) {

            setValue('title', note.title);
            setValue('description', note.description);

        } else {

            reset({ title: '', description: '' });

        }

        
    }, [note, setValue, reset, isOpen]);






    const onSubmit = (data) => mutation.mutate(data);
    
    if (!isOpen) return null;



    return (

        <dialog className="modal modal-open">

            <div className="modal-box">

                <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                <h3 className="font-bold text-lg">{note ? 'Update Note' : 'Create a New Note'}</h3>




                <form onSubmit={handleSubmit(onSubmit)} className="py-4 space-y-4">



                    <input 
                        {...register("title", { required: true })} 
                        type="text" 
                        placeholder="Note Title" 
                        className="input input-bordered w-full" 
                    />


                    <textarea 
                        {...register("description", { required: true })} 
                        className="textarea textarea-bordered h-32 w-full" 
                        placeholder="Note content...">
                    </textarea>



                    <div className="modal-action">
                        <button type="submit" className="btn btn-primary" disabled={mutation.isLoading}>
                            {mutation.isLoading ? 'Saving...' : 'Save'}
                        </button>
                         <button type="button" className="btn" onClick={onClose}>Cancel</button>
                    </div>



                </form>
            </div>



        </dialog>
    );
};

export default NoteModal;