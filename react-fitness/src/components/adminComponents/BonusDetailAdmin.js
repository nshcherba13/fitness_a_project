import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../../context/AuthProvider";
import {
    getBonusById,
    updateBonus,
    deleteBonus,
    updateBonusPhoto
} from "../../api_admin";

function BonusDetailAdmin() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        required_fit_points: 0,
        valid_until: "",
        promo_code: "",
        image: null,
        createdAt: "",
        updatedAt: ""
    });

    useEffect(() => {
        const fetchBonus = async () => {
            try {
                const bonus = await getBonusById(id, auth.token);
                const imageUrl = bonus.image
                    ? `${process.env.REACT_APP_API_URL}/storage/${bonus.image.replace('public/', '')}`
                    : "https://worldfoodtour.co.uk/wp-content/uploads/2013/06/neptune-placeholder-48.jpg";

                setFormData({
                    title: bonus.title,
                    description: bonus.description,
                    required_fit_points: bonus.required_fit_points,
                    valid_until: bonus.valid_until,
                    promo_code: bonus.promo_code,
                    image: imageUrl,
                    createdAt: bonus.created_at,
                    updatedAt: bonus.updated_at
                });
            } catch (err) {
                console.error("Failed to fetch bonus:", err);
            }
        };
        fetchBonus();
    }, [id, auth.token]);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                image: file
            }));
        }
    };

    const handleBack = () => {
        navigate("/admin/bonuses");
    };

    const handleSave = async () => {
        try {
            const updatedData = {
                title: formData.title,
                description: formData.description,
                required_fit_points: parseInt(formData.required_fit_points, 10),
                valid_until: formData.valid_until,
                promo_code: formData.promo_code
            };
            await updateBonus(id, updatedData, auth.token);

            if (formData.image instanceof File) {
                await updateBonusPhoto(id, formData.image, auth.token);
            }

            alert("Bonus updated successfully!");
            navigate("/admin/bonuses");
        } catch (err) {
            console.error("Failed to update bonus:", err);
            alert("Failed to update bonus. Please try again.");
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this bonus?")) {
            try {
                await deleteBonus(id, auth.token);
                alert("Bonus deleted successfully!");
                navigate("/admin/bonuses");
            } catch (err) {
                console.error("Failed to delete bonus:", err);
                alert("Failed to delete bonus. Please try again.");
            }
        }
    };

    return (
        <div className="container mt-4">
            <div className="row mb-3 mt-3">
                <div className="col d-flex align-items-center">
                    <i
                        className="fas fa-solid fa-circle-arrow-left fa-2x me-4 mb-1 icon-hover"
                        style={{ cursor: "pointer" }}
                        onClick={handleBack}
                    ></i>
                    <h2 className="mb-0">Edit Bonus (ID: {id})</h2>
                </div>
            </div>
            <form>
                <div className="mb-3">
                    <label className="form-label">Title:</label>
                    <input className="form-control" name="title" value={formData.title} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Description:</label>
                    <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Required Fit Points:</label>
                    <input type="number" className="form-control" name="required_fit_points" value={formData.required_fit_points} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Valid Until:</label>
                    <input type="date" className="form-control" name="valid_until" value={formData.valid_until} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Promo Code:</label>
                    <input className="form-control" name="promo_code" value={formData.promo_code} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Current Image:</label><br />
                    {formData.image && !(formData.image instanceof File) && <img src={formData.image} alt="Bonus" style={{ maxWidth: '200px' }} />}
                </div>
                <div className="mb-3">
                    <label className="form-label">Upload New Image:</label>
                    <input type="file" className="form-control" onChange={handleFileChange} />
                </div>
                <div className="d-flex justify-content-center">
                    <button type="button" className="btn btn-primary btn-font btn-utility m-3" onClick={handleSave}>Save Changes</button>
                    <button type="button" className="btn btn-primary btn-font btn-utility m-3" onClick={handleDelete}>Delete Bonus</button>
                </div>
            </form>
        </div>
    );
}

export default BonusDetailAdmin;
