import React, {useContext, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from '../axiosConfig';
import '../css/login_register.css';
import AuthContext from '../context/AuthProvider';
const LOGIN_URL = '/login';

const Login = () => {
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [errors, setErrors] = useState({});

    const [error, setError] = useState('');

    const validateEmail = (val) => {
        let regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regEmail.test(val) ? null : 'Invalid Email';
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};

        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else {
            const emailError = validateEmail(email);
            if (emailError) newErrors.email = emailError;
        }

        if (!password.trim()) {
            newErrors.password = 'Password is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }


        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ email, password }),
                { headers: { 'Content-Type': 'application/json' } }
            );

            const { access_token, role } = response.data;

            setAuth({ token: access_token, role });
            localStorage.setItem('token',access_token);
//            localStorage.setItem('userId',access_token);
            if (role === 'admin') {
                navigate('/admin/home');
            } else if (role === 'trainer') {
                navigate('/trainer');
            } else {
                navigate('/user/home');
            }
        } catch (err) {
            if (err.response?.status === 401) {
                setError('Invalid email or password');
            } else {
                setError('An unexpected error occurred');
            }
        }
    };

    return (
        <div>
            <div className="container-fluid bg-black min-vh-100">
                <div className="row d-flex justify-content-center">
                    <div className="col-12 text-center mb-5 mt-5 header-white p-1">
                        <h1>login</h1>
                    </div>
                </div>

                <div className="row d-flex justify-content-center align-items-center">
                    <div className="col-md-5 mb-4 bg-white p-5 rounded-3">
                        {error && <p className="text-danger text-center">{error}</p>}

                        <form onSubmit={handleSubmit} noValidate>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email:</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    placeholder="email@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                {errors.email && <p className="text-danger">{errors.email}</p>}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password:</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    name="password"
                                    placeholder="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                {errors.password && <p className="text-danger">{errors.password}</p>}
                            </div>

                            <div className="d-flex justify-content-center">
                                <button type="submit" className="btn-font club-btn w-50 login-btn">login</button>
                            </div>
                        </form>
                    </div>
                    <div className="mb-3 text-center">
                        <p><a href="/register" className="link-primary">don't have an account? create one here</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
