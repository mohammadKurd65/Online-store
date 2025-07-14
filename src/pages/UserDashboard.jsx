import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // assuming you have an auth context
import HasPermission from "../components/HasPermission";
import { usePermission } from '../hooks/usePermission';
const UserDashboard = () => {
    const { canDeleteUsers } = usePermission();

if (canDeleteUsers) {
  // نمایش دکمه حذف
}
    const [userOrders, setUserOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth(); // get current user from auth context

    useEffect(() => {
        const fetchUserOrders = async () => {
            try {
                setLoading(true);
                // Here you would fetch user orders from your API
                // const response = await fetch(`/api/orders/${currentUser.id}`);
                // const data = await response.json();
                // setUserOrders(data);
            } catch (error) {
                console.error('Error fetching user orders:', error);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser) {
            fetchUserOrders();
        }
    }, [currentUser]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="dashboard-container">
            <h1>Welcome to Your Dashboard</h1>
            <div className="user-info">
                <h2>Account Information</h2>
                <p>Email: {currentUser?.email}</p>
                {/* Add more user information as needed */}
            </div>
            
            <div className="orders-section">
                <h2>Your Orders</h2>
                {userOrders.length === 0 ? (
                    <p>No orders found</p>
                ) : (
                    <div className="orders-list">
                        {userOrders.map((order) => (
                            <div key={order.id} className="order-item">
                                {/* Add order details here */}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <HasPermission permission="delete_users">
                                            <button className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600">
                                                حذف کاربران
                                            </button>
                                            </HasPermission>
        </div>
    );
};

export default UserDashboard;