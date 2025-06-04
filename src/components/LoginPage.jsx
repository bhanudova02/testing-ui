import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
const LoginPage = () => {
    const navigate = useNavigate();

    // Custom Btn Functon
    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => { // Rename to tokenResponse for clarity
            console.log("Token Response from useGoogleLogin:", tokenResponse);
            // This 'tokenResponse' contains an 'access_token', not a 'credential' (ID token).
            // To get user info, you'd typically fetch it using this access_token:
            try {
                const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: {
                        'Authorization': `Bearer ${tokenResponse.access_token}`
                    }
                });
                const userInfo = await userInfoResponse.json();
                console.log("User Info from useGoogleLogin (fetched):", userInfo);
                localStorage.setItem("user", JSON.stringify(userInfo));
                navigate('/home');
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        },
        onError: () => {
            console.log("Login Failed via useGoogleLogin");
        },
    });


    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-blue-100 px-4">
            <div className="bg-[#FBFBFB] p-6 rounded-2xl shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>

                <label className="block mb-2 text-gray-700 font-medium" htmlFor="mobile">
                    Mobile Number
                </label>
                <input
                    type="tel"
                    id="mobile"
                    placeholder="Enter 10-digit mobile number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                    className="w-full bg-blue-600 text-white py-2 rounded-lg mt-4 hover:bg-blue-700 transition"
                >
                    Continue
                </button>

                <div className="my-4 flex items-center">
                    <hr className="flex-grow border-t border-gray-300" />
                    <span className="mx-2 text-gray-400 text-sm">OR</span>
                    <hr className="flex-grow border-t border-gray-300" />
                </div>

                <div>
                    {/* Custom Btn */}
                    <button onClick={() => login()} className="bg-[#FEFEFE] mb-4 border border-gray-300 cursor-pointer rounded-md flex items-center gap-2 px-2 py-2.5 w-full justify-center hover:bg-gray-100 transition-all">
                        <FcGoogle />
                        <span className='text-sm'>Sign With Google</span>
                    </button>

                    <GoogleLogin
                        onSuccess={(credentialResponse) => {
                            console.log(credentialResponse)
                            console.log(jwtDecode(credentialResponse.credential))
                            localStorage.setItem("user", JSON.stringify(jwtDecode(credentialResponse.credential)));
                            navigate('/home')
                        }}
                        onError={() => console.log("Login Failed")}
                    />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
