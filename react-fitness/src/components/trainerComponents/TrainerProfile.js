import React, { useState, useEffect, useContext } from "react";
import axios from "../../axiosConfig";
import AuthContext from "../../context/AuthProvider";
import "../../css/general_styles.css";
import "../../css/fonts.css";
import "../../css/table.css";
import "../../css/profile.css";

function TrainerProfile() {
    const { auth } = useContext(AuthContext);
    const [trainerData, setTrainerData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrainerData = async () => {
            try {
                const response = await axios.get(`/trainer/info`, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                    },
                });
                setTrainerData(response.data.trainer)
            } catch (err) {
                console.error("Error fetching trainer data:", err);
                setError(err.response?.data?.message || "An error occurred");
            }
        };

        if (auth?.token) {
            fetchTrainerData();
        } else {
            setError("Trainer not available.");
        }
    }, [auth]);

    if (!trainerData) {
        return null;
    }

    if (error) {
        return <div className="text-danger">Error: {error}</div>;
    }


    return (
        <div className="container mt-4">
            <div className="d-flex flex-column align-items-center">
                <div className="user-photo">
                    <img
                        src={
                            trainerData.profile_picture && trainerData.profile_picture !== 'images/trainer/default_trainer.png'
                                ? `${process.env.REACT_APP_API_URL}/storage/${trainerData.profile_picture.replace('public/', '')}`
                                : `${process.env.REACT_APP_API_URL}/images/trainer/default_trainer.png`
                        }
                        alt={`${trainerData.first_name} ${trainerData.last_name}`}
                        className="img-fluid rounded-circle"
                    />
                </div>

                <div className="d-flex align-items-center mb-3">
                    <span className="username">{trainerData.first_name} {trainerData.last_name}</span>
                </div>

                <div className="table-responsive">
                    <table className="table ios-table">
                        <tbody>
                        <tr>
                            <td className="label-cell">First Name</td>
                            <td className="value-cell">{trainerData.first_name}</td>
                        </tr>
                        <tr>
                        <td className="label-cell">Last Name</td>
                            <td className="value-cell">{trainerData.last_name}</td>
                        </tr>
                        <tr>
                            <td className="label-cell">Expertise</td>
                            <td className="value-cell">{trainerData.expertise}</td>
                        </tr>
                        <tr>
                            <td className="label-cell">Your ID</td>
                            <td className="value-cell">{trainerData.user_id}</td>
                        </tr>
                        <tr>
                            <td className="label-cell">Created At</td>
                            <td className="value-cell">
                                {new Date(trainerData.created_at).toLocaleDateString()}
                            </td>
                        </tr>
                        <tr>
                            <td className="label-cell">Updated At</td>
                            <td className="value-cell">
                                {new Date(trainerData.updated_at).toLocaleDateString()}
                            </td>
                        </tr>
                        <tr>
                            <td className="label-cell">Bio</td>
                            <td className="value-cell">{trainerData.bio}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default TrainerProfile;
