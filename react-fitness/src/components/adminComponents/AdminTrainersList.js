import React, { useState, useEffect, useContext } from "react";
import axios from "../../axiosConfig";
import AuthContext from "../../context/AuthProvider";
import { Link, useNavigate } from "react-router-dom";

const AdminTrainersList = () => {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [trainers, setTrainers] = useState([]);

    useEffect(() => {
        const fetchTrainers = async () => {
            try {
                const response = await axios.get(`/trainers`, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                    },
                });
                setTrainers(response.data.trainers);
                console.log(response.data.trainers)
            } catch (error) {
                console.error("Error fetching trainers:", error);
            }
        };
        fetchTrainers();
    }, []);

    const deleteTrainer = async (trainerId) => {
        if (window.confirm("Are you sure you want to delete this trainer?")) {
            try {
                await axios.delete(`/trainers/destroy`, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                    },
                    data: { id: trainerId },
                });
                setTrainers((prevTrainers) =>
                    prevTrainers.filter((trainer) => trainer.id !== trainerId)
                );
                alert("Trainer deleted successfully");
            } catch (error) {
                console.error("Error deleting trainer:", error);
                alert("Failed to delete trainer");
            }
        }
    };

    return (
        <div>
            <h1>Trainers</h1>
            <button
                className="btn btn-primary btn-font btn-utility mb-3"
                onClick={() => navigate("/admin/trainers/create_trainer")}
            >
                <i className="fas fa-plus"></i> Add Trainer
            </button>

            <table className="table table-bordered">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Edit</th>
                    <th>Delete</th>
                    <th>Trainer ID</th>
                    <th>User ID</th>
                    <th style={{width: "150px", wordWrap: "break-word", wordBreak: "break-word"}}>
                        email
                    </th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Expertise</th>
                    <th style={{width: "200px", wordWrap: "break-word"}}>Bio</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                    <th style={{width: "150px", wordWrap: "break-word", wordBreak: "break-word"}}>
                        Profile picture
                    </th>
                </tr>
                </thead>
                <tbody>
                {(() => {
                    const rows = [];
                    for (let i = 0; i < trainers.length; i++) {
                        const trainer = trainers[i];

                        rows.push(
                            <tr key={trainer.id}>
                                <td>{i + 1}</td>
                                <td>
                                    <Link to={`/admin/trainers/edit/${trainer.id}`}>
                                        <i className="fas fa-pencil-alt edit-icon"></i>
                                    </Link>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-primary btn-font btn-utility bg-danger"
                                        onClick={() => deleteTrainer(trainer.id)}
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </td>
                                <td>{trainer.id}</td>
                                <td>{trainer.user_id}</td>
                                <td style={{width: "150px", wordWrap: "break-word", wordBreak: "break-word"}}>
                                    {trainer.email}
                                </td>
                                <td>{trainer.first_name}</td>
                                <td>{trainer.last_name}</td>
                                <td>{trainer.expertise}</td>
                                <td style={{width: "200px", wordWrap: "break-word"}}>
                                    {trainer.bio}
                                </td>
                                <td>{new Date(trainer.created_at).toLocaleDateString()}</td>
                                <td>{new Date(trainer.updated_at).toLocaleDateString()}</td>
                                <td style={{width: "150px", wordWrap: "break-word", wordBreak: "break-word"}}>
                                    <p
                                        className="me-3">{trainer.profile_picture ? trainer.profile_picture : "/images/trainer/default_trainer.png"}</p>
                                    <img
                                        src={
                                            trainer.profile_picture && trainer.profile_picture !== 'images/trainer/default_trainer.png'
                                                ? `${process.env.REACT_APP_API_URL}/storage/${trainer.profile_picture.replace('public/', '')}`
                                                : `${process.env.REACT_APP_API_URL}/images/trainer/default_trainer.png`
                                        }
                                        alt={`${trainer.first_name} ${trainer.last_name}`}
                                        className="img-fluid"
                                        style={{height: "100px"}}
                                    />
                                </td>
                            </tr>
                        );
                    }
                    return rows;
                })()}
                </tbody>
            </table>
        </div>
    );
};


export default AdminTrainersList;
