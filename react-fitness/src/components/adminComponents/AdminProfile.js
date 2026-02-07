import React, { useState, useEffect, useContext } from "react";
import axios from "../../axiosConfig";
import AuthContext from "../../context/AuthProvider";
import "../../css/general_styles.css";
import "../../css/fonts.css";
import "../../css/table.css";
import "../../css/profile.css";
function AdminProfile() {
    const { auth } = useContext(AuthContext);
    const [adminData, setAdminData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const response = await axios.get(`/admin/info`, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                    },
                });
                setAdminData(response.data.admin);
            } catch (err) {
                console.error("Error fetching admin data:", err);
                setError(err.response?.data?.message || "An error occurred");
            }
        };

        if (auth?.token) {
            fetchAdminData();
        } else {
            setError("Admin not available.");
        }
    }, [auth]);

    if (!adminData) {
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
                            adminData.profile_picture && adminData.profile_picture !== 'images/admin.jpg'
                                ? `${process.env.REACT_APP_API_URL}/storage/${adminData.profile_picture.replace('public/', '')}`
                                : `${process.env.REACT_APP_API_URL}/images/admin.jpg`
                        }
                        alt={`${adminData.first_name} ${adminData.last_name}`}
                        className="img-fluid rounded-circle"
                    />
                </div>

                <div className="d-flex align-items-center mb-3">
                    <span className="username">ADMINISTRATOR</span>
                </div>
                <div className="d-flex align-items-center mb-3">
                    <span className="username">{adminData.first_name} {adminData.last_name}</span>
                </div>

                <div className="table-responsive">
                    <table className="table ios-table">
                        <tbody>
                        <tr>
                            <td className="label-cell">First Name</td>
                            <td className="value-cell">{adminData.first_name}</td>
                        </tr>
                        <tr>
                            <td className="label-cell">Last Name</td>
                            <td className="value-cell">{adminData.last_name}</td>
                        </tr>
                        <tr>
                            <td className="label-cell">Your AdminID</td>
                            <td className="value-cell">{adminData.admin_id}</td>
                        </tr>
                        <tr>
                            <td className="label-cell">Your UserID</td>
                            <td className="value-cell">{adminData.user_id}</td>
                        </tr>
                        <tr>
                            <td className="label-cell">Last Login</td>
                            <td className="value-cell">{new Date(adminData.last_login).toLocaleDateString()}</td>
                        </tr>
                        <tr>
                            <td className="label-cell">Created At</td>
                            <td className="value-cell">
                                {new Date(adminData.created_at).toLocaleDateString()}
                            </td>
                        </tr>
                        <tr>
                            <td className="label-cell">Updated At</td>
                            <td className="value-cell">
                                {new Date(adminData.updated_at).toLocaleDateString()}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminProfile;
