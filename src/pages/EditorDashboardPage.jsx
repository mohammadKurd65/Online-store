import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import HasPermission from "../components/HasPermission";
import { usePermission } from '../hooks/usePermission';
const EditorDashboardPage = () => {
    const { canDeleteUsers } = usePermission();

if (canDeleteUsers) {
  // نمایش دکمه حذف
}
    const [loading, setLoading] = useState(true);
    const user = useSelector(state => state.user);

    useEffect(() => {
        // Check if user is authenticated and has editor role
        if (!user || user.role !== 'editor') {
            // Redirect to login or home page if not authorized
            window.location.href = '/';
        } else {
            setLoading(false);
        }
    }, [user]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="editor-dashboard">
            <h1>Editor Dashboard</h1>
            <div className="dashboard-content">
                {/* Add your editor dashboard content here */}
                <div className="dashboard-stats">
                    <h2>Statistics</h2>
                    {/* Add statistics components */}
                </div>
                
                <div className="dashboard-actions">
                    <h2>Quick Actions</h2>
                    {/* Add action buttons or cards */}
                </div>

                <HasPermission permission="delete_users">
                                <button className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600">
                                    حذف کاربران
                                </button>
                                </HasPermission>
            </div>
        </div>
    );
};

export default EditorDashboardPage;