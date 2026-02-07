import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthProvider";
import { createPlan, uploadPlanPhoto } from "../../api_admin";

function CreateTrainingPlanAdmin() {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        goal: "",
        level: ""
    });

    const [file, setFile] = useState(null);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();

        try {
            const token = auth?.token;

            const plan = await createPlan({
                title: formData.title,
                description: formData.description,
                goal: formData.goal,
                level: formData.level,
            }, token);

            console.log("Plan ID:", plan.training_plan_id);
            console.log("File:", file);
            console.log("FormData:", formData);

            if (file) {
                await uploadPlanPhoto(plan.training_plan_id, file, token);
            }

            alert("Plan created successfully!");
            navigate("/admin/training-plans");
        } catch (err) {
            console.error("Failed to create Plan:", err.response?.data || err.message);
            alert("Failed to create Plan. Please check your inputs and try again.");
        }
    };

    const handleCancel = () => {
        navigate("/admin/training-plans");
    };

    return (
        <div className="container mt-4 mx-0">
            <div className="row mb-3">
                <div className="col d-flex align-items-center">
                    <i
                        className="fas fa-solid fa-circle-arrow-left fa-2x me-4 icon-hover"
                        style={{cursor: "pointer"}}
                        onClick={handleCancel}
                    ></i>
                    <h2 className="mb-0">Create New Plan</h2>
                </div>
            </div>
            <div className="row">
                <div className="col-md-7 col-lg-10 mx-auto">
                    <form onSubmit={handleSave}>
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
                                required
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
                                <option value="" disabled>Select Level</option>
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="image_url" className="form-label">
                                Image:
                            </label>
                            <input
                                type="file"
                                name="image"
                                id="image"
                                className="form-control"
                                onChange={handleFileChange}
                            />
                        </div>

                        <div className="d-flex justify-content-center">
                            <button
                                className="btn btn-primary btn-font btn-utility m-3"
                                type="submit"
                            >
                                Create
                            </button>
                            <button
                                className="btn btn-primary btn-font btn-utility m-3"
                                type="button"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateTrainingPlanAdmin;
