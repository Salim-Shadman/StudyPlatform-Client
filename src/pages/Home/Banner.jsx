import { Link } from "react-router-dom";

const Banner = () => {

    const bannerStyle = {
        backgroundImage: `url('https://1yjdjx7w77.ufs.sh/f/cbplOWXegZ6FiJCE3DrWJRtGdDr1YpfE90OC7ueTMnbHQ8FI')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };



    return (

        <div className="hero min-h-[60vh] rounded-lg my-6" style={bannerStyle}>

            <div className="hero-overlay bg-opacity-60 rounded-lg"></div>

            <div className="hero-content text-center text-neutral-content px-4">

                <div className="max-w-md">
                    <h1 className="mb-5 text-4xl md:text-5xl font-bold">Collaborate and Learn Together</h1>
                    <p className="mb-5">Join study sessions, connect with expert tutors, and access valuable resources to excel in your studies.</p>
                    <Link to="/all-sessions" className="btn btn-primary">Get Started</Link>
                </div>

                
            </div>


        </div>
    );
};

export default Banner;