import "../../css/general_styles.css";
import React, { useState, useContext } from "react";
import axios from "../../axiosConfig";
import AuthContext from "../../context/AuthProvider";


function AdminFindAdmin() {
    const [searchId, setSearchId] = useState("");
    const [adminData, setAdminData] = useState(null);
    const [error, setError] = useState("");
    const { auth } = useContext(AuthContext);

    const handleSearch = async () => {
        try {
            const response = await axios.get(`/admin/find`, {
                params: { id: searchId },
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${auth.token}`,
                },
            });

            setAdminData(response.data.admin);
            setError("");
        } catch (err) {
            console.error("Error fetching admin data:", err);

            if (err.response?.status === 404) {
                setError("Admin not found");
            } else if (err.response?.status === 403) {
                setError("Access denied");
            } else {
                setError("An error occurred while fetching admin data");
            }

            setAdminData(null);
        }
    };
    return (
        <div className="container mt-2">
            <h1>Find Admin</h1>
            <div className="d-flex flex-column align-items-center">
                <div className="d-flex mb-4">
                    <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Enter Admin ID"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                    />
                    <button className="btn btn-primary btn-font btn-utility bg-danger" onClick={handleSearch}>
                        <i className="fas fa-search"></i>
                    </button>
                </div>

                {error && <p className="text-danger">{error}</p>}

                {adminData && (
                    <div className="table-responsive">
                        <table className="table ios-table">
                            <tbody>
                            <tr>
                                <td className="label-cell">Profile Picture</td>
                                <td className="value-cell">
                                    <span className="me-3">{adminData.profile_picture ? adminData.profile_picture : "/images/admin.jpg"}</span>
                                    <img
                                        src={
                                            adminData.profile_picture && adminData.profile_picture !== 'images/admin.jpg'
                                                ? `${process.env.REACT_APP_API_URL}/storage/${adminData.profile_picture.replace('public/', '')}`
                                                : `${process.env.REACT_APP_API_URL}/images/admin.jpg`
                                        }
                                        alt={`${adminData.first_name} ${adminData.last_name}`}
                                        className="img-fluid"
                                        style={{ height: "100px"}}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="label-cell">First Name</td>
                                <td className="value-cell">{adminData.first_name}</td>
                            </tr>
                            <tr>
                                <td className="label-cell">Last Name</td>
                                <td className="value-cell">{adminData.last_name}</td>
                            </tr>
                            <tr>
                                <td className="label-cell">AdminID</td>
                                <td className="value-cell">{adminData.admin_id}</td>
                            </tr>
                            <tr>
                                <td className="label-cell">UserID</td>
                                <td className="value-cell">{adminData.user_id}</td>
                            </tr>
                            <tr>
                                <td className="label-cell">Last Login</td>
                                <td className="value-cell">
                                    {new Date(adminData.last_login).toLocaleDateString()}
                                </td>
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
                )}
            </div>
        </div>
    );
}

export default AdminFindAdmin;
