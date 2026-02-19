"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOrderNumber = generateOrderNumber;
exports.calculatePagination = calculatePagination;
exports.delay = delay;
exports.parsePhoneNumber = parsePhoneNumber;
exports.deepClone = deepClone;
exports.removeEmptyValues = removeEmptyValues;
exports.toCSV = toCSV;
__exportStar(require("./string"), exports);
__exportStar(require("./number"), exports);
__exportStar(require("./date"), exports);
function generateOrderNumber() {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
    const random = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0");
    return `ORD-${dateStr}-${random}`;
}
function calculatePagination(page, limit, total) {
    return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    };
}
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function parsePhoneNumber(phone) {
    let cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("0")) {
        cleaned = "62" + cleaned.slice(1);
    }
    if (!cleaned.startsWith("62")) {
        cleaned = "62" + cleaned;
    }
    return "+" + cleaned;
}
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
function removeEmptyValues(obj) {
    const result = {};
    Object.keys(obj).forEach((key) => {
        const value = obj[key];
        if (value !== undefined && value !== null) {
            result[key] = value;
        }
    });
    return result;
}
function toCSV(data) {
    if (data.length === 0)
        return "";
    const firstRow = data[0];
    if (!firstRow)
        return "";
    const headers = Object.keys(firstRow);
    const csvRows = [];
    csvRows.push(headers.join(","));
    for (const row of data) {
        const values = headers.map((header) => {
            const val = row[header];
            const escaped = (val !== undefined && val !== null ? "" + val : "").replace(/"/g, '""');
            return `"${escaped}"`;
        });
        csvRows.push(values.join(","));
    }
    return csvRows.join("\n");
}
//# sourceMappingURL=index.js.map