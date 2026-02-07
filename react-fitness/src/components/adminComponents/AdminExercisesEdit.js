import React, { useState, useEffect, useContext } from "react";
import "../../css/general_styles.css";
import "../../css/fonts.css";
import "../../css/table.css";
import "../../css/profile.css";
import axios from "../../axiosConfig";
import AuthContext from "../../context/AuthProvider";
import { Link, useNavigate, useParams } from "react-router-dom";

const AdminExercisesEdit = () => {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const { exerciseId } = useParams();
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        video_url: "",
        description: "",
        photo: null,
    });
    const [errors, setErrors] = useState({});
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        const fetchExercise = async () => {
            try {
                const response = await axios.get(`/exercises/${exerciseId}`, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                    },
                });
                const exercise = response.data.exercise;

                setFormData({
                    video_url: exercise.video_url || "",
                    description: exercise.description || "",
                    photo: null,
                });

                setPreview(
                    exercise.picture && exercise.picture !== "images/training/example1.webp"
                        ? `${process.env.REACT_APP_API_URL}/storage/${exercise.picture.replace("public/", "")}`
                        : `${process.env.REACT_APP_API_URL}/images/training/example1.webp`
                );
            } catch (err) {
                setError("Failed to load exercise data.");
            }

        };
        fetchExercise();
    }, [exerciseId, auth.token]);

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

    const validate = () => {
        const newErrors = {};
        if (!formData.video_url.trim()) newErrors.video_url = "Video URL is required.";
        if (!formData.description.trim()) newErrors.description = "Description is required.";
        if (formData.photo) {
            const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
            if (!allowedTypes.includes(formData.photo.type)) {
                newErrors.photo = "Only JPG, JPEG, and PNG files are allowed.";
            }
            const maxSizeInBytes = 2 * 1024 * 1024;
            if (formData.photo.size > maxSizeInBytes) {
                newErrors.photo = "Image size must be less than 2MB.";
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const dataWithoutPhoto = {
                video_url: formData.video_url,
                description: formData.description,
            };

            await axios.put(`/exercises/${exerciseId}`, dataWithoutPhoto, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            });

            if (formData.photo) {
                const photoData = new FormData();
                photoData.append("id", exerciseId);
                photoData.append("photo", formData.photo);

                await axios.post(`/exercise/photo/update`, photoData, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                        "Content-Type": "multipart/form-data",
                    },
                });
            }

            alert("Exercise updated successfully!");
            navigate("/admin/exercises");
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred while updating the exercise.");
        }
    };

    const handleBack = () => {
        navigate("/admin/exercises");
    };

    return (
        <div className="container mt-2">

            <div className="row mb-3 mt-3">
                <div className="col d-flex align-items-center">
                    <i
                        className="fas fa-solid fa-circle-arrow-left fa-2x me-4 mb-1 icon-hover"
                        style={{cursor: "pointer"}}
                        onClick={handleBack}
                    ></i>
                    <h1 className="mb-0">Edit Exercise</h1>
                </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Exercise ID</label>
                    <input
                        type="text"
                        className="form-control"
                        value={exerciseId}
                        readOnly
                        disabled={true}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Video URL</label>
                    <input
                        type="url"
                        className="form-control"
                        name="video_url"
                        value={formData.video_url}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        required
                    ></textarea>
                </div>
                <div className="mb-3">
                    <label className="form-label">Exercise Photo</label>
                    <input
                        type="file"
                        className={`form-control ${errors.photo ? "is-invalid" : ""}`}
                        name="photo"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    {errors.photo && <div className="invalid-feedback">{errors.photo}</div>}
                    {preview && (
                        <div className="mt-2">
                            <img
                                src={preview}
                                alt="Preview"
                                style={{maxWidth: "150px"}}
                            />
                        </div>
                    )}
                </div>
                <div className="d-flex justify-content-center">
                    <button type="submit" className="btn btn-primary btn-font btn-utility mt-3">
                        Save Changes
                    </button>
                </div>


            </form>
        </div>
    );
};

export default AdminExercisesEdit;
