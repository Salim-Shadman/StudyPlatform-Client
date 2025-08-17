import { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast'; 

const LoginPage = () => {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signIn, googleSignIn } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";



    const handleLogin = data => {

        const toastId = toast.loading("Logging in...");

        signIn(data.email, data.password)
            .then(() => {


                axios.post(`${import.meta.env.VITE_API_URL}/api/auth/record-login`, { email: data.email })

                    .then(() => {

                        toast.success("Login Successful!", { id: toastId });
                        navigate(from, { replace: true });

                    })
                    .catch(err => {

                        console.error("Failed to record login history:", err);
                        toast.success("Login Successful!", { id: toastId });
                        navigate(from, { replace: true });

                    });


            })
            .catch(error => {

                toast.error("Incorrect email or password.", { id: toastId });

            });
    };
    
    const handleGoogleSignIn = () => {

        const toastId = toast.loading("Signing in with Google...");

        googleSignIn()
            .then(result => {

                const loggedInUser = result.user;
                const userInfo = {
                    name: loggedInUser.displayName,
                    email: loggedInUser.email,
                    photoURL: loggedInUser.photoURL,
                };
                


                axios.post(`${import.meta.env.VITE_API_URL}/api/auth/social-login`, userInfo)
                    .then(() => {
                        toast.success("Login Successful!", { id: toastId });
                        navigate(from, { replace: true });
                    });


            })

            .catch(error => {

                toast.error(error.message, { id: toastId });

            });
    }

    return (
        <div className="hero min-h-screen bg-base-200">


            <div className="card w-full max-w-sm shrink-0 shadow-2xl bg-base-100">


                <form onSubmit={handleSubmit(handleLogin)} className="card-body">
                    <h1 className="text-3xl font-bold text-center">Login Now!</h1>

                    <div className="form-control">
                        <label className="label"><span className="label-text">Email</span></label>
                        <input type="email" {...register("email", { required: "Email is required" })} placeholder="email" className="input input-bordered" />
                        {errors.email && <span className="text-red-600 text-sm mt-1">{errors.email.message}</span>}
                    </div>

                    <div className="form-control">
                        <label className="label"><span className="label-text">Password</span></label>
                        <input type="password" {...register("password", { required: "Password is required" })} placeholder="password" className="input input-bordered" />
                         {errors.password && <span className="text-red-600 text-sm mt-1">{errors.password.message}</span>}
                    </div>

                    <div className="form-control mt-6">
                        <button type="submit" className="btn btn-primary">Login</button>
                    </div>
                    
                </form>


                <div className="divider px-8">OR</div>

                <div className="px-8 pb-4">

                    <button onClick={handleGoogleSignIn} className="btn btn-outline w-full">Sign in with Google</button>


                </div>


                <p className='text-center mb-4'>New here? <Link to="/register" className="link link-primary">Create an account</Link></p>
            </div>


        </div>
    );
};

export default LoginPage;