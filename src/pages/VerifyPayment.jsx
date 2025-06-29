import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyPayment } from "../services/payment";

export default function VerifyPayment() {
const location = useLocation();
const navigate = useNavigate();

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