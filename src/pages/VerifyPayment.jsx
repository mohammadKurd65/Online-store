import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyPayment } from "../services/payment";
import { decodeToken } from "../utils/jwtDecode";
import { usePermission } from "../hooks/usePermission";
export default function VerifyPayment() {
    const { canDeleteUsers } = usePermission();

if (canDeleteUsers) {
  // نمایش دکمه حذف
}
    const token = localStorage.getItem("userToken");
const decoded = decodeToken(token);
const userRole = decoded?.role;
const location = useLocation();
const navigate = useNavigate();


useEffect(() => {
if (userRole !== "admin") {
    navigate("/unauthorized");
}
}, [userRole, navigate]);

useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const authority = queryParams.get("Authority");
    const status = queryParams.get("Status");

    const verify = async () => {
    if (status === "OK") {
        const result = await verifyPayment(authority, 250000); // مبلغ رو بعداً داینامیک کن
        if (result.success) {
        alert(`پرداخت موفقیت‌آمیز بود. کد پیگیری: ${result.ref_id}`);
        navigate("/");
        } else {
        alert("خطا در تأیید پرداخت.");
        navigate("/cart");
        }
    } else {
        alert("پرداخت لغو شد یا با خطا مواجه شد.");
        navigate("/cart");
    }
    };

    verify();
}, [location, navigate]);

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-4 text-2xl font-bold">در حال تأیید پرداخت...</h2>
    <p>لطفاً منتظر بمانید.</p>
    </div>
);
}