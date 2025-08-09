import { OpeningHourDay } from "@/types/google-business";

export function CheckisOpenNow(openingHours: OpeningHourDay[]): boolean {
    const now = new Date();
    const day = now.toLocaleString('en-us', { weekday: 'long' }).toLowerCase();
    const today = now.toISOString().split('T')[0];

    const openingHour = openingHours.find(h => h.day.toLowerCase() === day);
    if (!openingHour || !openingHour.hours.includes('-')) return false;

    const [openTimeStr, closeTimeStr] = openingHour.hours.split(' - ').map(s => s.trim());

    const openDate = new Date(`${today}T${openTimeStr}`);
    const closeDate = new Date(`${today}T${closeTimeStr}`);

    // Handle overnight hours (close time is technically the next day)
    if (closeDate <= openDate) {
        closeDate.setDate(closeDate.getDate() + 1);
    }

    return now >= openDate && now <= closeDate;
}
