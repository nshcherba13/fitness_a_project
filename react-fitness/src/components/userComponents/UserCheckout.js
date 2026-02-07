import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { updateUserSubscription } from "../../api_user";
import AuthContext from "../../context/AuthProvider";

function UserCheckout() {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const location = useLocation();
    const { subscription } = location.state || {};

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        address2: "",
        country: "",
        state: "",
        zip: "",
        paymentMethod: "credit",
        ccName: "",
        ccNumber: "",
        ccExpiration: "",
        ccCvv: "",
    });
    const [formValidated, setFormValidated] = useState(false);

    if (!subscription) {
        return <p>No subscription selected. Please go back and choose a plan.</p>;
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateCardNumber = (number) => {
        const regex = /^\d{16}$/;
        if (!regex.test(number)) return false;

        let sum = 0;
        for (let i = 0; i < number.length; i++) {
            let digit = parseInt(number[number.length - 1 - i], 10);
            if (i % 2 === 1) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            sum += digit;
        }
        return sum % 10 === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;

        const cleanedExpiration = formData.ccExpiration.trim();
        const [month, year] = cleanedExpiration.split("/").map((val) => parseInt(val, 10));

        if (
            isNaN(month) || isNaN(year) ||
            month < 1 || month > 12 ||
            year < 0
        ) {
            alert("The expiration date format is invalid. Please use MM/YY format.");
            return;
        }

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear() % 100;

        if (year < currentYear || (year === currentYear && month < currentMonth)) {
            alert("The expiration date of the card is invalid or has already passed.");
            return;
        }

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            try {
                await updateUserSubscription(subscription.subscription_id, auth.token);
                alert("Subscription updated successfully!");
                navigate("/user/subscription");
            } catch (error) {
                console.error("Failed to update subscription:", error);
                alert("An error occurred while updating your subscription. Please try again.");
            }
        }
        setFormValidated(true);
    };

    const handleBack = () => {
        navigate("/user/subscription");
    };

    return (
        <>
            <div className="row mb-4 mt-3">
                <div className="col d-flex align-items-center">
                    <i
                        className="fas fa-solid fa-circle-arrow-left fa-2x me-4 mb-1 icon-hover"
                        style={{ cursor: "pointer" }}
                        onClick={handleBack}
                    ></i>
                    <h2 className="mb-0">Checkout Form</h2>
                </div>
            </div>

            <div className="row">
                <div className="col-md-4 order-md-2 mb-4">
                    <h4 className="d-flex justify-content-between align-items-center mb-3">
                        <span className="text-muted">Your cart</span>
                        <span className="badge bg-secondary rounded-pill bg-black">1</span>
                    </h4>
                    <ul className="list-group mb-3 sticky-top">
                        <li className="list-group-item d-flex justify-content-between lh-condensed">
                            <div>
                                <h6 className="my-0">{subscription.name}</h6>
                                <small className="text-muted">{subscription.description}</small>
                            </div>
                            <p>
                                <strong>Price:</strong> ${subscription.price}
                            </p>
                        </li>
                    </ul>
                </div>

                <div className="col-md-8 order-md-1">
                    <h4 className="mb-3">Billing address</h4>
                    <form
                        className={`needs-validation ${formValidated ? "was-validated" : ""}`}
                        noValidate
                        onSubmit={handleSubmit}
                    >
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="firstName">First name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    required
                                />
                                <div className="invalid-feedback">Valid first name is required.</div>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="lastName">Last name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    required
                                />
                                <div className="invalid-feedback">Valid last name is required.</div>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email">Email (Optional)</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="you@example.com"
                            />
                            <div className="invalid-feedback">Please enter a valid email address.</div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="address">Address</label>
                            <input
                                type="text"
                                className="form-control"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                required
                            />
                            <div className="invalid-feedback">Please enter your shipping address.</div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="address2">Address 2 (Optional)</label>
                            <input
                                type="text"
                                className="form-control"
                                id="address2"
                                name="address2"
                                value={formData.address2}
                                onChange={handleInputChange}
                                placeholder="Apartment or suite"
                            />
                        </div>

                        <div className="row">
                            <div className="col-md-5 mb-3">
                                <label htmlFor="country">Country</label>
                                <select
                                    className="form-select"
                                    id="country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Choose...</option>
                                    <option>United States</option>
                                    <option>Germany</option>
                                </select>
                                <div className="invalid-feedback">Please select a valid country.</div>
                            </div>
                            <div className="col-md-4 mb-3">
                                <label htmlFor="state">State</label>
                                <select
                                    className="form-select"
                                    id="state"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Choose...</option>
                                    <option value="baden-wuerttemberg">Baden-Württemberg</option>
                                    <option value="bavaria">Bayern</option>
                                    <option value="berlin">Berlin</option>
                                    <option value="brandenburg">Brandenburg</option>
                                </select>
                                <div className="invalid-feedback">Please select a valid state.</div>
                            </div>
                            <div className="col-md-3 mb-3">
                                <label htmlFor="zip">Zip</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="zip"
                                    name="zip"
                                    value={formData.zip}
                                    onChange={handleInputChange}
                                    required
                                />
                                <div className="invalid-feedback">Zip code required.</div>
                            </div>
                        </div>

                        <h4 className="mb-3">Payment</h4>
                        <div className="d-block my-3">
                            <div className="form-check">
                                <input
                                    id="credit"
                                    name="paymentMethod"
                                    type="radio"
                                    className="form-check-input"
                                    value="credit"
                                    checked={formData.paymentMethod === "credit"}
                                    onChange={handleInputChange}
                                    required
                                />
                                <label className="form-check-label" htmlFor="credit">
                                    Credit card
                                </label>
                            </div>
                            <div className="form-check">
                                <input
                                    id="debit"
                                    name="paymentMethod"
                                    type="radio"
                                    className="form-check-input"
                                    value="debit"
                                    checked={formData.paymentMethod === "debit"}
                                    onChange={handleInputChange}
                                />
                                <label className="form-check-label" htmlFor="debit">
                                    Debit card
                                </label>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="ccName">Name on card</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="ccName"
                                    name="ccName"
                                    value={formData.ccName}
                                    onChange={handleInputChange}
                                    required
                                />
                                <small className="text-muted">Full name as displayed on card</small>
                                <div className="invalid-feedback">Name on card is required</div>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="ccNumber">Credit card number</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="ccNumber"
                                    name="ccNumber"
                                    value={formData.ccNumber}
                                    onChange={handleInputChange}
                                    maxLength={16}
                                    required
                                />
                                <div className="invalid-feedback">Credit card number is required</div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-3 mb-3">
                                <label htmlFor="ccExpiration">Expiration</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="ccExpiration"
                                    name="ccExpiration"
                                    value={formData.ccExpiration}
                                    onChange={handleInputChange}
                                    placeholder="MM/YY"
                                    maxLength={5}
                                    required
                                />
                                <div className="invalid-feedback">Expiration date required</div>
                            </div>
                            <div className="col-md-3 mb-3">
                                <label htmlFor="ccCvv">CVV</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="ccCvv"
                                    name="ccCvv"
                                    value={formData.ccCvv}
                                    onChange={handleInputChange}
                                    maxLength={3}
                                    required
                                />
                                <div className="invalid-feedback">Security code required</div>
                            </div>
                        </div>
                        <hr className="mb-4"/>
                        <div className="d-flex justify-content-center">
                            <button
                                className="btn btn-primary btn-font btn-utility m-3"
                                type="submit"
                            >
                                Continue to checkout
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default UserCheckout;
