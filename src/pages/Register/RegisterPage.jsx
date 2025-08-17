import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import axios from 'axios';
import { updateProfile } from 'firebase/auth';
import toast from 'react-hot-toast';

const RegisterPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { createUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const onSubmit = data => {
        const toastId = toast.loading("Creating your account...");

        createUser(data.email, data.password)
            .then(result => {
                
                updateProfile(result.user, {
                    displayName: data.name,
                    photoURL: data.photoURL
                });

               
                const userInfo = {

                    name: data.name,
                    email: data.email,
                    photoURL: data.photoURL,
                    password: data.password,
                    role: data.role

                };



                axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, userInfo)

                    .then(res => {

                        if (res.status === 201) {

                            toast.success("Registration Successful! Please log in.", { id: toastId });
                            navigate('/login');
                            
                        }
                    })
                    .catch(err => {
                        const errorMessage = err.response?.data?.message || "Could not register on our server.";
                        toast.error(errorMessage, { id: toastId });
                    });
            })
            .catch(error => {

                toast.error("Registration Failed. This email might already be in use.", { id: toastId });
            });
    };



    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="card w-full max-w-sm shrink-0 shadow-2xl bg-base-100">

                <form onSubmit={handleSubmit(onSubmit)} className="card-body">

                    <h1 className="text-3xl font-bold text-center">Sign Up!</h1>

                    <div className="form-control">
                        <label className="label"><span className="label-text">Name</span></label>
                        <input type="text" {...register("name", { required: true })} placeholder="Your Name" className="input input-bordered" />
                        {errors.name && <span className="text-red-600 text-sm mt-1">Name is required</span>}
                    </div>



                    <div className="form-control">
                        <label className="label"><span className="label-text">Photo URL</span></label>
                        <input type="text" {...register("photoURL")} placeholder="Photo URL" className="input input-bordered" />
                    </div>



                    <div className="form-control">
                        <label className="label"><span className="label-text">Email</span></label>
                        <input type="email" {...register("email", { required: true })} placeholder="email" className="input input-bordered" />
                        {errors.email && <span className="text-red-600 text-sm mt-1">Email is required</span>}
                    </div>



                    <div className="form-control">
                        <label className="label"><span className="label-text">Password</span></label>
                        <input type="password" {...register("password", { required: true, minLength: 6 })} placeholder="password" className="input input-bordered" />
                        {errors.password?.type === 'minLength' && <span className="text-red-600 text-sm mt-1">Password must be at least 6 characters</span>}
                    </div>



                    <div className="form-control">
                        <label className="label"><span className="label-text">Register as</span></label>
                        <select {...register("role")} className="select select-bordered" defaultValue="student">
                            <option value="student">Student</option>
                            <option value="tutor">Tutor</option>
                        </select>
                    </div>



                    <div className="form-control mt-6">
                        <button className="btn btn-primary">Sign Up</button>
                    </div>

                    
                </form>

                <p className='text-center mb-4'>Already have an account? <Link to="/login" className="link link-primary">Login</Link></p>
            </div>
        </div>
    );
};

export default RegisterPage;