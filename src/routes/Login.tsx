import { useState } from 'react';
import GoogleButton from 'react-google-button';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
	const [user, setUser] = useState([]);
	const [profile, setProfile] = useState([]);
    const navigate = useNavigate();

	function login() {
		window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/login/google`;
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-primary">
			<img
				src="/medications.svg"
				alt="Logo medicamentos"
				className="w-64 h-64 object-contain"
			/>
			<div className="mt-40">
				<GoogleButton label="Entrar com o Google" onClick={login} />
			</div>
		</div>
	);
};

export default LoginPage;