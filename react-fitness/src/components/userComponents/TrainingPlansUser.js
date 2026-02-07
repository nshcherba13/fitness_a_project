import React, {useEffect, useState, useContext} from "react";
import {useNavigate} from "react-router-dom";
import AuthContext from "../../context/AuthProvider";
import {getRecommendedPlans, getUserAccountInfo} from "../../api_user";
import UserMyTrainingPlans from "./UserMyTrainingPlans";


function TrainingPlansUser() {
    const {auth} = useContext(AuthContext);
    const navigate = useNavigate();
    const [recommendedPlans, setRecommendedPlans] = useState([]);
    const [subscription, setSubscription] = useState(null);

    useEffect(() => {
        const fetchRecommendedPlans = async () => {
            try {
                const plans = await getRecommendedPlans(auth.token);
                const data = await getUserAccountInfo(auth.token);
                setRecommendedPlans(plans);
                setSubscription(data.account.subscription);

            } catch (err) {
                console.error('Failed to fetch recommended training plans:', err);
            }
        };
        fetchRecommendedPlans();
    }, [auth]);

    const handleButtonClick = (trainingPlanId) => {
        navigate(`/user/trainings/${trainingPlanId}`);
    };

    const handleNavigateToAllPlans = () => {
        if (subscription === 'Bronze') {
            navigate("/user/subscription");
        } else {
            navigate("/user/all-training-plans");
        }
    };

    return (
        <>
            <UserMyTrainingPlans/>

            <div>
                <div className="d-flex justify-content-between align-items-center my-3">
                    <div className="d-flex">
                        <h1 className="mb-3 header-font-size-small">Recommended Plans</h1>
                    </div>
                </div>

                <div className="d-flex justify-content-between align-items-center p-1 mb-4">
                    <div className="row justify-content-start row-gap-4">
                        {recommendedPlans.map((plan) => (
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
                        ))}
                    </div>
                </div>

            </div>


            <div className="d-flex justify-content-center">
                <button
                    className="btn-font card-button-training-plans py-2 mb-4"
                    style={{width: '50%'}}
                    type="button"
                    onClick={handleNavigateToAllPlans}
                >
                    All Training Plans
                </button>
            </div>


        </>
    )
}

export default TrainingPlansUser;
