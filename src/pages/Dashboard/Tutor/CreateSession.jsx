import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../../contexts/AuthContext';
import toast from 'react-hot-toast';


const categories = [
    'Web Development', 'Data Science', 'Programming', 
    'UI/UX Design', 'Graphic Design', 'Digital Marketing'
];

const CreateSession = () => {

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
       
        defaultValues: {
            category: "" 
        }
    });

    
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: (newSession) => {
            const token = localStorage.getItem('access-token');
            return axios.post(`${import.meta.env.VITE_API_URL}/api/sessions/create`, newSession, { headers: { authorization: `Bearer ${token}` } });
        },

        onSuccess: () => {

            queryClient.invalidateQueries({ queryKey: ['mySessions'] });
            toast.success('Session request sent for admin approval.');
            navigate('/dashboard/my-sessions');
            reset();

        },

        onError: (error) => toast.error(error.response?.data?.message || 'Failed to create session.'),

    });

    const onSubmit = (data) => {
        if (!data.imageUrl) {
            delete data.imageUrl;
        }
        mutation.mutate(data);
    };


    return (
        <div className="w-full max-w-4xl p-8 mx-auto bg-base-100 shadow-lg rounded-lg">

            <h1 className="text-3xl font-bold mb-6 text-center">Create a New Study Session</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">


                <div>
                    <label className="label"><span className="label-text">Session Title*</span></label>
                    <input type="text" {...register("sessionTitle", { required: "Title is required." })} className="input input-bordered w-full" />
                    {errors.sessionTitle && <span className="text-red-600 text-sm mt-1">{errors.sessionTitle.message}</span>}
                </div>

               
                <div>
                    <label className="label"><span className="label-text">Category*</span></label>
                    <select {...register("category", { required: "Category is required." })} className="select select-bordered w-full">
                        <option value="" disabled>Select a category</option>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    {errors.category && <span className="text-red-600 text-sm mt-1">{errors.category.message}</span>}
                </div>

                <div>
                    <label className="label"><span className="label-text">Session Description*</span></label>
                    <textarea {...register("sessionDescription", { required: "Description is required." })} className="textarea textarea-bordered w-full h-24"></textarea>
                     {errors.sessionDescription && <span className="text-red-600 text-sm mt-1">{errors.sessionDescription.message}</span>}
                </div>
                
                <div>
                    <label className="label"><span className="label-text">Image URL</span></label>
                    <input 
                        type="url" 
                        {...register("imageUrl")} 
                        className="input input-bordered w-full"
                        placeholder="https://example.com/image.jpg"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>
                        <label className="label"><span className="label-text">Registration Start Date*</span></label>
                        <input type="date" {...register("registrationStartDate", { required: true })} className="input input-bordered w-full" />
                    </div>

                    <div>
                        <label className="label"><span className="label-text">Registration End Date*</span></label>
                        <input type="date" {...register("registrationEndDate", { required: true })} className="input input-bordered w-full" />
                    </div>

                </div>



                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>
                        <label className="label"><span className="label-text">Class Start Date*</span></label>
                        <input type="date" {...register("classStartDate", { required: true })} className="input input-bordered w-full" />
                    </div>

                    <div>
                        <label className="label"><span className="label-text">Class End Date*</span></label>
                        <input type="date" {...register("classEndDate", { required: true })} className="input input-bordered w-full" />
                    </div>

                </div>




                <div>
                    <label className="label"><span className="label-text">Session Duration (e.g., '2 hours')*</span></label>
                    <input type="text" {...register("sessionDuration", { required: true })} className="input input-bordered w-full" />
                </div>

                
                <div className="pt-4">
                    <button type="submit" className="btn btn-primary w-full" disabled={mutation.isLoading}>
                        {mutation.isLoading ? 'Submitting...' : 'Request Session'}
                    </button>
                </div>

                
            </form>
        </div>
    );
};

export default CreateSession;