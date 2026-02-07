import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import UserProfile from "../components/userComponents/UserProfile";
import AuthContext from "../context/AuthProvider";
import axios from "../axiosConfig";

jest.mock("../axiosConfig");

describe("UserProfile Component", () => {
    const mockAuth = { token: "testToken" };

    const mockAccount = {
        registration_date: "2025-01-01",
        age: 22,
        gender: "male",
        fitness_level: "beginner",
        weight: 70,
        height: 170,
        subscription: 1,
        profile_picture: "images/user.png",
    };
    const mockUser = {
        name: "John Doe",
        email: "john.doe@example.com",
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders user data when fetch", async () => {
        axios.get.mockResolvedValueOnce({
            status: 200,
            data: {
                account: mockAccount,
                user: mockUser,
            },
        });

        render(
            <MemoryRouter>
                <AuthContext.Provider value={{ auth: mockAuth }}>
                    <UserProfile />
                </AuthContext.Provider>
            </MemoryRouter>
        );

        expect(axios.get).toHaveBeenCalledWith("/account/info", {
            headers: {
                Authorization: `Bearer ${mockAuth.token}`,
            },
        });

        expect(await screen.findByText("John Doe")).toBeInTheDocument();
        expect(await screen.findByText("john.doe@example.com")).toBeInTheDocument();
        expect(await screen.findByText("2025-01-01")).toBeInTheDocument();
        expect(await screen.findByText("22")).toBeInTheDocument();
        expect(await screen.findByText("male")).toBeInTheDocument();
        expect(await screen.findByText("beginner")).toBeInTheDocument();
        expect(await screen.findByText("70")).toBeInTheDocument();
        expect(await screen.findByText("170")).toBeInTheDocument();
        expect(await screen.findByText("1")).toBeInTheDocument();
    });

    it("shows an error if  fetch fails", async () => {
        axios.get.mockRejectedValueOnce({
            response: {
                data: {
                    message: "Fetching user data failed",
                },
            },
        });

        render(
            <MemoryRouter>
                <AuthContext.Provider value={{ auth: mockAuth }}>
                    <UserProfile />
                </AuthContext.Provider>
            </MemoryRouter>
        );

    });

    it("returns null when userData is null", () => {
        axios.get.mockImplementationOnce(() => new Promise(() => {}));

        const { container } = render(
            <MemoryRouter>
                <AuthContext.Provider value={{ auth: mockAuth }}>
                    <UserProfile />
                </AuthContext.Provider>
            </MemoryRouter>
        );

        expect(container).toBeEmptyDOMElement();
    });
});
