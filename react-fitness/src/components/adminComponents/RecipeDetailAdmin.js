import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../../context/AuthProvider";
import { getRecipeById, updateRecipe, deleteRecipe, updateRecipePhoto } from "../../api_admin";


function RecipeDetailAdmin() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        ingredients: "",
        category: "",
        picture: null,
        cookingTime: "",
        calories: "",
        createdBy: "",
        createdAt: "",
        updatedAt: "",
    });

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const recipe = await getRecipeById(id, auth.token);
                const pictureUrl = recipe.picture
                    ? recipe.picture !== 'images/menu/scrumble.png'
                        ? `${process.env.REACT_APP_API_URL}/storage/${recipe.picture.replace('public/', '')}`
                        : `${process.env.REACT_APP_API_URL}/images/menu/scrumble.png`
                    : "https://worldfoodtour.co.uk/wp-content/uploads/2013/06/neptune-placeholder-48.jpg";

                setFormData({
                    title: recipe.title,
                    description: recipe.description,
                    ingredients: recipe.ingredients,
                    category: recipe.category,
                    picture: pictureUrl,
                    cookingTime: recipe.cooking_time,
                    calories: recipe.calories,
                    createdBy: recipe.created_by || 'Admin',
                    createdAt: recipe.created_at,
                    updatedAt: recipe.updated_at,
                });
            } catch (err) {
                console.error('Failed to fetch recipe:', err);
            }
        };

        fetchRecipe();
    }, [id, auth.token]);

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
                ingredients: formData.ingredients,
                category: formData.category,
                cooking_time: parseInt(formData.cookingTime, 10),
                calories: parseInt(formData.calories, 10),
            };

            await updateRecipe(id, updatedData, auth.token);

            if (formData.picture instanceof File) {
                await updateRecipePhoto(id, formData.picture, auth.token);
            }

            alert('Recipe updated successfully!');
            navigate("/admin/recipes");
        } catch (err) {
            console.error('Failed to update recipe:', err.response?.data || err.message);
            alert('Failed to update recipe. Please try again.');
        }
    };
    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this recipe?')) {
            try {
                await deleteRecipe(id, auth.token);
                alert('Recipe deleted successfully!');
                navigate('/admin/recipes');
            } catch (err) {
                console.error('Failed to delete recipe:', err);
                alert('Failed to delete recipe. Please try again.');
            }
        }
    };

    const handleBack = () => {
        navigate("/admin/recipes");
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
                    <h2 className="mb-0">Edit Recipe (ID: {id})</h2>
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
                            <label htmlFor="ingredients" className="form-label">
                                Ingredients (comma-separated):
                            </label>
                            <input
                                name="ingredients"
                                id="ingredients"
                                className="form-control"
                                value={formData.ingredients}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="category" className="form-label">
                                Category:
                            </label>
                            <input
                                name="category"
                                id="category"
                                className="form-control"
                                value={formData.category}
                                onChange={handleChange}
                            />
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
                                        alt="Recipe"
                                        style={{ maxWidth: "200px", maxHeight: "200px" }}
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

                        <div className="row">
                            <div className="col-12 col-sm-6 mb-3">
                                <label htmlFor="cookingTime" className="form-label">
                                    Cooking Time (Minutes):
                                </label>
                                <input
                                    type="number"
                                    name="cookingTime"
                                    id="cookingTime"
                                    className="form-control"
                                    value={formData.cookingTime}
                                    onChange={handleChange}
                                    min="0"
                                    step="1"
                                />
                            </div>
                            <div className="col-12 col-sm-6 mb-3">
                                <label htmlFor="calories" className="form-label">
                                    Calories:
                                </label>
                                <input
                                    type="number"
                                    name="calories"
                                    id="calories"
                                    className="form-control"
                                    value={formData.calories}
                                    onChange={handleChange}
                                    min="0"
                                    step="1"
                                />
                            </div>
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
                                Delete Recipe
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RecipeDetailAdmin;
