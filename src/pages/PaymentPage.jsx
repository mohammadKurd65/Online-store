import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { requestPayment } from "../services/payment";

export default function PaymentPage() {
const navigate = useNavigate();
  const totalAmount = 250000; // مبلغ به تومان

useEffect(() => {
    const pay = async () => {
    try {
        const result = await requestPayment(totalAmount, "http://localhost:3000/verify-payment");
        window.location.href = result.url;
    } catch (error) {
        alert("خطا در اتصال به درگاه پرداخت.");
    }
    };

    pay();
}, [navigate]);

return (
    <div className="container py-10 mx-auto">
    <h2 className="mb-4 text-2xl font-bold">در حال هدایت به درگاه پرداخت...</h2>
    <p>لطفاً منتظر بمانید.</p>
    </div>
);
}