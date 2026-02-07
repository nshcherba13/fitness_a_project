import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "../../axiosConfig";
import AuthContext from "../../context/AuthProvider";
import "../../css/general_styles.css";
import "../../css/fonts.css";
import "../../css/table.css";
import "../../css/profile.css";

function UserProfile() {
    const { auth } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`/account/info`, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                    },
                });
                const { account, user } = response.data;
                setUserData({
                    ...account,
                    name: user.name,
                    email: user.email,
                });
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError(err.response?.data?.message || "An error occurred");
            }
        };

        if (auth?.token) {
            fetchUserData();
        } else {
            setError("User not available.");
        }
    }, [auth]);


    if (!userData) {
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
                            userData.profile_picture && userData.profile_picture !== 'images/user.jpg'
                                ? `${process.env.REACT_APP_API_URL}/storage/${userData.profile_picture.replace('public/', '')}`
                                : `${process.env.REACT_APP_API_URL}/images/user.jpg`
                        }
                        alt={`${userData.name}`}
                        className="img-fluid rounded-circle"
                    />
                </div>

                <div className="d-flex align-items-center mb-3">
                    <span className="username">{userData.name}</span>
                    <Link to="/user/home/edit_profile" className="ms-2">
                        <i className="fas fa-pencil-alt edit-icon"></i>
                    </Link>
                </div>

                <div className="table-responsive">
                    <table className="table ios-table">
                        <tbody>
                        <tr>
                            <td className="label-cell">Email</td>
                            <td className="value-cell">{userData.email}</td>
                        </tr>
                        <tr>
                            <td className="label-cell">Registration Date</td>
                            <td className="value-cell">{userData.registration_date}</td>
                        </tr>
                        <tr>
                            <td className="label-cell">Age</td>
                            <td className="value-cell">{userData.age}</td>
                        </tr>
                        <tr>
                            <td className="label-cell">Gender</td>
                            <td className="value-cell">{userData.gender}</td>
                        </tr>
                        <tr>
                            <td className="label-cell">Level</td>
                            <td className="value-cell">{userData.fitness_level}</td>
                        </tr>
                        <tr>
                            <td className="label-cell">Weight</td>
                            <td className="value-cell">{userData.weight}</td>
                        </tr>
                        <tr>
                            <td className="label-cell">Height</td>
                            <td className="value-cell">{userData.height}</td>
                        </tr>
                        <tr>
                            <td className="label-cell">Subscription</td>
                            <td className="value-cell">{userData.subscription}</td>
                        </tr>
                        <tr>
                            <td className="label-cell"> <i className="fa-solid fa-medal mx-1"></i> Fits </td>
                            <td className="value-cell">{userData.fit_points}</td>
                        </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;
