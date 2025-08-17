import { FaFacebook, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer = () => {


    return (



        <footer className="p-10 bg-base-200 text-base-content mt-10">

            <div className="footer container mx-auto grid-cols-1 text-center md:grid-cols-4 md:text-left">

                <aside>

                    <p className="text-2xl font-bold">StudyPlatform</p>
                    <p>Enhancing collaboration in education since 2024.</p>


                    <div className="grid grid-flow-col gap-4 mt-4 justify-center md:justify-start">

                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="link link-hover"><FaTwitter size={24} /></a>
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="link link-hover"><FaYoutube size={24} /></a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="link link-hover"><FaFacebook size={24} /></a>

                    </div>

                </aside>

                <nav>
                    <h6 className="footer-title">Platform</h6>
                    <a className="link link-hover">Home</a>
                    
                    <a className="link link-hover">Study Sessions</a>
                    <a className="link link-hover">Tutors</a>
                </nav>


                <nav>
                    <h6 className="footer-title">Company</h6>
                    <a className="link link-hover">About us</a>
                    <a className="link link-hover">Contact</a>
                </nav>


                <nav>
                    <h6 className="footer-title">Legal</h6>
                    <a className="link link-hover">Terms of use</a>
                    <a className="link link-hover">Privacy policy</a>
                </nav>


            </div>
        </footer>
    );
};

export default Footer;