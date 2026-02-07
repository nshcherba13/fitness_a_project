import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from '../axiosConfig';
import '../css/login_register.css';

function isEmail(val) {
    let regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regEmail.test(val)) {
        return 'Invalid Email';
    }
}

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirm_password: '',
        age: '',
        gender: '',
        fitness_level: '',
        weight: '',
        height: '',
    });

    const [errors, setErrors] = useState({});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Full Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else {
            const emailError = isEmail(formData.email);
            if (emailError) newErrors.email = emailError;
        }
        if (!formData.password.trim()) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }
        if (formData.password !== formData.confirm_password) {
            newErrors.confirm_password = 'Passwords do not match';
        }
        if (!formData.age || formData.age < 16 || formData.age > 100) {
            newErrors.age = 'Age must be between 16 and 100';
        }
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!formData.fitness_level) newErrors.fitness_level = 'Fitness level is required';
        if (!formData.weight || formData.weight < 30 || formData.weight > 300) {
            newErrors.weight = 'Weight must be between 30 and 300 kg';
        }
        if (!formData.height || formData.height < 100 || formData.height > 300) {
            newErrors.height = 'Height must be between 100 and 300 cm';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            const response = await axios.post('/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                age: parseInt(formData.age, 10),
                gender: formData.gender,
                fitness_level: formData.fitness_level,
                weight: parseInt(formData.weight, 10),
                height: parseInt(formData.height, 10),
            });

            setSuccess(true);
            setError('');
            alert('Account successfully created!');
            navigate('/login');
        } catch (err) {
            if (err.response && err.response.data) {

                if (typeof err.response.data.message === 'object') {
                    setErrors(err.response.data.message);
                } else {
                    setError(err.response.data.message || 'An unexpected error occurred');
                }
            } else {
                setError('An unexpected error occurred');
            }
        }
    };

    return (
        <div>
            <div className="container-fluid bg-gray min-vh-100">
                <div className="row d-flex justify-content-center">
                    <div className="col-12 text-center mb-2 mt-5 header-white p-1">
                        <a href='/'><img src="/images/logo.png" alt="Team-A Logo"
                                         className="img-fluid mb-4 mt-2 rounded logo-register"/></a>
                        <h1>become our member</h1>
                    </div>
                </div>

                <div className="row d-flex justify-content-center align-items-center">
                    <div className="col-md-5 mb-4 bg-white p-5 rounded-3">
                        {error && <p className="text-danger">{error}</p>}
                        {success && <p className="text-success">Registration successful! You can now log in.</p>}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Full Name:</label>
                                <input type="text" className="form-control" id="name" name="name"
                                       placeholder="Your name" onChange={handleChange}/>
                                {errors.name && <p className="text-danger">{errors.name}</p>}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email:</label>
                                <input type="email" className="form-control" id="email" name="email"
                                       placeholder="email@example.com" onChange={handleChange}/>
                                {errors.email && <p className="text-danger">{errors.email}</p>}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password:</label>
                                <input type="password" className="form-control" id="password" name="password"
                                       onChange={handleChange}/>
                                {errors.password && <p className="text-danger">{errors.password}</p>}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="confirm_password" className="form-label">Confirm Password:</label>
                                <input type="password" className="form-control" id="confirm_password"
                                       name="confirm_password" onChange={handleChange}/>
                                {errors.confirm_password && <p className="text-danger">{errors.confirm_password}</p>}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="age" className="form-label">Your age:</label>
                                <input type="number" className="form-control" id="age" name="age" min={16} max={100}
                                       onChange={handleChange}/>
                                {errors.age && <p className="text-danger">{errors.age}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="form-label">Gender:</label>
                                <input type="radio" className="m-2" name="gender" value="male"
                                       onChange={handleChange}/> Man
                                <input type="radio" className="m-2" name="gender" value="female"
                                       onChange={handleChange}/> Woman
                                <input type="radio" className="m-2" name="gender" value="other"
                                       onChange={handleChange}/> Other
                                {errors.gender && <p className="text-danger">{errors.gender}</p>}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="fitness_level" className="form-label">I am...</label>
                                <select id="fitness_level" className="form-control" name="fitness_level"
                                        onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Profi</option>
                                </select>
                                {errors.fitness_level && <p className="text-danger">{errors.fitness_level}</p>}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="weight" className="form-label">Weight (kg):</label>
                                <input type="number" className="form-control" id="weight" name="weight" placeholder="70"
                                       min={30} max={300} onChange={handleChange}/>
                                {errors.weight && <p className="text-danger">{errors.weight}</p>}

                            </div>

                            <div className="mb-3">
                                <label htmlFor="height" className="form-label">Height (cm):</label>
                                <input type="number" className="form-control" id="height" name="height"
                                       placeholder="170" min={100} max={300} onChange={handleChange}/>
                                {errors.height && <p className="text-danger">{errors.height}</p>}
                            </div>

                            <div className="d-flex justify-content-center">
                                <button type="submit" className="btn-font club-btn w-50 login-btn">join the club
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="mb-3 text-center">
                        <p><a href="/login" className="link-primary">already have an account? log in here</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;

