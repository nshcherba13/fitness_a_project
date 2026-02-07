import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../../context/AuthProvider";
import { getUserAccountInfo } from "../../api_user";
import axiosInstance from '../../axiosConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import { notifySuccess, notifyError } from "../utilityComponents/toast";


function UserBonusesList() {
    const { auth } = useContext(AuthContext);
    const [claimedBonuses, setClaimedBonuses] = useState([]);
    const [availableBonuses, setAvailableBonuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBonuses = async () => {
            if (!auth?.token) {
                setError("You are not authenticated.");
                setLoading(false);
                return;
            }

            try {
                const response = await axiosInstance.get(`/account/bonuses`, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                    },
                });

                setClaimedBonuses(response.data.claimed || []);
                setAvailableBonuses(response.data.available || []);
            } catch (err) {
                console.error("Failed to fetch bonuses:", err);
                setError("Failed to load bonuses.");
            } finally {
                setLoading(false);
            }
        };

        fetchBonuses();
    }, [auth.token]);

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };


    const renderBonusCard = (bonus) => (
        <div
            key={bonus.id}
            className="col-md-6 col-lg-4 mb-4"
        >
            <div className="card h-100 shadow-sm">
                <img
                    src={
                        bonus.image
                            ? `${process.env.REACT_APP_API_URL}/storage/${bonus.image.replace("public/", "")}`
                            : "https://via.placeholder.com/400x200?text=No+Image"
                    }
                    className="card-img-top"
                    alt={bonus.title}
                    style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{bonus.title}</h5>
                    <p className="card-text">{bonus.description}</p>
                    <p className="card-text text-muted">Valid until: {formatDate(bonus.valid_until)}</p>
                    <p className="card-text text-center text-danger"> <i className="fa-solid fa-medal me-2"></i> {bonus.required_fit_points}</p>
                    <div className="mt-auto">
                        <strong>Promo Code:</strong>
                        <div className="input-group mt-2">
                            <input
                                type="text"
                                className="form-control"
                                value={bonus.promo_code}
                                readOnly
                            />
                            <button
                                className="btn btn-outline-secondary"
                                onClick={() => navigator.clipboard.writeText(bonus.promo_code)}
                            >
                                Copy
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const claimBonus = async (bonusId) => {
        try {
            const response = await axiosInstance.post(`/account/bonuses/${bonusId}/claim`, {}, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            });

            const promoCode = response.data.promo_code;
            const claimed = availableBonuses.find(b => b.bonus_id === bonusId);
            if (claimed) {
                setClaimedBonuses(prev => [
                    ...prev,
                    { ...claimed, promo_code: promoCode }
                ]);
                setAvailableBonuses(prev => prev.filter(b => b.bonus_id !== bonusId));
            }

            notifySuccess("Bonus claimed!");


        } catch (error) {
            console.error("Failed to claim bonus:", error);
            notifyError(error.response?.data?.message || "Failed to claim bonus.");
        }
    };

    const renderBonusCardAll = (bonus) => (
        <motion.div
            key={bonus.id}
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="col-md-6 col-lg-4 mb-4"
        >
            <div className="card h-100 shadow-sm">
                <img
                    src={
                        bonus.image
                            ? `${process.env.REACT_APP_API_URL}/storage/${bonus.image.replace("public/", "")}`
                            : "https://via.placeholder.com/400x200?text=No+Image"
                    }
                    className="card-img-top"
                    alt={bonus.title}
                    style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{bonus.title}</h5>
                    <p className="card-text">{bonus.description}</p>
                    <p className="card-text text-muted">Valid until: {formatDate(bonus.valid_until)}</p>
                    <p className="card-text text-center text-danger">
                        <i className="fa-solid fa-medal me-2"></i> {bonus.required_fit_points}
                    </p>
                    <button
                        className="btn-font card-button-training-plans mt-auto"
                        onClick={() => claimBonus(bonus.bonus_id)}
                    >
                        Claim
                    </button>
                </div>
            </div>
        </motion.div>
    );

    if (loading) return <p>Loading bonuses...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container">
            <h1 className="mb-0 header-font-size-small my-3">Claimed Bonuses</h1>
            <div className="row">
                {claimedBonuses.length > 0 ? (
                    claimedBonuses.map((bonus) => renderBonusCard(bonus, true))
                ) : (
                    <p>No bonuses claimed yet.</p>
                )}
            </div>

            <h1 className="mb-0 header-font-size-small my-3">Available Bonuses</h1>
            <div className="row">
                <AnimatePresence mode="popLayout">
                    {availableBonuses.length > 0 ? (
                        availableBonuses.map((bonus) => renderBonusCardAll(bonus))
                    ) : (
                        <motion.p
                            key="no-bonuses"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-muted"
                        >
                            No bonuses available at the moment.
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
            <ToastContainer />
        </div>
    );
}

export default UserBonusesList;
