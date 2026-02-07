import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthProvider";
import axios from "axios";

function BonusesListAdmin() {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [bonuses, setBonuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBonuses = async () => {
        if (!auth?.token) {
            setError("You are not authenticated.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/bonuses`, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            });
            setBonuses(response.data.bonuses);
        } catch (err) {
            setError("Failed to fetch bonuses.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBonuses();
    }, [auth]);

    const handleCardClick = (bonusId) => {
        navigate(`/admin/bonuses/${bonusId}`);
    };

    const handleCreateBonus = () => {
        navigate("/admin/bonuses/new");
    };

    if (loading) return <p>Loading bonuses...</p>;
    if (error) return <p>{error}</p>;

    return (
        <>
            <div className="d-flex justify-content-between align-items-center my-3">
                <div className="d-flex">
                    <h1 className="mb-0 header-font-size-small">All Bonuses</h1>
                    <i className="fas fa-solid fa-folder-plus fa-2x mx-3 mt-2 icon-hover" style={{cursor: "pointer"}}
                       onClick={handleCreateBonus}></i>
                </div>
            </div>
            <div className="row">
                {bonuses.map((bonus) => (
                    <div key={bonus.bonus_id} className="col-xl-4 col-md-6 col-sm-10 mb-4">
                        <div className="card h-100" style={{cursor: "pointer"}} onClick={() => handleCardClick(bonus.bonus_id)}>
                            <img
                                src={
                                    bonus.image
                                        ? bonus.image !== 'images/bonuses/default.png'
                                            ? `${process.env.REACT_APP_API_URL}/storage/${bonus.image.replace('public/', '')}`
                                            : `${process.env.REACT_APP_API_URL}/images/bonuses/default.png`
                                        : "https://via.placeholder.com/400x250?text=No+Image"
                                }
                                className="card-img-top img-fluid"
                                style={{ maxWidth: "600px", height: "auto" }}
                                alt={bonus.title}
                            />
                            <div className="card-body">
                                <h5 className="card-title text-center">{bonus.title}</h5>
                                <p className="text-center fw-bold text-danger"> <i className="fa-solid fa-medal me-2"></i> {bonus.required_fit_points}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default BonusesListAdmin;
