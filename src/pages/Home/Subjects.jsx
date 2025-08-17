import { FaCode, FaPaintBrush, FaDatabase, FaBullhorn, FaObjectGroup, FaLaptopCode } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const subjects = [
    { name: 'Web Development', icon: <FaCode />, color: 'text-primary' },
    { name: 'Data Science', icon: <FaDatabase />, color: 'text-secondary' },
    { name: 'Programming', icon: <FaLaptopCode />, color: 'text-accent' },
    { name: 'UI/UX Design', icon: <FaObjectGroup />, color: 'text-info' },
    { name: 'Graphic Design', icon: <FaPaintBrush />, color: 'text-success' },
    { name: 'Digital Marketing', icon: <FaBullhorn />, color: 'text-warning' },
];

const Subjects = () => {
    return (
        <div className="my-16 py-12">


            <div className="text-center mb-12">
                <h2 className="text-4xl font-extrabold">Explore by Subject</h2>
                <p className="text-lg text-base-content/70 mt-2 max-w-2xl mx-auto">
                    Find the perfect study session by browsing our most popular categories.
                </p>
            </div>


            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {subjects.map((subject) => (

                    <Link
                        key={subject.name}
                        to={`/all-sessions?category=${encodeURIComponent(subject.name)}`}
                        className="card bg-base-100 shadow-lg hover:shadow-2xl border-2 border-transparent hover:border-primary transition-all duration-300 hover:-translate-y-2 text-center p-6 rounded-2xl"
                    >
                        <div className={`text-5xl mb-4 mx-auto ${subject.color}`}>
                            {subject.icon}
                        </div>
                        <h3 className="text-lg font-bold">{subject.name}</h3>
                    </Link>

                ))}
                
            </div>
        </div>
    );
};

export default Subjects;