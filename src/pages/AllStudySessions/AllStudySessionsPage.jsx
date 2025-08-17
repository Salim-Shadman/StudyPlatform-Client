import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import SessionCard from '../../components/SessionCard';
import SessionCardSkeleton from '../../components/SessionCardSkeleton';
import { useSearchParams, Link } from 'react-router-dom';

const AllStudySessionsPage = () => {


    const [searchParams, setSearchParams] = useSearchParams();

    const category = searchParams.get('category');

    const [currentPage, setCurrentPage] = useState(1);
    const [sort, setSort] = useState({ sortBy: 'createdAt', order: 'desc' });

    useEffect(() => {
        setCurrentPage(1);
    }, [category]);



    const { data, isLoading, isError, error, isPlaceholderData } = useQuery({

        queryKey: ['sessions-all', currentPage, sort, category],

        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/sessions`, {
                params: {
                    page: currentPage,
                    limit: 6,
                    sortBy: sort.sortBy,
                    order: sort.order,
                    category: category || undefined
                }
            });
            return res.data;
        },


        placeholderData: (previousData) => previousData,


    });





    const handleSortChange = (e) => {

        const value = e.target.value;

        if (value === 'fee-asc') {
            setSort({ sortBy: 'registrationFee', order: 'asc' });

        } else if (value === 'fee-desc') {
            setSort({ sortBy: 'registrationFee', order: 'desc' });
        } else {
            setSort({ sortBy: 'createdAt', order: 'desc' });
        }
        setCurrentPage(1);


    };




    if (isError) {
        return <div className="text-center my-10 text-red-500">Error loading sessions: {error.message}</div>;
    }

    return (
        <div className="py-8">


            <div className="flex flex-col sm:flex-row justify-between items-center mb-10">

                <h1 className="text-3xl md:text-4xl font-bold text-center">
                    {category ? `Sessions in: ${category}` : 'All Available Sessions'}
                </h1>


                <div className="form-control w-full max-w-xs mt-4 sm:mt-0">
                    <select className="select select-bordered" onChange={handleSortChange} defaultValue="">
                        <option value="" disabled>Sort by</option>
                        <option value="latest">Latest</option>
                        <option value="fee-asc">Price: Low to High</option>
                        <option value="fee-desc">Price: High to Low</option>
                    </select>
                </div>


            </div>




            {category && (

                <div className="mb-8 text-center">
                    <Link to="/all-sessions" className="btn btn-ghost btn-sm">
                        &larr; Back to All Sessions
                    </Link>
                </div>

            )}

            {!isLoading && data?.sessions.length === 0 && (

                <div className="text-center my-10 p-8 bg-base-200 rounded-lg">
                    <h2 className="text-2xl font-bold">No Sessions Found</h2>
                    <p className="mt-2">There are currently no available sessions for this category.</p>
                </div>

            )}
            



            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {isLoading ? (
                    Array.from({ length: 6 }).map((_, index) => <SessionCardSkeleton key={index} />)
                ) : (
                    data?.sessions.map(session => (
                        <SessionCard key={session._id} session={session} />
                    ))
                )}
            </div>
            


            {data?.totalPages > 1 && (
                 <div className="flex justify-center mt-12">


                    <div className="join flex-wrap">
                        <button 
                            onClick={() => setCurrentPage(old => Math.max(old - 1, 1))} 
                            disabled={currentPage === 1}
                            className="join-item btn"
                        >
                            «
                        </button>
                        
                        {[...Array(data?.totalPages).keys()].map(pageNumber => (
                            <button
                                key={pageNumber + 1}
                                onClick={() => setCurrentPage(pageNumber + 1)}
                                className={`join-item btn ${currentPage === pageNumber + 1 ? 'btn-active' : ''}`}
                            >
                                {pageNumber + 1}
                            </button>
                        ))}

                        <button 
                            onClick={() => setCurrentPage(old => old + 1)} 
                            disabled={currentPage === data?.totalPages || isPlaceholderData}
                            className="join-item btn"
                        >
                            »
                        </button>
                    </div>

                    
                </div>
            )}


        </div>
    );
};

export default AllStudySessionsPage;