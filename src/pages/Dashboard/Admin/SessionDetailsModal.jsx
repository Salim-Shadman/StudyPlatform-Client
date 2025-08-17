import React from 'react';
import { FaExternalLinkAlt, FaImages, FaTimes } from 'react-icons/fa';

const SessionDetailsModal = ({ session, materials, onClose }) => {
    if (!session) return null;

    return (
        <dialog className="modal modal-open">
            <div className="modal-box w-11/12 max-w-4xl">
                <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"><FaTimes /></button>

                <h2 className="text-2xl font-bold mb-4">{session.sessionTitle}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


                   
                    <div>

                        <div className="mb-4">
                            <img src={session.imageUrl} alt={session.sessionTitle} className="w-full h-48 object-cover rounded-lg shadow-md" />
                        </div>


                        <p className="mb-4 text-base-content/80">{session.sessionDescription}</p>

                        <div className="space-y-2 text-sm p-4 bg-base-200 rounded-lg">
                            <p><strong>Tutor:</strong> {session.tutorName} ({session.tutorEmail})</p>
                            <p><strong>Fee:</strong> ${session.registrationFee}</p>
                            <p><strong>Duration:</strong> {session.sessionDuration}</p>
                            <p><strong>Registration:</strong> {new Date(session.registrationStartDate).toLocaleDateString()} to {new Date(session.registrationEndDate).toLocaleDateString()}</p>
                            <p><strong>Class Dates:</strong> {new Date(session.classStartDate).toLocaleDateString()} to {new Date(session.classEndDate).toLocaleDateString()}</p>
                        </div>


                    </div>

                   



                    <div>
                        <h3 className="text-xl font-bold mb-3">Uploaded Materials</h3>
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                            {materials.length > 0 ? (
                                materials.map(material => (
                                    <div key={material._id} className="card bg-base-200 shadow-sm">
                                        <div className="card-body p-4">
                                            <h4 className="card-title text-base">{material.title}</h4>
                                            <div className="flex items-center gap-4 mt-2">
                                                {material.imageUrl && (
                                                    <a href={material.imageUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline flex-1">
                                                        <FaImages className="mr-2" /> View Image
                                                    </a>
                                                )}
                                                {material.documentLink && (
                                                    <a href={material.documentLink} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline flex-1">
                                                        <FaExternalLinkAlt className="mr-2" /> View Link
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))


                            ) : (
                                <div className="p-4 text-center bg-base-200 rounded-lg">
                                    <p>No materials have been uploaded for this session yet.</p>
                                </div>

                            )}
                        </div>
                    </div>
                </div>



                <div className="modal-action mt-6">
                    <button type="button" className="btn" onClick={onClose}>Close</button>
                </div>
                
            </div>
        </dialog>
    );
};

export default SessionDetailsModal;