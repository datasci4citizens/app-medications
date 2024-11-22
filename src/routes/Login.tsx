import { useState } from 'react';
import GoogleButton from 'react-google-button';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';

const LoginPage = () => {
	const [user, setUser] = useState([]);
	const [profile, setProfile] = useState([]);
    const navigate = useNavigate();
	
	const fetcher = (...args) => fetch(...args).then(res => res.json())
	const { data, error, isLoading } = useSWR(`${import.meta.env.VITE_SERVER_URL}/patients`, fetcher)

	const onLoginError = () => {
		console.log('Failed to sign in with google');
	};	  

	function fetchProtectedEndpoint() {
		fetch('http://localhost:8000/users/me', {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: Cookies.get('accessToken'),
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error('Access denied');
				}
				return response.json();
			})
			.then((data) => {
				console.log('Data:', data);
				return data;
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	}

	function login() {
		window.location.href = `${import.meta.env.VITE_BASE_URL_SERVER}/auth/login/google`;
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-primary">
			<img
				src="/medications.svg"
				alt="Logo medicamentos"
				className="w-64 h-64 rounded-full object-contain"
			/>
			<div className="mt-40">
				<GoogleButton label="Entrar com o Google" onClick={login} />
			</div>
		</div>
	);
};

export default LoginPage;