import React, {useState, useEffect, useContext} from "react";
import { useNavigate } from "react-router-dom";
import { getSubscriptions } from "../../api_user";
import AuthContext from "../../context/AuthProvider";



function UserSubscriptionsList() {
    const { auth } = useContext(AuthContext);
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchSubscriptions = async () => {
        try {
            const data = await getSubscriptions(auth.token);
            setSubscriptions(data);
            setLoading(false);
        } catch (err) {
            setError("Failed to load subscriptions");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const handleCardClick = (subscription) => {
        navigate(`checkout`, { state: { subscription } });
    };

    const getSubscriptionBackground = (id) => {
        switch (id) {
            case 1:
                return "/images/subscriptions/bronze.jpg";
            case 2:
                return "/images/subscriptions/silver.jpg";
            case 3:
                return "/images/subscriptions/gold.avif";
            default:
                return "/images/subscriptions/default.jpg";
        }
    };

    if (loading) {
        return <p>Loading subscriptions...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center my-3">
                <div className="d-flex">
                    <h1 className="mb-0 header-font-size-small">All Our Plans</h1>
                </div>
            </div>

            <div className="row justify-content-center">
                {subscriptions.map((sub) => {
                    const bgUrl = getSubscriptionBackground(sub.subscription_id);

                    return (
                        <div key={sub.subscription_id} className="col-xl-4 col-md-6 col-sm-9 my-4 mx-auto">
                            <div
                                className="card-subscription-admin"
                                style={{backgroundImage: `url(${bgUrl})`}}
                            >
                                <div className="card-details-subscription-admin">
                                    <p className="text-title">{sub.name} Subscription</p>
                                    <p className="text-body">Price: ${sub.price}</p>
                                    <p className="text-body">More Info: {sub.description}</p>
                                </div>

                                <button
                                    className="card-button-subscription-admin"
                                    onClick={() => handleCardClick(sub)}
                                >
                                    Select This Plan
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}

export default UserSubscriptionsList;
