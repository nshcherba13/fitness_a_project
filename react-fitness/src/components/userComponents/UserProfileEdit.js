import React, {useContext, useState} from "react";

import "../../css/general_styles.css";
import "../../css/fonts.css";
import "../../css/table.css";
import "../../css/profile.css";
import axios from "../../axiosConfig";
import AuthContext from "../../context/AuthProvider";
import {Link, useNavigate} from "react-router-dom";

function isEmail(val) {
    const regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regEmail.test(val)) {
        return "Invalid Email";
    }
}

const UserProfileEdit = ({token}) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        age: "",
        gender: "",
        fitness_level: "",
        weight: "",
        height: "",
        subscription_id: "",
        profile_picture: null,
    });

    const {auth} = useContext(AuthContext);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});
    const [preview, setPreview] = useState(null);
    const navigate = useNavigate();


    const validate = () => {
        const newErrors = {};

        if (formData.name && !formData.name.trim()) newErrors.name = "Full Name is required";
        if (formData.email) {
            const emailError = isEmail(formData.email);
            if (emailError) newErrors.email = emailError;
        }
        if (formData.password && formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }
        if (formData.age && (formData.age < 16 || formData.age > 100)) {
            newErrors.age = "Age must be between 16 and 100";
        }
        if (formData.gender && !["male", "female", "other"].includes(formData.gender)) {
            newErrors.gender = "Invalid gender selected";
        }
        if (formData.fitness_level && !["beginner", "intermediate", "advanced"].includes(formData.fitness_level)) {
            newErrors.fitness_level = "Invalid fitness level selected";
        }
        if (formData.weight && (formData.weight < 30 || formData.weight > 300)) {
            newErrors.weight = "Weight must be between 30 and 300 kg";
        }
        if (formData.height && (formData.height < 100 || formData.height > 300)) {
            newErrors.height = "Height must be between 100 and 300 cm";
        }
        if (formData.profile_picture) {
            const file = formData.profile_picture;

            if (!file.type.startsWith("image/")) {
                newErrors.profile_picture = "File must be an image";
            }

            const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
            if (!allowedTypes.includes(file.type)) {
                newErrors.profile_picture = "Only JPG, JPEG, and PNG files are allowed";
            }

            const maxSizeInBytes = 2 * 1024 * 1024;
            if (file.size > maxSizeInBytes) {
                newErrors.profile_picture = "Image size must be less than 2MB";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({
            ...formData,
            profile_picture: file,
        });

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const dataWithoutPhoto = new FormData();
            for (const key in formData) {
                if (key !== 'profile_picture' && formData[key]) {
                    dataWithoutPhoto.append(key, formData[key]);
                }
            }

            console.log(dataWithoutPhoto)

            await axios.put(`/account/update`, dataWithoutPhoto, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            });
            if (formData.profile_picture) {
                const photoData = new FormData();
                photoData.append('photo', formData.profile_picture);

                await axios.post(`/account/photo/update`, photoData, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                        "Content-Type": "multipart/form-data",
                    },
                });
            }
            alert("Data saved successfully!");
            navigate("/user/home");
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred");
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete your account? This action cannot be undone"
        );

        if (!confirmDelete) return;

        try {
            await axios.delete("/account/destroy", {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            });

            alert("Your account has been successfully deleted.");
            navigate("/login");
        } catch (error) {
            console.error("Failed to delete account:", error);
            alert(error.response?.data?.message || "Failed to delete account. Please try again");
        }
    };


    return (
        <div className="container mt-2">
            <div className="d-flex align-items-center">
                <Link to="/user/home" className="btn btn-link text-decoration-none position-relative">
                    <i
                        className="fas fa-solid fa-circle-arrow-left fa-2x me-4 mb-1 icon-hover "
                        style={{
                            cursor: "pointer",
                            color: "var(--color-black)"
                        }}
                    ></i>
                </Link>
                <h1 className="mb-0 header-font-size-small">Edit Profile</h1>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                        type="text"
                        className={`form-control ${errors.name ? "is-invalid" : ""}`}
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className={`form-control ${errors.password ? "is-invalid" : ""}`}
                        name="password"
                        onChange={handleChange}
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>
                <div className="mb-3">
                    <label className="form-label">Age</label>
                    <input
                        type="number"
                        className={`form-control ${errors.age ? "is-invalid" : ""}`}
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        min="16"
                        max="100"
                    />
                    {errors.age && <div className="invalid-feedback">{errors.age}</div>}
                </div>
                <div className="mb-3">
                    <label className="form-label">Gender</label>
                    <select
                        className={`form-select ${errors.gender ? "is-invalid" : ""}`}
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                    >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                    {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
                </div>
                <div className="mb-3">
                    <label className="form-label">Fitness Level</label>
                    <select
                        className={`form-select ${errors.fitness_level ? "is-invalid" : ""}`}
                        name="fitness_level"
                        value={formData.fitness_level}
                        onChange={handleChange}
                    >
                        <option value="">Select</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                    {errors.fitness_level && <div className="invalid-feedback">{errors.fitness_level}</div>}
                </div>
                <div className="mb-3">
                    <label className="form-label">Weight (kg)</label>
                    <input
                        type="number"
                        className={`form-control ${errors.weight ? "is-invalid" : ""}`}
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        min="30"
                        max="300"
                    />
                    {errors.weight && <div className="invalid-feedback">{errors.weight}</div>}
                </div>
                <div className="mb-3">
                    <label className="form-label">Height (cm)</label>
                    <input
                        type="number"
                        className={`form-control ${errors.height ? "is-invalid" : ""}`}
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                        min="100"
                        max="300"
                    />
                    {errors.height && <div className="invalid-feedback">{errors.height}</div>}
                </div>
                <div className="mb-3">
                    <label className="form-label">Profile Picture</label>
                    <input
                        type="file"
                        className={`form-control ${errors.profile_picture ? "is-invalid" : ""}`}
                        name="profile_picture"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    {errors.profile_picture && (
                        <div className="invalid-feedback">{errors.profile_picture}</div>
                    )}
                    {preview && (
                        <div className="mt-2">
                            <img
                                src={preview}
                                alt="Preview"
                                style={{maxWidth: "150px"}}
                            />
                        </div>
                    )}

                    <div className="d-flex justify-content-center">
                        <button type="submit" className="btn btn-primary btn-font btn-utility mt-3">Save Changes
                        </button>
                        <button type="button" className="btn btn-primary btn-font btn-utility bg-danger mt-3 ms-3"
                                onClick={handleDelete}>Delete Account
                        </button>
                    </div>

                </div>

            </form>
        </div>
    );
};

export default UserProfileEdit;
