import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthProvider";
import { createBonus, uploadBonusPhoto } from "../../api_admin";

function CreateBonusAdmin() {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        required_fit_points: "",
        valid_until: "",
        promo_code: "",
    });

    const [file, setFile] = useState(null);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();

        try {
            const token = auth?.token;
            const bonus = await createBonus({
                title: formData.title,
                description: formData.description,
                required_fit_points: parseInt(formData.required_fit_points, 10),
                valid_until: formData.valid_until,
                promo_code: formData.promo_code,
            }, token);

            if (file) {
                await uploadBonusPhoto(bonus.bonus_id, file, token);
            }

            alert("Bonus created successfully!");
            navigate("/admin/bonuses");
        } catch (err) {
            console.error("Failed to create bonus or upload photo:", err.response?.data || err.message);
            alert("Failed to create bonus. Please check your inputs and try again.");
        }
    };

    const handleCancel = () => {
        navigate("/admin/bonuses");
    };

    return (
        <div className="container mt-4 mx-0">
            <div className="row mb-3">
                <div className="col d-flex align-items-center">
                    <i
                        className="fas fa-solid fa-circle-arrow-left fa-2x me-4 icon-hover"
                        style={{ cursor: "pointer" }}
                        onClick={handleCancel}
                    ></i>
                    <h2 className="mb-0">Create New Bonus</h2>
                </div>
            </div>
            <div className="row">
                <div className="col-md-7 col-lg-10 mx-auto">
                    <form onSubmit={handleSave}>
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">Title:</label>
                            <input
                                name="title"
                                id="title"
                                className="form-control"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">Description:</label>
                            <textarea
                                name="description"
                                id="description"
                                className="form-control"
                                rows="3"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="required_fit_points" className="form-label">Required Fit Points:</label>
                            <input
                                type="number"
                                name="required_fit_points"
                                id="required_fit_points"
                                className="form-control"
                                value={formData.required_fit_points}
                                onChange={handleChange}
                                min="0"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="valid_until" className="form-label">Valid Until:</label>
                            <input
                                type="date"
                                name="valid_until"
                                id="valid_until"
                                className="form-control"
                                value={formData.valid_until}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="promo_code" className="form-label">Promo Code:</label>
                            <input
                                name="promo_code"
                                id="promo_code"
                                className="form-control"
                                value={formData.promo_code}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="image" className="form-label">Image:</label>
                            <input
                                type="file"
                                name="image"
                                id="image"
                                className="form-control"
                                onChange={handleFileChange}
                            />
                        </div>
                        <div className="d-flex justify-content-center">
                            <button className="btn btn-primary btn-font btn-utility m-3" type="submit">Create</button>
                            <button className="btn btn-primary btn-font btn-utility m-3" type="button" onClick={handleCancel}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateBonusAdmin;
