import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../context/AuthProvider";
import { getUserAccountInfo, getSubscriptionByName } from "../../api_user";
import UserSubscriptionsList from "./UserSubscriptionsList";

function UserSubscription() {
    const { auth } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [subscription, setSubscription] = useState(null);

    useEffect(() => {
        const fetchSubscription = async () => {
            try {
                setLoading(true);

                const data = await getUserAccountInfo(auth.token);

                if (data.account.subscription) {
                    const subscriptionData = await getSubscriptionByName(
                        data.account.subscription,
                        auth.token
                    );
                    setSubscription(subscriptionData);
                }
            } catch (err) {
                setError("Failed to fetch subscription information.");
            } finally {
                setLoading(false);
            }
        };

        fetchSubscription();
    }, [auth]);

    if (loading) {
        return <p>Loading subscriptions...</p>;
    }

    if (error) {
        return <p className="text-danger">{error}</p>;
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center my-3">
                <div className="d-flex">
                    <h1 className="mb-0 header-font-size-small">Your Subscription</h1>
                </div>
            </div>

            <div>
                <div className="row justify-content-center">

                    {subscription ? (
                        <div className="table-responsive">
                            <table className="table ios-table">
                                <tbody>
                                <tr>
                                    <td className="label-cell">Subscription</td>
                                    <td className="value-cell">{subscription.name}</td>
                                </tr>
                                <tr>
                                    <td className="label-cell">Description</td>
                                    <td className="value-cell">{subscription.description}</td>
                                </tr>
                                <tr>
                                    <td className="label-cell">Price</td>
                                    <td className="value-cell">${subscription.price}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div>
                            <p>No subscription found. Please select one of the available subscriptions below</p>
                        </div>
                    )}
                </div>

                <UserSubscriptionsList/>
            </div>
        </>
    );
}

export default UserSubscription;
