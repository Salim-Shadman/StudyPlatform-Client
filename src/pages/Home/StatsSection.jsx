import { Users, SlidersHorizontal, Zap } from "lucide-react";

const StatsSection = () => {

    return (
        <div className="my-16">

            <div className="container mx-auto px-4">

                <h2 className="text-3xl font-bold text-center mb-8">Our Growing Community</h2>

                <div className="stats shadow-xl w-full stats-vertical lg:stats-horizontal">



                    <div className="stat">


                        <div className="stat-figure text-primary">
                            <Users className="w-8 h-8" />
                        </div>
                        <div className="stat-title">Total Users</div>
                        <div className="stat-value">500+</div>
                        <div className="stat-desc">Students & Tutors</div>
                    </div>


                    <div className="stat">
                        <div className="stat-figure text-secondary">
                            <SlidersHorizontal className="w-8 h-8" />
                        </div>
                        <div className="stat-title">Expert Tutors</div>
                        <div className="stat-value">50+</div>
                        <div className="stat-desc">Verified Professionals</div>
                    </div>



                    <div className="stat">

                        <div className="stat-figure text-accent">
                            <Zap className="w-8 h-8" />
                        </div>
                        <div className="stat-title">Active Sessions</div>
                        <div className="stat-value">100+</div>
                        <div className="stat-desc">Across various subjects</div>
                        
                    </div>


                </div>



            </div>

        </div>
    );
};

export default StatsSection;
