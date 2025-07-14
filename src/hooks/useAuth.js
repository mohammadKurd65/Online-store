
import axios from "axios";
import { decodeToken } from "../utils/jwtDecode";
import { useEffect, useState } from "react";

export function useAuth() {
const token = localStorage.getItem("userToken");
const decoded = decodeToken(token);
const role = decoded?.role || "user";
const [permissions, setPermissions] = useState([]);

useEffect(() => {
    const fetchPermissions = async () => {
    try {
        const res = await axios.get("http://localhost:5000/api/admin/permissions/me", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });

        setPermissions(res.data.data.permissions || []);
    } catch (err) {
        console.error(err);
}
    };

    if (role !== "user") {
    fetchPermissions();
    } else {
    setPermissions(["view_dashboard", "edit_profile"]);
    }
}, [role, token]);

const hasPermission = (requiredPermission) => {
    return permissions.includes(requiredPermission);
};

return { role, permissions, hasPermission };
}