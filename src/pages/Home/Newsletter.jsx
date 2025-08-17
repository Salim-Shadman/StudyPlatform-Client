import React, { useState } from 'react';
import toast from 'react-hot-toast';

const Newsletter = () => {
   
    const [email, setEmail] = useState('');

   
    const handleSubscribe = (event) => {
        
        event.preventDefault();

        
        if (!email || !email.includes('@')) {
            toast.error("Please enter a valid email address.");
            return;
        }

        
        toast.success("Thank you for subscribing to our newsletter!");

        
        setEmail('');
    };

    return (
        <div className="my-16 p-10 bg-base-200 rounded-lg text-base-content">
            <div className="container mx-auto text-center">
                <h2 className="text-3xl font-bold mb-2">Subscribe to Our Newsletter</h2>
                <p className="mb-6 max-w-2xl mx-auto">
                    Stay updated with the latest study sessions, platform news, and exclusive learning tips. Join our community of learners today!
                </p>
                
                
                <form onSubmit={handleSubscribe} className="form-control max-w-sm mx-auto">
                    <div className="join">
                        <input
                            type="email"
                            placeholder="username@site.com"
                            className="input input-bordered join-item w-full"
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                        <button type="submit" className="btn btn-primary join-item">Subscribe</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Newsletter;