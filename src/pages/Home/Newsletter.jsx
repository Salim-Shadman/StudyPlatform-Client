const Newsletter = () => {
    return (
        <div className="my-16 p-10 bg-base-200 rounded-lg text-base-content">
            <div className="container mx-auto text-center">
                <h2 className="text-3xl font-bold mb-2">Subscribe to Our Newsletter</h2>
                <p className="mb-6 max-w-2xl mx-auto">
                    Stay updated with the latest study sessions, platform news, and exclusive learning tips. Join our community of learners today!
                </p>
                <div className="form-control max-w-sm mx-auto">
                    <div className="join">
                        <input
                            type="email"
                            placeholder="username@site.com"
                            className="input input-bordered join-item w-full"
                        />
                        <button className="btn btn-primary join-item">Subscribe</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Newsletter;