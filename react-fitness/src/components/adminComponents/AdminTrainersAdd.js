import React, {useContext, useState} from "react";
import "../../css/general_styles.css";
import "../../css/fonts.css";
import "../../css/table.css";
import "../../css/profile.css";
import axios from "../../axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthProvider";

function isEmail(val) {
    const regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regEmail.test(val)) {
        return "Invalid Email";
    }
}

const AdminTrainersAdd = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});
    const [preview, setPreview] = useState(null);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        expertise: "",
        bio: "",
        photo: null,
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setErrors((prevErrors) => ({
            ...prevErrors,
            [e.target.name]: null,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({
            ...formData,
            photo: file,
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

    const validate = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else {
            const emailError = isEmail(formData.email);
            if (emailError) newErrors.email = emailError;
        }
        if (!formData.password.trim()) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }
        if (!formData.first_name.trim()) {
            newErrors.first_name = "First name is required";
        }
        if (!formData.last_name.trim()) {
            newErrors.last_name = "Last name is required";
        }
        if (!formData.expertise.trim()) {
            newErrors.expertise = "Expertise is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            const trainerData = {
                email: formData.email.trim(),
                password: formData.password.trim(),
                first_name: formData.first_name.trim(),
                last_name: formData.last_name.trim(),
                expertise: formData.expertise.trim(),
                bio: formData.bio.trim() || undefined,
            };

            const createTrainerResponse = await axios.post("/register/trainer",
                trainerData,
                {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                    },
                }
            );

            const trainerId = createTrainerResponse.data.trainer.id;

            if (formData.photo) {
                const photoData = new FormData();
                photoData.append("id", trainerId);
                photoData.append("photo", formData.photo);

                await axios.post("/trainer/photo", photoData, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                        "Content-Type": "multipart/form-data",
                    },
                });
            }

            alert("Trainer added successfully!");
            navigate("/admin/trainers");
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred while adding the trainer.");
        }
    };

    const handleBack = () => {
        navigate("/admin/trainers");
    };


    return (
        <div className="container mt-2">

            <div className="row mb-3 mt-3">
                <div className="col d-flex align-items-center">
                    <i
                        className="fas fa-solid fa-circle-arrow-left fa-2x me-4 mb-1 icon-hover "
                        style={{cursor: "pointer"}}
                        onClick={handleBack}
                    ></i>
                    <h1 className="mb-0">Add New Trainer</h1>
                </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    {errors.email && <div className="text-danger">{errors.email}</div>}
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    {errors.password && <div className="text-danger">{errors.password}</div>}
                </div>
                <div className="mb-3">
                    <label className="form-label">First Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                    />
                    {errors.first_name && <div className="text-danger">{errors.first_name}</div>}
                </div>
                <div className="mb-3">
                    <label className="form-label">Last Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                    />
                    {errors.last_name && <div className="text-danger">{errors.last_name}</div>}
                </div>
                <div className="mb-3">
                    <label className="form-label">Expertise</label>
                    <input
                        type="text"
                        className="form-control"
                        name="expertise"
                        value={formData.expertise}
                        onChange={handleChange}
                        required
                    />
                    {errors.expertise && <div className="text-danger">{errors.expertise}</div>}
                </div>
                <div className="mb-3">
                    <label className="form-label">Bio</label>
                    <textarea
                        className="form-control"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows="4"
                    ></textarea>
                </div>
                <div className="mb-3">
                    <label className="form-label">Profile Picture</label>
                    <input
                        type="file"
                        className="form-control"
                        name="photo"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    {preview && (
                        <div className="mt-2">
                            <img src={preview} alt="Preview" style={{maxWidth: "150px"}}/>
                        </div>
                    )}

                    <div className="d-flex justify-content-center">
                        <button type="submit" className="btn btn-primary btn-font btn-utility mt-3">Add Trainer</button>
                    </div>

                </div>

            </form>
        </div>
    );
};

export default AdminTrainersAdd;
