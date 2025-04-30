import { google } from "googleapis";
import { client } from "../auth/oauth";
import { CalendarId, Calendars } from "./calendars";


/**
 * Lists the user's upcoming events.
 *
 * @param {string[]} [calendars] - Optional array of calendar summaries to filter the results.
 * @param {string[]} [range] - Optional array of start and end dates to filter the results.
 * @returns {Promise<any[]>} - A promise that resolves to an array of upcoming events.
 */
export async function Events(token: any, calendars? : any[], range?: string[], max?: number): Promise<any[]> {
    const oAuth2Client = await client(token);
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
    const twoMonthsFromToday = new Date(new Date().setMonth(new Date().getMonth() + 2));
    twoMonthsFromToday.setHours(18, 0, 0, 0);


    const time = {
        timeMin: range && range.length > 0 ? new Date(range[0]).toISOString() : (new Date()).toISOString(),
        timeMax: max || (range && range.length === 1) ? null : range && range.length > 1 ? new Date(range[1]).toISOString() : twoMonthsFromToday.toISOString(),
    }

    const events: any[] = [];

    calendars = calendars || await Calendars(token);

    if (!calendars) return [];

    for await (const cal of calendars) {
        const options = {
            calendarId: cal.id,
            timeMin: time.timeMin,
            timeMax: time.timeMax || undefined,
            maxResults: max || time.timeMax ? undefined : 50,
            singleEvents: true,
            orderBy: 'startTime',
        }
        const response = await calendar.events.list(options);

        const items = response.data.items?.map(event => ({
            ...event,
            calendar: cal.summary
        })) || [];

        events.push(...items);
    }

    const upcoming: any[] = []

    events.forEach((event) => {
        upcoming.push({
            calendar: event.calendar,
            event: event.summary,
            start: new Date(event.start?.dateTime || event.start?.date || '').toLocaleString(),
            end: new Date(event.end?.dateTime || event.end?.date || '').toLocaleString(),
            attendees: event.attendees,
            phone: event.extendedProperties?.private?.phone,
        });
    });

    upcoming.sort((a, b) => {
        return new Date(a.start || 0).getTime() - new Date(b.start || 0).getTime();
    })

    return upcoming;
}

export async function Event(token: any, calendarName: string, eventId: string) {
    const oAuth2Client = await client(token);
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
    const calendarId = await CalendarId(token, calendarName);

    if (!calendarId) {
        console.error(`Calendar "${calendarName}" not found.`);
        return;
    }

    const response = await calendar.events.get({
        calendarId,
        eventId,
    });

    return response.data;
}

export async function createEvent(token: any, calendarName: string, event: any) {
    const oAuth2Client = await client(token);
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
    const calendarId = await CalendarId(token, calendarName);
    
    if (!calendarId) {
        console.error(`Calendar "${calendarName}" not found.`);
        return;
    }

    const response = await calendar.events.insert({
        calendarId,
        requestBody: event,
    });
    if (response.data) {
        return response.data;
    } else {
        return response;
    }
}

export async function deleteEvent(token: any, calendarName: string, eventId: string) {
    const oAuth2Client = await client(token);
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
    const calendarId = await CalendarId(token, calendarName);

    if (!calendarId) {
        console.error(`Calendar "${calendarName}" not found.`);
        return;
    }

    const response = await calendar.events.delete({
        calendarId,
        eventId,
    });

    return response;
}

export async function updateEvent(token: any, calendarName: string, eventId: string, event: any) {
    const oAuth2Client = await client(token);
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
    const calendarId = await CalendarId(token, calendarName);

    if (!calendarId) {
        console.error(`Calendar "${calendarName}" not found.`);
        return;
    }

    const response = await calendar.events.update({
        calendarId,
        eventId,
        requestBody: event,
    });

    if (response.data) {
        return response.data;
    } else {
        return response;
    }
}