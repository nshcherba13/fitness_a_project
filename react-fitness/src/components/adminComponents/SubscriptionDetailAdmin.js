import React, {useContext, useEffect, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSubscriptionById, updateSubscription } from "../../api_admin";
import AuthContext from "../../context/AuthProvider";

function SubscriptionDetailAdmin() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        createdAt: "",
        updatedAt: "",
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSubscription = async () => {
            setLoading(true);
            try {
                const data = await getSubscriptionById(id, auth.token);
                setFormData({
                    name: data.name,
                    price: data.price,
                    description: data.description,
                    createdAt: data.created_at,
                    updatedAt: data.updated_at,
                });
            } catch (err) {
                console.error("Failed to fetch subscription:", err);
                setError("Failed to load subscription data.");
            } finally {
                setLoading(false);
            }
        };

        fetchSubscription();
    }, [id, auth.token]);


    const handleBack = () => {
        navigate("/admin/subscriptions");
    };

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const data = {
                name: formData.name,
                price: formData.price,
                description: formData.description,
            };
            await updateSubscription(id, data, auth.token);
            alert("Subscription updated successfully!");
            navigate("/admin/subscriptions");
        } catch (err) {
            console.error("Failed to update subscription:", err);
            setError("Failed to update subscription. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container px-0 mx-0">
            <div className="row mb-3 mt-3">
                <div className="col d-flex align-items-center">
                    <i
                        className="fas fa-solid fa-circle-arrow-left fa-2x me-4 mb-1 icon-hover"
                        style={{ cursor: "pointer" }}
                        onClick={handleBack}
                    ></i>
                    <h2 className="mb-0">Edit Subscription (ID: {id})</h2>
                </div>
            </div>

            <div className="row">
                <div className=" col-md-7 col-lg-10 mx-auto">
                    <form>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">
                                Name:
                            </label>
                            <input
                                name="name"
                                id="name"
                                className="form-control"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="row">
                            <div className="col-12 col-sm-6 mb-3">
                                <label htmlFor="price" className="form-label">
                                    Price:
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    id="price"
                                    className="form-control"
                                    value={formData.price}
                                    onChange={handleChange}
                                    min="0"
                                    step="1"
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">
                                Description:
                            </label>
                            <textarea
                                name="description"
                                id="description"
                                className="form-control"
                                rows="3"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="row">
                            <div className="col-12 col-sm-6 mb-3">
                                <label htmlFor="createdAt" className="form-label">
                                    Created At:
                                </label>
                                <input
                                    name="createdAt"
                                    id="createdAt"
                                    className="form-control"
                                    value={formData.createdAt}
                                    onChange={handleChange}
                                    readOnly
                                />
                            </div>
                            <div className="col-12 col-sm-6 mb-3">
                                <label htmlFor="updatedAt" className="form-label">
                                    Updated At:
                                </label>
                                <input
                                    name="updatedAt"
                                    id="updatedAt"
                                    className="form-control"
                                    value={formData.updatedAt}
                                    onChange={handleChange}
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="d-flex justify-content-center">
                            <button
                                className="btn btn-primary btn-font btn-utility m-3"
                                type="button"
                                onClick={handleSave}
                                disabled={loading}
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>

                        {error && (
                            <div className="alert alert-danger mt-3" role="alert">
                                {error}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SubscriptionDetailAdmin;
