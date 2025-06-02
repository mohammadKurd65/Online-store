export const requestPayment = async (amount, callbackUrl) => {
  // در حالت واقعی، اینجا یک درخواست POST به API زرین‌پال می‌زنیم
  // ولی الان فقط یک "Authority" فیک برمی‌گردونیم

return new Promise((resolve) => {
    setTimeout(() => {
    resolve({
        success: true,
        authority: "TEST-AUTH-12345",
        url: `https://sandbox.zarinpal.com/pg/StartPay/TEST-AUTH-12345`, 
    });
    }, 500);
});
};

export const verifyPayment = async (authority, amount) => {
  // در حالت واقعی، اینجا وضعیت پرداخت رو از زرین‌پال چک می‌کنیم
return new Promise((resolve) => {
    setTimeout(() => {
    resolve({
        success: true,
        ref_id: "1234567890",
    });
    }, 1000);
});
};