import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthProvider";
import axios from "axios";
import { getUserAccountInfo } from "../../api_user";

function AllTrainingPlansUser() {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [level, setLevel] = useState("");
    const [goal, setGoal] = useState("");
    const [subscription, setSubscription] = useState(null);

    const fetchPlans = async (query = "", level = "", goal = "") => {
        if (!auth?.token) {
            setError("You are not authenticated.");
            setLoading(false);
            return;
        }
        try {
            setLoading(true);

            const params = new URLSearchParams();

            if (query) params.append("query", query);
            if (level) params.append("level", level);
            if (goal) params.append("goal", goal);

            const url = `${process.env.REACT_APP_API_URL}/api/training-plans/filter?${params.toString()}`;

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            });
            setPlans(response.data.training_plans);
        } catch (err) {
            if (err.response?.status === 401) {
                setError("Unauthorized. Please log in again.");
            } else {
                setError("Failed to fetch plans. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchSubscription = async () => {
        try {
            const data = await getUserAccountInfo(auth.token);
            setSubscription(data.account.subscription);
        } catch (err) {
            console.error("Failed to fetch subscription:", err);
            setError("Failed to fetch subscription details.");
        }
    };

    useEffect(() => {
        fetchSubscription();
    }, [auth]);

    useEffect(() => {
        if (subscription === "Silver" || subscription === "Gold") {
            fetchPlans();
        }
    }, [auth, subscription]);

    if (error) {
        return <p>{error}</p>;
    }

    if (subscription !== "Silver" && subscription !== "Gold") {
        return (
            <>
                <h2 className="text-center m-3">To see all trainings plans please upgrade to Silver or Gold
                    Subscription</h2>

                <div className="d-flex justify-content-center">
                    <button
                        className="btn-font card-button-training-plans py-2 m-4"
                        style={{width: '50%'}}
                        type="button"
                        onClick={() => navigate("/user/subscription")}
                    >
                        View our Subscriptions
                    </button>
                </div>


            </>
        );
    }

    const handleButtonClick = (trainingPlanId) => {
        navigate(`/user/trainings/${trainingPlanId}`);
    };

    const handleSearch = () => {
        fetchPlans(searchQuery, level, goal);
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center my-3">
                <h1 className="mb-0">All Training Plans</h1>
            </div>

            <div className="d-flex align-items-center mb-4">
                <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Find Training Plans"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                <select
                    className="form-select me-2"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                >
                    <option value="">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                </select>

                <select
                    className="form-select me-2"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                >
                    <option value="">All Goals</option>
                    <option value="gain_weight">Gain Weight</option>
                    <option value="lose_weight">Lose Weight</option>
                    <option value="maintain_fitness">Maintain Fitness</option>
                </select>

                <button
                    className="btn btn-primary btn-font btn-utility bg-danger"
                    onClick={handleSearch}
                >
                    <i className="fas fa-search"></i>
                </button>
            </div>

            <div className="d-flex justify-content-between align-items-center p-1 mb-4">
                <div className="row justify-content-start row-gap-4">
                    {plans.map((trainingPlan) => (
                        <div key={trainingPlan.training_plan_id} className="col-xl-6 col-md-12">
                            <div className="card p-3">
                                <div className="card-ratio-container-training-plans">
                                    <img
                                        src={
                                            trainingPlan.picture
                                                ? trainingPlan.picture !== "images/training/example1.webp"
                                                    ? `${process.env.REACT_APP_API_URL}/storage/${trainingPlan.picture.replace("public/", "")}`
                                                    : `${process.env.REACT_APP_API_URL}/images/training/example1.webp`
                                                : "images/training/example1.webp"
                                        }
                                        className="card-img-top"
                                        alt={trainingPlan.title}
                                    />
                                </div>
                                <div className="card-body text-center">
                                    <h5 className="card-title py-2">{trainingPlan.title}</h5>
                                    <p className="card-text py-1">{trainingPlan.description}</p>
                                    <button
                                        onClick={() => handleButtonClick(trainingPlan.training_plan_id)}
                                        className="btn-font card-button-training-plans py-2"
                                    >
                                        View Plan
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default AllTrainingPlansUser;
