import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthProvider";
import { createRecipe, uploadRecipePhoto } from "../../api_admin";

function CreateRecipeAdmin() {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        ingredients: "",
        category: "",
        cookingTime: "",
        calories: "",
    });

    const [file, setFile] = useState(null);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
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
            const recipe = await createRecipe(
                {
                    title: formData.title,
                    description: formData.description,
                    ingredients: formData.ingredients,
                    category: formData.category,
                    cooking_time: parseInt(formData.cookingTime, 10),
                    calories: parseInt(formData.calories, 10),
                },
                token
            );

            console.log('Recipe ID:', recipe.recipe_id);
            console.log('File:', file);
            console.log('FormData:', formData);

            if (file) {
                await uploadRecipePhoto(recipe.recipe_id, file, token);
            }

            alert("Recipe created successfully!");
            navigate("/admin/recipes");
        } catch (err) {
            console.error("Failed to create recipe or upload photo:", err.response?.data || err.message);
            alert("Failed to create recipe. Please check your inputs and try again.");
        }
    };

    const handleCancel = () => {
        navigate("/admin/recipes");
    };

    return (
        <div className="container mt-4 mx-0">
            <div className="row mb-3">
                <div className="col d-flex align-items-center">
                    <i
                        className="fas fa-solid fa-circle-arrow-left fa-2x me-4 icon-hover"
                        style={{ cursor: "pointer" }}
                        onClick={handleCancel}
                    ></i>
                    <h2 className="mb-0">Create New Recipe</h2>
                </div>
            </div>
            <div className="row">
                <div className="col-md-7 col-lg-10 mx-auto">
                    <form onSubmit={handleSave}>
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">Title:</label>
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
                            <label htmlFor="description" className="form-label">Description:</label>
                            <textarea
                                name="description"
                                id="description"
                                className="form-control"
                                rows="3"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="ingredients" className="form-label">Ingredients (comma-separated):</label>
                            <input
                                name="ingredients"
                                id="ingredients"
                                className="form-control"
                                value={formData.ingredients}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="category" className="form-label">Category:</label>
                            <input
                                name="category"
                                id="category"
                                className="form-control"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="image" className="form-label">Image:</label>
                            <input
                                type="file"
                                name="image"
                                id="image"
                                className="form-control"
                                onChange={handleFileChange}
                            />
                        </div>
                        <div className="row">
                            <div className="col-12 col-sm-6 mb-3">
                                <label htmlFor="cookingTime" className="form-label">Cooking Time (Minutes):</label>
                                <input
                                    type="number"
                                    name="cookingTime"
                                    id="cookingTime"
                                    className="form-control"
                                    value={formData.cookingTime}
                                    onChange={handleChange}
                                    min="0"
                                    step="1"
                                    required
                                />
                            </div>
                            <div className="col-12 col-sm-6 mb-3">
                                <label htmlFor="calories" className="form-label">Calories:</label>
                                <input
                                    type="number"
                                    name="calories"
                                    id="calories"
                                    className="form-control"
                                    value={formData.calories}
                                    onChange={handleChange}
                                    min="0"
                                    step="1"
                                    required
                                />
                            </div>
                        </div>
                        <div className="d-flex justify-content-center">
                            <button className="btn btn-primary btn-font btn-utility m-3" type="submit">Create</button>
                            <button className="btn btn-primary btn-font btn-utility m-3" type="button" onClick={handleCancel}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateRecipeAdmin;
