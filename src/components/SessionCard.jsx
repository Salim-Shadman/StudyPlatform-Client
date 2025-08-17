import React from 'react';
import { Link } from 'react-router-dom';

const SessionCard = ({ session }) => {
    const { _id, sessionTitle, sessionDescription, registrationEndDate, imageUrl } = session;

    const isRegistrationOpen = new Date(registrationEndDate) > new Date();
    const status = isRegistrationOpen ? 'Ongoing' : 'Closed';

    return (

        <div className="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-shadow duration-300 flex flex-col overflow-hidden rounded-lg">

            <figure>
                <img 
                    src={imageUrl || 'https://i.ibb.co/2k5z7Jb/default-session.jpg'} 
                    alt={sessionTitle} 
                    className="w-full h-48 object-cover"
                />
            </figure>



            <div className="card-body flex-grow flex flex-col p-4">
                <h2 className="card-title text-lg font-bold">{sessionTitle}</h2>
                <p className="text-base-content/80 text-sm flex-grow py-2">
                    {sessionDescription.substring(0, 100)}...
                </p>
                <div className="card-actions justify-between items-center mt-4">
                    <span className={`badge font-semibold ${isRegistrationOpen ? 'badge-success' : 'badge-error'}`}>
                        {status}
                    </span>
                    <Link to={`/session/${_id}`} className="btn btn-primary btn-sm">
                        See More
                    </Link>
                </div>
            </div>


            
        </div>
    );
};

export default React.memo(SessionCard);