import React, { useState, useEffect, useContext } from "react";
import axios from "../../axiosConfig";
import AuthContext from "../../context/AuthProvider";
import { Link, useNavigate } from "react-router-dom";

const AdminExercisesList = () => {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [exercises, setExercises] = useState([]);


    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const response = await axios.get(`/exercises`, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                    },
                });
                setExercises(response.data);
            } catch (error) {
                console.error("Error:", error);
            }
        };
        fetchExercises();
    }, []);

    const deleteExercise = async (exercise_id) => {
        if (window.confirm("Are you sure you want to delete this exercise?")) {
            try {
                await axios.delete(`/exercises/${exercise_id}`, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                    },
                });
                setExercises((prevExercises) =>
                    prevExercises.filter((exercise) => exercise.exercise_id !== exercise_id)
                );
                alert("Exercise deleted successfully");
            } catch (error) {
                console.error("Error deleting exercise:", error);
                alert("Failed to delete exercise");
            }
        }
    };
    return (
        <div>
            <h1>Exercises</h1>
            <button
                className="btn btn-primary btn-font btn-utility mb-3"
                onClick={() => navigate("/admin/exercises/create_exercise")}
            >
                <i className="fas fa-plus"></i> Add Exercise
            </button>

            <table className="table table-bordered">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Edit</th>
                    <th>Delete</th>
                    <th>Exercise ID</th>
                    <th>Video URL</th>
                    <th>Description</th>
                    <th style={{width: "150px", wordWrap: "break-word", wordBreak: "break-word"}}>
                        Picture
                    </th>
                </tr>
                </thead>
                <tbody>
                {(() => {
                    const rows = [];
                    for (let i = 0; i < exercises.length; i++) {
                        const exercise = exercises[i];
                        rows.push(
                            <tr key={exercise.exercise_id}>
                                <td>{i + 1}</td>
                                <td>
                                    <Link to={`/admin/exercises/edit/${exercise.exercise_id}`}>
                                        <i className="fas fa-pencil-alt edit-icon"></i>
                                    </Link>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-primary btn-font btn-utility bg-danger"
                                        onClick={() => deleteExercise(exercise.exercise_id)}
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </td>
                                <td>{exercise.exercise_id}</td>
                                <td>
                                    <a href={exercise.video_url}>
                                        {exercise.video_url}
                                    </a>
                                </td>
                                <td>{exercise.description}</td>
                                <td style={{width: "150px", wordWrap: "break-word", wordBreak: "break-word"}}>
                                    <p
                                        className="me-3">{exercise.picture ? exercise.picture : "/images/training/example1.webp"}</p>
                                    <img
                                        src={
                                            exercise.picture && exercise.picture !== "images/training/example1.webp"
                                                ? `${process.env.REACT_APP_API_URL}/storage/${exercise.picture.replace("public/", "")}`
                                                : `${process.env.REACT_APP_API_URL}/images/training/example1.webp`
                                        }
                                        alt={`Exercise ID: ${exercise.exercise_id}`}
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

export default AdminExercisesList;
