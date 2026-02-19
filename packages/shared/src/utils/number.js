"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCurrency = formatCurrency;
exports.formatNumber = formatNumber;
exports.calculatePercentage = calculatePercentage;
exports.calculateDiscount = calculateDiscount;
exports.calculateFinalPrice = calculateFinalPrice;
exports.roundNumber = roundNumber;
exports.clamp = clamp;
exports.isInRange = isInRange;
exports.randomNumber = randomNumber;
exports.calculateTax = calculateTax;
exports.calculateTotalWithTax = calculateTotalWithTax;
function formatCurrency(amount, includeSymbol = true) {
    const formatted = new Intl.NumberFormat("id-ID", {
        style: "decimal",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
    return includeSymbol ? `Rp ${formatted}` : formatted;
}
function formatNumber(num) {
    return new Intl.NumberFormat("id-ID").format(num);
}
function calculatePercentage(value, total, decimals = 2) {
    if (total === 0)
        return 0;
    return Number(((value / total) * 100).toFixed(decimals));
}
function calculateDiscount(price, discountPercentage) {
    return Math.round(price * (discountPercentage / 100));
}
function calculateFinalPrice(price, discountPercentage) {
    const discount = calculateDiscount(price, discountPercentage);
    return price - discount;
}
function roundNumber(num, decimals = 2) {
    return Number(num.toFixed(decimals));
}
function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}
function isInRange(num, min, max) {
    return num >= min && num <= max;
}
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function calculateTax(amount, taxRate) {
    return Math.round(amount * (taxRate / 100));
}
function calculateTotalWithTax(amount, taxRate) {
    const tax = calculateTax(amount, taxRate);
    return amount + tax;
}
//# sourceMappingURL=number.js.map