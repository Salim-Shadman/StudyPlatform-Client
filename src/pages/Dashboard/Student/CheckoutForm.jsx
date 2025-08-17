import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import toast from 'react-hot-toast';

const CheckoutForm = ({ sessionDetails }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [clientSecret, setClientSecret] = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {

        if (sessionDetails?.registrationFee > 0) {
            const token = localStorage.getItem('access-token');
            axios.post(`${import.meta.env.VITE_API_URL}/api/payment/create-payment-intent`,
                { price: sessionDetails.registrationFee },
                { headers: { authorization: `Bearer ${token}` } }
            )
            .then(res => {
                setClientSecret(res.data.clientSecret);
            });
        }

    }, [sessionDetails]);

    const handleSubmit = async (event) => {

        event.preventDefault();
        if (!stripe || !elements) return;

        setProcessing(true);
        setError('');



        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    email: user?.email || 'N/A',
                    name: user?.displayName || 'N/A',
                },
            },

        });

        if (confirmError) {


            setError(confirmError.message);
            setProcessing(false);
            return;



        }

        if (paymentIntent.status === 'succeeded') {

            const toastId = toast.loading("Finalizing your booking...");
            try {

                const token = localStorage.getItem('access-token');
                await axios.post(
                    
                    `${import.meta.env.VITE_API_URL}/api/student/book-session/${sessionDetails._id}`, {},
                    { headers: { authorization: `Bearer ${token}` } }
                );
                toast.success("Payment Successful! Your session is booked.", { id: toastId });
                navigate('/dashboard/my-booked-sessions');

            } catch (err) {
                toast.error("Payment was successful, but we couldn't finalize your booking. Please contact support.", { id: toastId });
            }
        }
        setProcessing(false);
    };




    return (
        <form onSubmit={handleSubmit} className="bg-base-200 p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Provide Your Card Information</h2>
            <CardElement
                options={{
                    style: {
                        base: { fontSize: '16px', color: '#424770', '::placeholder': { color: '#aab7c4' } },
                        invalid: { color: '#9e2146' },
                    },
                }}
            />
            {error && <p className="text-red-600 mt-4">{error}</p>}

            
            <button
                type="submit"
                className="btn btn-primary w-full mt-6"
                disabled={!stripe || !clientSecret || processing}
            >
                {processing ? <span className="loading loading-spinner"></span> : `Pay $${sessionDetails?.registrationFee}`}
            </button>


        </form>
    );
};

export default CheckoutForm;