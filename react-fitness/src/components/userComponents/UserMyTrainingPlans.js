import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../../context/AuthProvider";
import { getUserTrainingPlans, removePlanFromUser } from "../../api_user";
import {useNavigate} from "react-router-dom";

const MyTrainingPlans = () => {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [activePlans, setActivePlans] = useState([]);
    const [completedPlans, setCompletedPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const { activePlans, completedPlans } = await getUserTrainingPlans(auth.token);
                setActivePlans(activePlans || []);
                setCompletedPlans(completedPlans || []);
            } catch (err) {
                console.error("Failed to load training plans:", err);
                setError("Failed to load training plans. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, [auth]);

    if (loading) {
        return <p>Loading training plans...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const handleButtonClick = (trainingPlanId) => {
        navigate(`/user/trainings/${trainingPlanId}`);
    };

    const handleRemovePlan = async (e, planId) => {
        e.stopPropagation();
        try {
            await removePlanFromUser(planId, auth.token);
            setActivePlans((prev) => prev.filter((plan) => plan.training_plan_id !== planId));
            setCompletedPlans((prev) => prev.filter((plan) => plan.training_plan_id !== planId));

            alert("Training plan removed successfully!");
        } catch (err) {
            console.error("Failed to remove training plan:", err);
            alert("Failed to remove training plan. Please try again.");
        }
    };

    return (

        <>
            <div className="d-flex justify-content-between align-items-center my-3">
                <div className="d-flex">
                    <h1 className="mb-3 header-font-size-small">My Training Plans</h1>
                </div>
            </div>

            <div className="d-flex justify-content-between align-items-center p-1 mb-4">
                <div className="row justify-content-start row-gap-4">
                    {activePlans.map((plan) => (
                        <div key={plan.training_plan_id} className='col-xl-6 col-md-12'>
                            <div className="card p-3">
                                <div className="card-ratio-container-training-plans">
                                    <img
                                        src={plan.picture ? plan.picture !== 'images/training/example1.webp'
                                                ? `${process.env.REACT_APP_API_URL}/storage/${plan.picture.replace('public/', '')}`
                                                : `${process.env.REACT_APP_API_URL}/images/training/example1.webp`
                                            : "images/training/example1.webp"} className="card-img-top"
                                        alt={plan.title}/>
                                    <i className="fa-regular fa-heart fa-2x mx-3 mt-2 icon-hover position-absolute far text-danger"
                                       style={{
                                           cursor: "pointer",
                                           top: "10px",
                                           right: "10px",
                                           color: "red",
                                           zIndex: 10,
                                       }}
                                       onClick={(e) => handleRemovePlan(e, plan.training_plan_id)}
                                    >
                                    </i>
                                </div>
                                <div className="card-body text-center ">
                                    <h5 className="card-title py-2">{plan.title}</h5>
                                    <p className="card-text py-1">{plan.description}</p>
                                    <button onClick={() => handleButtonClick(plan.training_plan_id)}
                                            className="btn-font card-button-training-plans py-2 ">View Plan
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            <div className="d-flex justify-content-between align-items-center my-3">
                <div className="d-flex">
                    <h1 className="mb-3 header-font-size-small">Finished Training Plans</h1>
                </div>
            </div>


            <div className="row justify-content-start row-gap-4">
                {completedPlans.length > 0 ? (
                    completedPlans.map((plan) => (
                        <div key={plan.training_plan_id} className='col-xl-6 col-md-12'>
                            <div className="card p-3">
                                <div className="card-ratio-container-training-plans">
                                    <img
                                        src={plan.picture ? plan.picture !== 'images/training/example1.webp'
                                                ? `${process.env.REACT_APP_API_URL}/storage/${plan.picture.replace('public/', '')}`
                                                : `${process.env.REACT_APP_API_URL}/images/training/example1.webp`
                                            : "images/training/example1.webp"} className="card-img-top"
                                        alt={plan.title}/>
                                </div>
                                <div className="card-body text-center ">
                                    <h5 className="card-title py-2">{plan.title}</h5>
                                    <p className="card-text py-1">{plan.description}</p>
                                    <button onClick={() => handleButtonClick(plan.training_plan_id)}
                                            className="btn-font card-button-training-plans py-2 ">View Plan
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12 mt-2">
                        <p className="">You don't have any completed training plans yet.</p>
                    </div>
                )}
            </div>

        </>
    );
};

export default MyTrainingPlans;
