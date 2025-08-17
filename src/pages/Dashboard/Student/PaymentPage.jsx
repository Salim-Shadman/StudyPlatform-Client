import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import axios from "axios";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentPage = () => {

    const { sessionId } = useParams();


    const { data: sessionData, isLoading } = useQuery({

        queryKey: ['sessionDetailsPayment', sessionId],

        queryFn: async () => {

            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/sessions/${sessionId}`);
            return res.data;

        }


    });




    if (isLoading) {

        return <div className="text-center my-20"><span className="loading loading-spinner loading-lg"></span></div>;

    }



    const { session } = sessionData;

    return (

        <div className="max-w-md mx-auto my-12 p-4">

            <h1 className="text-3xl font-bold text-center mb-2">Complete Your Payment</h1>
            <p className="text-center mb-8">You are booking: <span className="font-semibold">{session.sessionTitle}</span></p>
            <Elements stripe={stripePromise}>
                <CheckoutForm sessionDetails={session} />
            </Elements>
            
        </div>

    );
};

export default PaymentPage;