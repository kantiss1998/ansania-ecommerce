"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = formatDate;
exports.formatDateShort = formatDateShort;
exports.formatDateISO = formatDateISO;
exports.formatTime = formatTime;
exports.getRelativeTime = getRelativeTime;
exports.addDays = addDays;
exports.addMonths = addMonths;
exports.isInPast = isInPast;
exports.isInFuture = isInFuture;
exports.isToday = isToday;
exports.startOfDay = startOfDay;
exports.endOfDay = endOfDay;
exports.getDaysDifference = getDaysDifference;
function formatDate(date, includeTime = false) {
    const d = typeof date === "string" ? new Date(date) : date;
    const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        ...(includeTime && {
            hour: "2-digit",
            minute: "2-digit",
        }),
    };
    return new Intl.DateTimeFormat("id-ID", options).format(d);
}
function formatDateShort(date) {
    const d = typeof date === "string" ? new Date(date) : date;
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}
function formatDateISO(date) {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toISOString().split("T")[0] ?? "";
}
function formatTime(date) {
    const d = typeof date === "string" ? new Date(date) : date;
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
}
function getRelativeTime(date) {
    const d = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diffInSeconds < 60) {
        return "Baru saja";
    }
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} menit yang lalu`;
    }
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} jam yang lalu`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays} hari yang lalu`;
    }
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
        return `${diffInWeeks} minggu yang lalu`;
    }
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        return `${diffInMonths} bulan yang lalu`;
    }
    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} tahun yang lalu`;
}
function addDays(date, days) {
    const d = typeof date === "string" ? new Date(date) : new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}
function addMonths(date, months) {
    const d = typeof date === "string" ? new Date(date) : new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
}
function isInPast(date) {
    const d = typeof date === "string" ? new Date(date) : date;
    return d < new Date();
}
function isInFuture(date) {
    const d = typeof date === "string" ? new Date(date) : date;
    return d > new Date();
}
function isToday(date) {
    const d = typeof date === "string" ? new Date(date) : date;
    const today = new Date();
    return (d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear());
}
function startOfDay(date) {
    const d = typeof date === "string" ? new Date(date) : new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}
function endOfDay(date) {
    const d = typeof date === "string" ? new Date(date) : new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
}
function getDaysDifference(date1, date2) {
    const d1 = typeof date1 === "string" ? new Date(date1) : date1;
    const d2 = typeof date2 === "string" ? new Date(date2) : date2;
    const diffInMs = Math.abs(d2.getTime() - d1.getTime());
    return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
}
//# sourceMappingURL=date.js.map