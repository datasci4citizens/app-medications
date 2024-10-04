import { useState } from 'react';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import Cookies from 'js-cookie';
import GoogleButton from 'react-google-button';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
	const [user, setUser] = useState([]);
	const [profile, setProfile] = useState([]);
    const navigate = useNavigate();

	const onLoginSuccess = (credentialResponse) => {
		console.log(credentialResponse);
	};

	const login = useGoogleLogin({
		onSuccess: (codeResponse) => handleCredentialResponse(codeResponse),
		flow: 'auth-code',
	});

	const onLoginError = () => {
		console.log('Failed to sign in with google');
	};

	function handleCredentialResponse(response) {
		const accessToken = response.code;

		console.log(response);

        navigate("/registro-paciente");

		fetch('http://localhost:8000/auth/google', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Requested-With': 'XMLHttpRequest',
			},
			body: JSON.stringify({ access_token: accessToken }),
			credentials: 'include',
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error('Error while authenticating with server');
				}
				return response.json();
			})
			.then((data) => {
				console.log('Access token:', data.access_token);
				saveAccessToken(data.access_token);
			})
			.catch((error) => console.error('Error:', error));
	}

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

	function saveAccessToken(accessToken) {
		Cookies.set('accessToken', accessToken, { expires: 1 });
		console.log('Token saved to cookie!');
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-primary">
			<div className="w-64 h-64 bg-white rounded-full"></div>
			<div className="mt-8">
				<GoogleButton label="Entrar com o Google" onClick={login} />
			</div>
		</div>
	);
};

export default LoginPage;