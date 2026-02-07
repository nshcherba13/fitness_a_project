// __tests__/Register.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import Register from "../pages/Register";
import axios from "../axiosConfig";

jest.mock("../axiosConfig");

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => jest.fn(),
}));

describe("Register Komponent", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>
        );
    });

    it("render form all fields for user input", () => {


        expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^Password:$/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^Confirm Password:$/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Your age:/i)).toBeInTheDocument();
        expect(screen.getByText(/Gender:/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/I am\.\.\./i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Weight \(kg\):/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Height \(cm\):/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /join the club/i })).toBeInTheDocument();
    });

    it("show error when user input nothing and click submit", async () => {
        fireEvent.click(screen.getByRole("button", { name: /join the club/i }));

        expect(await screen.findByText(/Full Name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Age must be between 16 and 100/i)).toBeInTheDocument();
        expect(screen.getByText(/Gender is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Fitness level is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Weight must be between 30 and 300 kg/i)).toBeInTheDocument();
        expect(screen.getByText(/Height must be between 100 and 300 cm/i)).toBeInTheDocument();
    });

    it("shows errors for invalid data input", async () => {
        fireEvent.change(screen.getByLabelText(/Full Name:/i), { target: { value: "" } });
        fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: "invalidEmail" } });
        fireEvent.change(screen.getByLabelText(/^Password:$/i), { target: { value: "short" } });
        fireEvent.change(screen.getByLabelText(/^Confirm Password:$/i), { target: { value: "diff" } });
        fireEvent.change(screen.getByLabelText(/Your age:/i), { target: { value: "120" } });
        fireEvent.click(screen.getByDisplayValue("male"));
        fireEvent.change(screen.getByLabelText(/I am\.\.\./i), { target: { value: "beginner" } });
        fireEvent.change(screen.getByLabelText(/Weight \(kg\):/i), { target: { value: "500" } });
        fireEvent.change(screen.getByLabelText(/Height \(cm\):/i), { target: { value: "50" } });

        fireEvent.click(screen.getByRole("button", { name: /join the club/i }));

        expect(await screen.findByText(/Full Name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Invalid Email/i)).toBeInTheDocument();
        expect(screen.getByText(/Password must be at least 8 characters/i)).toBeInTheDocument();
        expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
        expect(screen.getByText(/Age must be between 16 and 100/i)).toBeInTheDocument();
        expect(screen.getByText(/Weight must be between 30 and 300 kg/i)).toBeInTheDocument();
        expect(screen.getByText(/Height must be between 100 and 300 cm/i)).toBeInTheDocument();
    });

    it("do registration call when form valid and user press submit", async () => {
        axios.post.mockResolvedValueOnce({ data: { message: "Registered" } });



        fireEvent.change(screen.getByLabelText(/Full Name:/i), { target: { value: "John Smith" } });
        fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: "john@example.com" } });
        fireEvent.change(screen.getByLabelText(/^Password:$/i), { target: { value: "password123" } });
        fireEvent.change(screen.getByLabelText(/^Confirm Password:$/i), { target: { value: "password123" } });
        fireEvent.change(screen.getByLabelText(/Your age:/i), { target: { value: "25" } });
        fireEvent.click(screen.getByDisplayValue("male"));
        fireEvent.change(screen.getByLabelText(/I am\.\.\./i), { target: { value: "beginner" } });
        fireEvent.change(screen.getByLabelText(/Weight \(kg\):/i), { target: { value: "70" } });
        fireEvent.change(screen.getByLabelText(/Height \(cm\):/i), { target: { value: "175" } });

        fireEvent.click(screen.getByRole("button", { name: /join the club/i }));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith("/register", {
                name: "John Smith",
                email: "john@example.com",
                password: "password123",
                age: 25,
                gender: "male",
                fitness_level: "beginner",
                weight: 70,
                height: 175,
            });
        });
    });

    it("display error if request fail from server", async () => {
        axios.post.mockRejectedValueOnce({
            response: {
                data: {
                    message: "Registration error from server",
                },
            },
        });



        fireEvent.change(screen.getByLabelText(/Full Name:/i), { target: { value: "John Smith" } });
        fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: "john@example.com" } });
        fireEvent.change(screen.getByLabelText(/^Password:$/i), { target: { value: "password123" } });
        fireEvent.change(screen.getByLabelText(/^Confirm Password:$/i), { target: { value: "password123" } });
        fireEvent.change(screen.getByLabelText(/Your age:/i), { target: { value: "25" } });
        fireEvent.click(screen.getByDisplayValue("male"));
        fireEvent.change(screen.getByLabelText(/I am\.\.\./i), { target: { value: "beginner" } });
        fireEvent.change(screen.getByLabelText(/Weight \(kg\):/i), { target: { value: "70" } });
        fireEvent.change(screen.getByLabelText(/Height \(cm\):/i), { target: { value: "175" } });

        fireEvent.click(screen.getByRole("button", { name: /join the club/i }));

        expect(await screen.findByText("Registration error from server")).toBeInTheDocument();
    });
});
