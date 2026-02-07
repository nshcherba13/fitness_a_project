import React, { useState, useEffect, useContext } from "react";
import "../../css/general_styles.css";
import "../../css/fonts.css";
import "../../css/table.css";
import "../../css/profile.css";
import axios from "../../axiosConfig";
import AuthContext from "../../context/AuthProvider";
import { Link, useNavigate, useParams } from "react-router-dom";

function isEmail(val) {
    const regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regEmail.test(val)) {
        return "Invalid Email";
    }
}

const AdminTrainersEdit = () => {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const { trainerId } = useParams();
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        expertise: "",
        bio: "",
        photo: null,
    });
    const [placeholderData, setPlaceholderData] = useState({});
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        const fetchTrainer = async () => {
            try {
                const response = await axios.get(`/trainers/show`, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                    },
                    params: {
                        id: trainerId,
                    },
                });

                const trainer = response.data.trainer;

                setPlaceholderData({
                    email: trainer.email || "",
                    first_name: trainer.first_name || "",
                    last_name: trainer.last_name || "",
                    expertise: trainer.expertise || "",
                    bio: trainer.bio || "",
                });

                setPreview(
                    trainer.profile_picture &&
                    trainer.profile_picture !== "images/trainer/default_trainer.png"
                        ? `${process.env.REACT_APP_API_URL}/storage/${trainer.profile_picture.replace("public/", "")}`
                        : `${process.env.REACT_APP_API_URL}/images/trainer/default_trainer.png`
                );
            } catch (err) {
                setError("Failed to load trainer data.");
            }
        };

        if (trainerId) {
            fetchTrainer();
        }
    }, [auth.token, trainerId]);



    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.email.trim()) {
            const emailError = isEmail(formData.email);
            if (emailError) {
                setError(emailError);
                return;
            }
        }

        try {
            const dataWithoutPhoto = {
                id: trainerId,
                email: formData.email.trim() || undefined,
                password: formData.password.trim() || undefined,
                first_name: formData.first_name.trim() || undefined,
                last_name: formData.last_name.trim() || undefined,
                expertise: formData.expertise.trim() || undefined,
                bio: formData.bio.trim() || undefined,
            };

            await axios.put(`/trainers/update`, dataWithoutPhoto, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            });

            if (formData.photo) {
                const photoData = new FormData();
                photoData.append("id", trainerId);
                photoData.append("photo", formData.photo);

                await axios.post(`/trainer/photo/update`, photoData, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                        "Content-Type": "multipart/form-data",
                    },
                });
            }

            alert("Trainer updated successfully!");
            navigate("/admin/trainers");
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred while updating the trainer.");
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
                    <h1 className="mb-0">Edit Trainer Profile</h1>
                </div>
            </div>


            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Trainer ID</label>
                    <input
                        type="text"
                        className="form-control"
                        value={trainerId}
                        readOnly
                        disabled={true}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        placeholder={placeholderData.email}
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
                    <label className="form-label">First Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="first_name"
                        placeholder={placeholderData.first_name}
                        value={formData.first_name}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Last Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="last_name"
                        placeholder={placeholderData.last_name}
                        value={formData.last_name}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Expertise</label>
                    <input
                        type="text"
                        className="form-control"
                        name="expertise"
                        placeholder={placeholderData.expertise}
                        value={formData.expertise}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Bio</label>
                    <textarea
                        className="form-control"
                        name="bio"
                        placeholder={placeholderData.bio}
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
                        <button type="submit" className="btn btn-primary btn-font btn-utility mt-3">Save Changes
                        </button>
                    </div>

                </div>


            </form>
        </div>
    );
};

export default AdminTrainersEdit;
