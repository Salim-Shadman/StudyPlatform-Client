import { useState, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../../../contexts/AuthContext';
import axios from 'axios';
import NoteCard from './NoteCard'; 
import NoteModal from './NoteModal'; 

const ManageNotes = () => {



    const { user } = useContext(AuthContext);
    const [modalState, setModalState] = useState({ isOpen: false, note: null });


    //logged in user er notes fetch korar jonno query use kora hoilo
    const { data: notes = [], isLoading } = useQuery({

        queryKey: ['notes', user?.email],

        queryFn: async () => {
            const token = localStorage.getItem('access-token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/student/notes`, {
                headers: { authorization: `Bearer ${token}` }
            });
            return res.data;
        },

        enabled: !!user?.email,


    });




    if (isLoading) return <div className="text-center"><span className="loading loading-dots loading-lg"></span></div>;




    return (



        <div className="w-full">

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">My Personal Notes</h1>
                <button className="btn btn-primary" onClick={() => setModalState({ isOpen: true, note: null })}>
                    Create New Note
                </button>
            </div>
            



            {notes.length > 0 ? (

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {notes.map(note => (

                        <NoteCard 
                            key={note._id} 
                            note={note} 
                            onEdit={() => setModalState({ isOpen: true, note: note })} 
                        />

                    ))}
                </div>

            ) : (
                <p>You haven't created any notes yet. Click the button above to get started!</p>
            )}



            <NoteModal 
                modalState={modalState} 
                onClose={() => setModalState({ isOpen: false, note: null })}
            />

        </div>




    );
};

export default ManageNotes;