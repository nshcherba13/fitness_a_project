jest.mock("../axiosConfig", () => ({
    put: jest.fn(),
    post: jest.fn(() => Promise.resolve({ status: 200, data: { token: "testToken" } })),
    delete: jest.fn(),
}));

let token;
jest.doMock("../components/userComponents/UserChat", () => {
    const UserChat = () => <UserChat />;
    return UserChat;
});

describe("User Component", () => {
    beforeEach(async () => {
        const axios = require("../axiosConfig");

        const response = await axios.post(
            "http://192.168.64.45:8090/api/login",
            {
                email: "itest@itest.com",
                password: "password",
            },
            { headers: { "Content-Type": "application/json" } }
        );

        expect(response.status).toBe(200);
        expect(response.data.token).toBeDefined();

        token = response.data.token;
    });

    it("messages", async () => {
        const axios = require("../axiosConfig");

        axios.get = jest.fn(() =>
            Promise.resolve({ status: 200, data: { messages: ["Message 1", "Message 2"] } })
        );

        const response = await axios.get("http://192.168.64.45:8090/api/messages", {
            headers: { Authorization: `Bearer ${token}` },
        });

        expect(response.status).toBe(200);
        expect(response.data.messages).toHaveLength(2);
        expect(response.data.messages).toContain("Message 1");
    });
});
