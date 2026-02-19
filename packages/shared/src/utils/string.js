"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugify = slugify;
exports.capitalize = capitalize;
exports.titleCase = titleCase;
exports.truncate = truncate;
exports.stripHtml = stripHtml;
exports.randomString = randomString;
exports.isValidEmail = isValidEmail;
exports.isValidPhone = isValidPhone;
exports.formatPhone = formatPhone;
function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");
}
function capitalize(text) {
    if (!text)
        return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}
function titleCase(text) {
    if (!text)
        return "";
    return text
        .toLowerCase()
        .split(" ")
        .map((word) => capitalize(word))
        .join(" ");
}
function truncate(text, maxLength, suffix = "...") {
    if (!text || text.length <= maxLength)
        return text;
    return text.substring(0, maxLength - suffix.length) + suffix;
}
function stripHtml(html) {
    return html.replace(/<[^>]*>/g, "");
}
function randomString(length) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function isValidPhone(phone) {
    const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
    return phoneRegex.test(phone.replace(/[\s-]/g, ""));
}
function formatPhone(phone) {
    const cleaned = phone.replace(/[\s-]/g, "");
    if (cleaned.startsWith("+62")) {
        return cleaned;
    }
    else if (cleaned.startsWith("62")) {
        return `+${cleaned}`;
    }
    else if (cleaned.startsWith("0")) {
        return `+62${cleaned.substring(1)}`;
    }
    return cleaned;
}
//# sourceMappingURL=string.js.map