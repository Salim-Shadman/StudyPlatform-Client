import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../contexts/AuthContext';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const ProfilePage = () => {
    const { dbUser, loading } = useContext(AuthContext);
    const queryClient = useQueryClient();


    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name: dbUser?.name,
            photoURL: dbUser?.photoURL,
            phoneNumber: dbUser?.phoneNumber || '',
            address: dbUser?.address || '',
        }
    });



    const mutation = useMutation({

        mutationFn: (updatedData) => {
            const token = localStorage.getItem('access-token');
            return axios.patch(`${import.meta.env.VITE_API_URL}/api/auth/profile`, updatedData, {
                headers: { authorization: `Bearer ${token}` }
            });
        },
        onSuccess: () => {


            toast.success("Your profile has been updated.");
            
            queryClient.invalidateQueries({ queryKey: ['dbUser'] }); 
            queryClient.invalidateQueries({ queryKey: ['allSessionsAdmin'] });

        },


        onError: () => {

            toast.error("Could not update your profile.");
        }
    });




    const onSubmit = (data) => {
        mutation.mutate(data);
    };



    if (loading) {
        return <div className="text-center"><span className="loading loading-spinner loading-lg"></span></div>;
    }



    return (
        <div className="max-w-4xl mx-auto">


            <h1 className="text-3xl font-bold mb-6">My Profile</h1>


            <div className="card bg-base-100 shadow-xl">

                <div className="card-body grid grid-cols-1 md:grid-cols-3 gap-6">

                    <div className="flex flex-col items-center col-span-1 p-4 bg-base-200 rounded-lg">
                        <div className="avatar mb-4">
                            <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                <img src={dbUser?.photoURL || 'https://i.ibb.co/d5bC4T8/default-avatar.jpg'} alt={dbUser?.name} />
                            </div>
                        </div>
                        <h2 className="text-xl font-bold">{dbUser?.name}</h2>
                        <p className="text-base-content/70">{dbUser?.email}</p>
                        <span className="badge badge-primary mt-2 capitalize">{dbUser?.role}</span>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="md:col-span-2 space-y-4">
                        <div className="form-control">
                            <label className="label"><span className="label-text">Full Name</span></label>
                            <input type="text" {...register("name", { required: true })} className="input input-bordered w-full" />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Photo URL</span></label>
                            <input type="url" {...register("photoURL")} className="input input-bordered w-full" />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Phone Number</span></label>
                            <input type="tel" {...register("phoneNumber")} className="input input-bordered w-full" placeholder="e.g., +8801..." />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Address</span></label>
                            <textarea {...register("address")} className="textarea textarea-bordered w-full" placeholder="Your address"></textarea>
                        </div>
                        <div className="form-control mt-6">
                            <button type="submit" className="btn btn-primary" disabled={mutation.isLoading}>
                                {mutation.isLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>

                    
                </div>
            </div>


        </div>
    );
};

export default ProfilePage;