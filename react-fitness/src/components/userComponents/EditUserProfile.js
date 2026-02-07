import React, { useState} from "react";

import "../../css/general_styles.css";
import "../../css/fonts.css";
import "../../css/table.css";
import "../../css/profile.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { notifySuccess, notifyError } from "../utilityComponents/toast";
import {ToastContainer} from "react-toastify";


const EditProfile = () => {
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
    });

    const [id, setId] = useState(null); // TODO Change this!
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!id) throw new Error("Account ID not found");

            const response = await axios.put(`/accounts/${id}`, formData);
            notifySuccess("Data saved successfully!");
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred");
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete your account?")) return;

        try {
            if (!id) throw new Error("Account ID not found");

            const response = await axios.delete(`/accounts/${id}`);
            notifySuccess("Account deleted! Goodbye!");
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred");
        }
    };

    return (
        <div className="container mt-2">

            <div className="d-flex align-items-center">
                <Link to="/user/home" className="btn btn-link text-decoration-none position-relative">
                    <i className="fas fa-arrow-left edit-icon" title="Go back"></i>
                </Link>
                <h1 className="ms-3 mb-0">Edit Profile</h1>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>

                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        name="password"
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Age</label>
                    <input
                        type="number"
                        className="form-control"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        min="0"
                        max="100"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Gender</label>
                    <select
                        className="form-select"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                    >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Level</label>
                    <select
                        className="form-select"
                        name="level"
                        value={formData.fitness_level}
                        onChange={handleChange}
                    >
                        <option value="">Select</option>
                        <option value="male">Beginner</option>
                        <option value="female">Intermediate</option>
                        <option value="other">Advanced</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Weight (kg)</label>
                    <input
                        type="number"
                        className="form-control"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        min="0"
                        max="300"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Height (cm)</label>
                    <input
                        type="number"
                        className="form-control"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                        min="0"
                        max="300"
                    />
                </div>
                <button type="submit" className="btn-font club-btn buttons-ui bg-gray">Save Changes</button>
                <button type="button" className="btn-font club-btn buttons-ui button-delete ms-3"
                        onClick={handleDelete}>Delete Account
                </button>
            </form>
        </div>
    );
};

export default EditProfile;
