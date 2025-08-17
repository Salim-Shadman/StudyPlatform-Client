import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SessionCardSkeleton = () => {
    return (
        <div className="card bg-base-100 shadow-xl border border-base-300 rounded-lg overflow-hidden">
            <Skeleton height={192} />
            <div className="card-body p-4">
                <Skeleton height={28} width="80%" />
                <Skeleton count={2} />
                <div className="flex justify-between items-center mt-4">
                    <Skeleton height={24} width={70} />
                    <Skeleton height={32} width={80} />
                </div>
            </div>
        </div>
    );
};

export default SessionCardSkeleton;