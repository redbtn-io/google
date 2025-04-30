import { google } from "googleapis";
import { client } from "../auth/oauth";

/**
 * Lists the user's calendars.
 *
 * @param {string[]} [calendars] - Optional array of calendar summaries to filter the results.
 * @returns {Promise<any[]>} - A promise that resolves to an array of calendars.
 */
export async function Calendars(token: any, calendars?: string[]): Promise<any[]> {
    const oAuth2Client = await client(token);
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
    const response = await calendar.calendarList.list();
    if (!response.data.items) {
        return [];
    }
    if (calendars) {
        return response.data.items.filter(
            (calendar) => calendar.summary && calendars.includes(calendar.summary)
        );
    }
    return response.data.items;
}

export async function Calendar(token: any, calendarName: string) {
    const calendars = await Calendars(token);
    return calendars?.find((calendar) => calendar.summary === calendarName);
}

export async function CalendarId(token: any, calendarName: string) {
    const calendars = await Calendars(token);
    const calendar = calendars?.find((calendar) => calendar.summary === calendarName);
    if (calendar) {
        return calendar.id;
    }
}

export async function CalendarById(token: any, calendarId: string) {
    const calendars = await Calendars(token);
    return calendars?.find((calendar) => calendar.id === calendarId);
}

export async function createCalendar(calendarName: string) {
    const oAuth2Client = await client();
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
    const response = await calendar.calendars.insert({
        requestBody: {
            summary: calendarName,
        },
    });
    return response.data;
}

export async function deleteCalendar(token: any, calendarName: string) {
    const calendarId = await CalendarId(token, calendarName);
    if (calendarId) {
        const oAuth2Client = await client();
        const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
        await calendar.calendars.delete({
            calendarId,
        });
    }
}

export async function updateCalendar(token: any, calendarName: string, newCalendarName: string) {
    const calendarId = await CalendarId(token, calendarName);
    if (calendarId) {
        const oAuth2Client = await client();
        const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
        const response = await calendar.calendars.update({
            calendarId,
            requestBody: {
                summary: newCalendarName,
            },
        });
        return response.data;
    }
}

export async function clearCalendar(token: any, calendarName: string) {
    const calendarId = await CalendarId(token, calendarName);
    if (calendarId) {
        const oAuth2Client = await client();
        const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
        await calendar.calendars.clear({
            calendarId,
        });
    }
}