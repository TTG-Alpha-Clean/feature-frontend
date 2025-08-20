export function formatDatePtBr(isoLike: string | number | Date) {
    const d = new Date(isoLike);
    return d.toLocaleDateString("pt-BR", { timeZone: "UTC" });
}
export function formatHour(isoLike: string | number | Date) {
    const d = new Date(isoLike);
    return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" });
}
