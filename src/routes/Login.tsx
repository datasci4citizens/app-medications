import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
    const [user, setUser] = useState([]);
    const [profile, setProfile] = useState([]);

    const onLoginSuccess = credentialResponse => {
        console.log(credentialResponse)
    };

    const onLoginError = () => {
        console.log("Failed to sign in with google")
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-primary">
            <div className="w-64 h-64 bg-white rounded-full"></div>
            <div className="mt-8">
                <GoogleLogin onSuccess={onLoginSuccess} onError={onLoginError} useOneTap />
            </div>
        </div>
    );
};

export default LoginPage;