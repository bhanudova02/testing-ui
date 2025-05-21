import { GoogleLogin,googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
    const navigate = useNavigate()
  
    return (
        <>
            <GoogleLogin
                onSuccess={(credentialResponse) => {
                    console.log(credentialResponse)
                    console.log(jwtDecode(credentialResponse.credential))
                    navigate('/home')
                }}
                onError={() => console.log("Login Failed")}
                auto_select={true}
            />

        </>
    )
}

export default LandingPage