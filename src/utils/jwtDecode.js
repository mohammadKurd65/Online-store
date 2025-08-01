export function decodeToken(token) {
try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "_").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
    atob(base64)
        .split("")
        .map((c) => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
} catch (e) {
    return null;
}
}