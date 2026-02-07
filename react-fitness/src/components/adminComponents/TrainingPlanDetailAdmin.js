import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../../context/AuthProvider";
import {
    getPlanById,
    updatePlan,
    deletePlan,
    updatePlanPhoto,
    getPlanExercises,
    getAllExercises,
    addExerciseToPlan,
    removeExerciseFromPlan
} from "../../api_admin";

function TrainingPlanDetailAdmin() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);


    const [formData, setFormData] = useState({
        title: "",
        description: "",
        goal: "",
        level: "",
        picture: null,
        createdBy: "",
        createdAt: "",
        updatedAt: "",
    });

    const [planExercises, setPlanExercises] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [selectedExercise, setSelectedExercise] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const plan = await getPlanById(id, auth.token);
                const planExercisesData = await getPlanExercises(id, auth.token);
                const allExercisesData = await getAllExercises(auth.token);

                const pictureUrl = plan.picture
                    ? plan.picture !== "images/training/example1.webp"
                        ? `${process.env.REACT_APP_API_URL}/storage/${plan.picture.replace("public/", "")}`
                        : `${process.env.REACT_APP_API_URL}/images/training/example1.webp`
                    : "images/training/example1.webp";

                setFormData({
                    title: plan.title,
                    description: plan.description,
                    goal: plan.goal,
                    level: plan.level,
                    picture: pictureUrl,
                    createdBy: plan.created_by || "Admin",
                    createdAt: plan.created_at,
                    updatedAt: plan.updated_at,
                });

                setPlanExercises(planExercisesData || []);
                setExercises(allExercisesData || []);
            } catch (err) {
                if (err.response?.status === 404) {
                    console.error("No exercises found for this plan:", err);
                    setPlanExercises([]);
                } else {
                    console.error("Failed to fetch exercises:", err);
                }

            }
        };

        fetchData();
    }, [id, auth.token]);


    const handleBack = () => {
        navigate("/admin/training-plans");
    };

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                picture: file,
            }));
        }
    };

    const handleSave = async () => {
        try {
            const updatedData = {
                title: formData.title,
                description: formData.description,
                goal: formData.goal,
                level: formData.level,
            };

            await updatePlan(id, updatedData, auth.token);

            if (formData.picture instanceof File) {
                await updatePlanPhoto(id, formData.picture, auth.token);
            }

            alert("Plan updated successfully!");
            navigate("/admin/training-plans");
        } catch (err) {
            console.error("Failed to update plan:", err.response?.data || err.message);
            alert("Failed to update plan. Please try again.");
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this plan?")) {
            try {
                await deletePlan(id, auth.token);
                alert("Plan deleted successfully!");
                navigate("/admin/training-plans");
            } catch (err) {
                console.error("Failed to delete plan:", err);
                alert("Failed to delete plan. Please try again.");
            }
        }
    };

    const handleAddExercise = async () => {
        try {
            await addExerciseToPlan(id, selectedExercise, auth.token);
            const updatedPlanExercises = await getPlanExercises(id, auth.token);
            setPlanExercises(updatedPlanExercises);
            setSelectedExercise("");
            alert("Exercise added successfully!");
        } catch (err) {
            console.error("Failed to add exercise:", err);
            alert("Failed to add exercise. Please try again.");
        }
    };
    const handleRemoveExercise = async (exerciseId) => {
        try {
            await removeExerciseFromPlan(id, exerciseId, auth.token);
            const updatedPlanExercises = await getPlanExercises(id, auth.token);
            setPlanExercises(updatedPlanExercises);
            alert("Exercise removed successfully!");
        } catch (err) {
            console.error("Failed to remove exercise:", err);
            alert("Failed to remove exercise. Please try again.");
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
                    <h2 className="mb-0">Edit Training Plan (ID: {id})</h2>
                </div>
            </div>

            <div className="row">
                <div className=" col-md-7 col-lg-10 mx-auto">
                    <form>
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">
                                Title:
                            </label>
                            <input
                                name="title"
                                id="title"
                                className="form-control"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
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

                        <div className="mb-3">
                            <label htmlFor="goal" className="form-label">
                                Goal:
                            </label>
                            <select
                                name="goal"
                                id="goal"
                                className="form-select"
                                value={formData.goal}
                                onChange={handleChange}
                            >
                                <option value="" disabled>Select Goal</option>
                                <option value="gain_weight">Gain Weight</option>
                                <option value="lose_weight">Lose Weight</option>
                                <option value="maintain_fitness">Maintain Fitness</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="level" className="form-label">
                                Level:
                            </label>
                            <select
                                name="level"
                                id="level"
                                className="form-select"
                                value={formData.level}
                                onChange={handleChange}
                            >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="picture" className="form-label">
                                Current Image:
                            </label>
                            <br/>
                            {formData.picture && !(formData.picture instanceof File) && (
                                <div className="mb-2">
                                    <img
                                        src={formData.picture}
                                        alt="Plan"
                                    />
                                </div>
                            )}

                            <label htmlFor="picture" className="form-label">
                                Upload New Image:
                            </label>
                            <input
                                type="file"
                                name="picture"
                                id="picture"
                                className="form-control"
                                onChange={handleFileChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="createdBy" className="form-label">
                                Created By:
                            </label>
                            <input
                                name="createdBy"
                                id="createdBy"
                                className="form-control"
                                value={formData.createdBy}
                                onChange={handleChange}
                                readOnly
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

                        <div className="mb-3">
                            <label htmlFor="exercies" className="form-label">
                                Exercises in Plan:
                            </label>
                            <br/>
                            <ul className="list-group">
                                {planExercises.map((exercise) => (
                                    <li className="list-group-item d-flex justify-content-between align-items-center"
                                        key={exercise.exercise_id}>
                                        <a href={`/admin/exercises/edit/${exercise.exercise_id}`}
                                           className="text-decoration-none">
                                            {exercise.exercise_id}
                                        </a>
                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleRemoveExercise(exercise.exercise_id)}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="addExercise" className="form-label">
                                Add Exercise:
                            </label>
                            <div className="d-flex align-items-center">
                                <select
                                    id="addExercise"
                                    className="form-select flex-grow-1 me-2"
                                    value={selectedExercise}
                                    onChange={(e) => setSelectedExercise(e.target.value)}
                                >
                                    <option value="" disabled>Select an exercise</option>
                                    {exercises.map((exercise) => (
                                        <option key={exercise.exercise_id} value={exercise.exercise_id}>
                                            {exercise.description}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    className="btn btn-danger btn-sm"
                                    onClick={handleAddExercise}
                                    disabled={!selectedExercise}
                                >
                                    <i className="fas fa-solid fa-circle-down"></i>
                                </button>
                            </div>
                        </div>


                        <div className="d-flex justify-content-center">
                            <button
                                className="btn btn-primary btn-font btn-utility m-3"
                                type="button"
                                onClick={handleSave}
                            >
                                Save Changes
                            </button>
                            <button
                                className="btn btn-primary btn-font btn-utility m-3"
                                type="button"
                                onClick={handleDelete}
                            >
                                Delete Plan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default TrainingPlanDetailAdmin;
