import React, { useEffect, useState, useContext } from "react";
import {useNavigate} from "react-router-dom";
import AuthContext from "../../context/AuthProvider";
import axios from "axios";



function RecipesListAdmin() {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchRecipes = async (query = "") => {
        console.log("Token being sent:", auth.token);

        if (!auth?.token) {
            setError("You are not authenticated.");
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const url = query
                ? `${process.env.REACT_APP_API_URL}/api/recipes/search?query=${query}`
                : `${process.env.REACT_APP_API_URL}/api/recipes`;

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            });
            setRecipes(response.data.recipes);
        } catch (err) {
            if (err.response?.status === 401) {
                setError("Unauthorized. Please log in again.");
            } else {
                setError("Failed to fetch recipes. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecipes();
    }, [auth]);

    if (loading) {
        return <p>Loading recipes...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const handleCardClick = (recipeId) => {
        navigate(`/admin/recipes/${recipeId}`);
    };

    const handleCreateRecipe = () => {
        navigate("/admin/recipes/new");
    };

    const handleSearch = () => {
        fetchRecipes(searchQuery);
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center my-3">
                <div className="d-flex">
                    <h1 className="mb-0 header-font-size-small">All Recipes</h1>
                    <i className="fas fa-solid fa-folder-plus fa-2x mx-3 mt-2 icon-hover" style={{cursor: "pointer"}}
                       onClick={handleCreateRecipe}></i>
                </div>
                <div className="d-flex mb-4">
                    <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Enter recipe title"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                        className="btn btn-primary btn-font btn-utility bg-danger"
                        onClick={handleSearch}
                    >
                        <i className="fas fa-search"></i>
                    </button>
                </div>
            </div>
            <div className="row">
                {recipes.map((recipe) => (
                    <div key={recipe.id} className="col-xl-4 col-md-6 col-sm-10 mb-4">
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
                                style={{ maxWidth: "600px", height: "auto" }}
                                alt={recipe.title}
                            />
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
                ))}
            </div>
        </>
    );
}

export default RecipesListAdmin;
