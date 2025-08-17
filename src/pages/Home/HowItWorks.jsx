const HowItWorks = () => {

    return (
        <div className="py-16 bg-base-200 rounded-lg">


            <div className="container mx-auto px-4">

                <h2 className="text-3xl font-bold text-center mb-10">Start Your Learning Journey</h2>



                <ul className="steps steps-vertical lg:steps-horizontal w-full">

                    <li className="step step-primary">
                        <div className="text-center lg:text-left p-4">
                            <h3 className="font-bold">Register</h3>
                            <p className="text-sm">Create an account as a student or tutor in seconds.</p>
                        </div>
                    </li>


                    <li className="step step-primary">
                         <div className="text-center lg:text-left p-4">
                            <h3 className="font-bold">Browse Sessions</h3>
                            <p className="text-sm">Explore sessions hosted by our expert tutors.</p>
                        </div>
                    </li>


                    <li className="step step-primary">
                         <div className="text-center lg:text-left p-4">
                            <h3 className="font-bold">Book & Pay</h3>
                            <p className="text-sm">Book your desired session seamlessly and securely.</p>
                        </div>
                    </li>


                    <li className="step">
                         <div className="text-center lg:text-left p-4">
                            <h3 className="font-bold">Learn & Collaborate</h3>
                            <p className="text-sm">Join, interact, and enhance your knowledge.</p>
                        </div>
                    </li>

                    
                </ul>



            </div>



        </div>
    );
};

export default HowItWorks;