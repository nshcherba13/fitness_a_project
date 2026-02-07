import React, { useEffect, useState } from "react";
import axios from "../../axiosConfig";
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

const AdminStatistics = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get("/admin/statistics", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setStats(res.data);
            } catch (err) {
                console.error("Failed to fetch statistics", err);
            }
        };

        fetchStats();
    }, []);

    if (!stats) return <p>Loading statistics...</p>;

    const subscriptionColorMap = {
        Bronze: "#cd7f32",
        Silver: "#c0c0c0",
        Gold: "#ffd700",
    };

    const pieData = stats.subscriptions.map((sub) => ({
        name: sub.subscription.name,
        value: sub.count,
        color: subscriptionColorMap[sub.subscription.name] || "#8884d8",
    }));

    const barData = [
        { name: "Recipes", value: stats.total_recipes },
        { name: "Plans", value: stats.total_plans },
        { name: "Exercises", value: stats.total_exercises },
        { name: "Bonuses", value: stats.total_bonuses },
    ];

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center my-3">
                <div className="d-flex">
                    <h1 className="mb-0">Platform Statistics</h1>
                </div>
            </div>

            <div className="mb-5">
                <h5>Users by Subscription</h5>
                <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            outerRadius={150}
                            dataKey="value"
                            label
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Legend />
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="mb-5">
                <h5>Total Content</h5>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={barData}>
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#dc3545" /> {/* Bootstrap красный */}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AdminStatistics;
