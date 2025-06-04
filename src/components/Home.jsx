import { googleLogout } from '@react-oauth/google';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    function handleLogout() {
        googleLogout();
        localStorage.removeItem("user");
        navigate("/");
    }

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-4">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md text-center">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Welcome to Home Page</h2>

                {user && (
                    <div className='mb-4'>
                        <p className="text-lg text-gray-700">
                            Hello, <span className="font-semibold">{user?.name}</span> 👋
                        </p>
                        <div>
                            <b>Email: {user.email}</b>
                        </div>
                    </div>
                )}

                {user ? <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition duration-200"
                >
                    Logout
                </button> :
                    <button
                        onClick={() => navigate('/')}
                        className="bg--500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition duration-200"
                    >
                        Login
                    </button>
                }
            </div>
        </div>
    );
};

export default Home;
