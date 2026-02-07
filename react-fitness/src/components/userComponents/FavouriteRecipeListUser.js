import React, {useState, useEffect, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import AuthContext from '../../context/AuthProvider';
import axios from 'axios';

function FavoriteRecipeListUser() {
    const {auth} = useContext(AuthContext);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchFavorites = async () => {
        if (!auth?.token) {
            setError('You are not authenticated.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/recipes/favorites`, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            });
            setFavorites(response.data.favourites);

            const favoriteRecipeIds = response.data.favourites.map((fav) => fav.recipe_id);

            setFavorites((prevRecipes) =>
                prevRecipes.map((recipe) => ({
                    ...recipe,
                    liked: favoriteRecipeIds.includes(recipe.recipe_id),
                }))
            );
        } catch (err) {
            if (err.response?.status === 401) {
                setError('Unauthorized. Please log in again.');
            } else {
                setError('Failed to fetch favorite recipes. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleLike = async (recipeId) => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/recipes/favorites`,
                {recipe_id: recipeId},
                {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                    },
                }
            );

            if (response.status === 200 || response.status === 201) {
                setFavorites((prevData) =>
                    prevData.map((recipe) =>
                        recipe.recipe_id === recipeId
                            ? {...recipe, liked: !recipe.liked}
                            : recipe
                    )
                );
            }

        } catch (error) {
            console.error("Error toggling favorite:", error);
            setError("Failed to toggle favorite. Please try again.");
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, [auth.token]);

    const handleCardClick = (recipeId) => {
        navigate(`/user/recipes/${recipeId}`);
    };

    const handleRecipeClick = () => {
        navigate('/user/recipes');
    };

    if (loading) {
        return <p>Loading your favorite recipes...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center my-3">
                <div className="d-flex">
                    <h1 className="mb-0 header-font-size-small">Favourite Recipes</h1>
                </div>
            </div>
            <div className="row">
                {favorites.length === 0 ? (
                    <p>You have no favorite recipes.</p>
                ) : (
                    favorites.map((recipe) => (
                        <div key={recipe.recipe_id} className="col-xl-4 col-md-6 col-sm-10 mb-4">
                            <div className="card h-100"
                                 style={{cursor: "pointer"}}
                                 onClick={() => handleCardClick(recipe.recipe_id)}
                            >
                                <img
                                    src={
                                        recipe.picture
                                            ? recipe.picture !== 'images/menu/scrumble.png'
                                                ? `${process.env.REACT_APP_API_URL}/storage/${recipe.picture.replace('public/', '')}`
                                                : `${process.env.REACT_APP_API_URL}/images/menu/scrumble.png`
                                            : "https://worldfoodtour.co.uk/wp-content/uploads/2013/06/neptune-placeholder-48.jpg"
                                    }
                                    className="card-img-top img-fluid"
                                    style={{maxWidth: "600px", height: "auto"}}
                                    alt={recipe.title}
                                />
                                <i className={`fa-regular fa-heart fa-2x mx-3 mt-2 icon-hover position-absolute ${recipe.liked ? "fas text-danger" : "far text-gray"}`}
                                   style={{
                                       cursor: "pointer",
                                       top: "10px",
                                       right: "10px",
                                       color: recipe.liked ? "red" : "gray",
                                       zIndex: 10,
                                   }}
                                   onClick={(e) => {
                                       e.stopPropagation();
                                       toggleLike(recipe.recipe_id);
                                   }}
                                >
                                </i>
                                <div className="card-body">
                                    <h5 className="card-title text-center">{recipe.title}</h5>
                                    <p className="card-text text-center">
                                        {recipe.category.length > 100
                                            ? recipe.category.substring(0, 100) + "..."
                                            : recipe.category}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className="d-flex justify-content-center">
                <button
                    className="btn-font card-button-training-plans py-2 mb-4"
                    style={{width: '50%'}}
                    type="button"
                    onClick={handleRecipeClick}
                >
                    All Recipes
                </button>
            </div>
        </>
    );
};

export default FavoriteRecipeListUser;
