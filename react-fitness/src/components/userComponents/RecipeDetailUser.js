import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { getRecipeById } from "../../api_admin";
import AuthContext from "../../context/AuthProvider";
import axios from "axios";

function RecipeDetailUser() {
    const { auth } = useContext(AuthContext);
    const { id } = useParams();

    const [recipeData, setRecipeData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
            const fetchRecipe = async () => {
                try {
                    setLoading(true);
                    const recipe = await getRecipeById(id, auth.token);

                    const favoriteResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/recipes/favorites`, {
                        headers: {
                            Authorization: `Bearer ${auth.token}`,
                        },
                    });

                    const favoriteRecipeIds = favoriteResponse.data.favourites.map((fav) => fav.recipe_id);
                    const isFavorited = favoriteRecipeIds.includes(recipe.recipe_id);

                    setRecipeData({ ...recipe, liked: isFavorited });

                } catch (err) {
                    console.error('Failed to fetch recipe details:', err);
                } finally {
                    setLoading(false);
                }
            };

            fetchRecipe();
        }, [id, auth.token]);

        const handleFavoriteToggle = async (recipeId) => {
            try {
                if (recipeData.liked) {
                    await axios.delete(`${process.env.REACT_APP_API_URL}/api/recipes/favorites/${id}`, {
                        headers: {
                            Authorization: `Bearer ${auth.token}`,
                        },
                    });
                } else {
                    await axios.post(`${process.env.REACT_APP_API_URL}/api/recipes/favorites`, { recipe_id: id }, {
                        headers: {
                            Authorization: `Bearer ${auth.token}`,
                        },
                    });
                }

                setRecipeData((prevData) => ({ ...prevData, liked: !prevData.liked }));

            } catch (error) {
                console.error("Error toggling favorite:", error);
            }
        };

        if (loading) {
            return <p>Loading recipe details...</p>;
        }

    return (
        <div className="container px-0 mx-0 mb-3">

            <div className="row">
                <div className="col-md-7 col-lg-10 mx-auto">
                    <div className="card p-4">
                        <h1 className="text-center mb-4 header-font-size-small">{recipeData.title}</h1>

                        <div className="mb-3">
                            <p className="description">{recipeData.description}</p>
                        </div>

                        <div className="mb-3">
                                <img
                                    src={recipeData.picture ? recipeData.picture !== 'images/menu/scrumble.png'
                                            ? `${process.env.REACT_APP_API_URL}/storage/${recipeData.picture.replace('public/', '')}`
                                            : `${process.env.REACT_APP_API_URL}/images/menu/scrumble.png`
                                        : "https://worldfoodtour.co.uk/wp-content/uploads/2013/06/neptune-placeholder-48.jpg"
                                        }
                                    alt={recipeData.title}
                                    className="card-img"
                                />
                        </div>

                        <div className="row mb-3">
                            <div className="col-12 col-sm-6">
                                <strong>Cooking Time (Minutes):</strong>
                                <p className="description">{recipeData.cookingTime || "N/A"}</p>
                            </div>
                            <div className="col-12 col-sm-6">
                                <strong>Calories:</strong>
                                <p className="description">{recipeData.calories || "N/A"}</p>
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-12 col-sm-6">
                                <strong>Ingredients:</strong>
                                <p className="description">{recipeData.ingredients}</p>
                            </div>
                            <div className="col-12 col-sm-6">
                                <strong>Category:</strong>
                                <p className="description">{recipeData.category}</p>
                            </div>
                        </div>

                        <button
                            className="btn-font card-button-training-plans py-2 my-3"
                            onClick={handleFavoriteToggle}
                        >
                            {recipeData.liked ? "Remove from Favourites" : "Add to Favourites"}
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecipeDetailUser;
