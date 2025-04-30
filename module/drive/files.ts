import { google } from "googleapis";
import { client } from "../auth/oauth";

export async function getFile(fileId: string) {
    const oAuth2Client = await client();
    const drive = google.drive({ version: 'v3', auth: oAuth2Client });
    const response = await drive.files.get({
        fileId,
        fields: '*',
    });
    return response.data;
}

export async function createFile(file: any, content: any, parent?: string) {
    const oAuth2Client = await client();
    const drive = google.drive({ version: 'v3', auth: oAuth2Client });
    const response = await drive.files.create({
        requestBody: {
            ...file,
            parents: parent ? [parent] : undefined,
        },
        media: {
            mimeType: file.mimeType,
            body: content,
        },
    });
    return response.data;
}

export async function deleteFile(fileId: string) {
    const oAuth2Client = await client();
    const drive = google.drive({ version: 'v3', auth: oAuth2Client });
    await drive.files.delete({
        fileId,
    });
}

export async function updateFile(fileId: string, file: any) {
    const oAuth2Client = await client();
    const drive = google.drive({ version: 'v3', auth: oAuth2Client });
    const response = await drive.files.update({
        fileId,
        requestBody: file,
    });
    return response.data;
}

export async function searchFiles(query: string) {
    const oAuth2Client = await client();
    const drive = google.drive({ version: 'v3', auth: oAuth2Client });
    const response = await drive.files.list({
        q: query,
        fields: '*',
    });
    return response.data.files;
}

export async function readFile(fileId: string) {
    const oAuth2Client = await client();
    const drive = google.drive({ version: 'v3', auth: oAuth2Client });
    const response = await drive.files.get({
        fileId,
        fields: 'name, mimeType',
    });
    const file = response.data;

    switch (file.mimeType) {
        case 'text/plain': {
            const response = await drive.files.get({
                fileId,
                alt: 'media',
            });
            return response.data;
        }
        case 'application/vnd.google-apps.document':{
            const response = await drive.files.export({
                fileId,
                mimeType: 'text/plain',
            });
            return response.data;
        }
        case 'application/vnd.google-apps.spreadsheet':{
            const response = await drive.files.export({
                fileId,
                mimeType: 'text/csv',
            });
            return response.data;
        }
        case 'application/vnd.google-apps.presentation':{
            const response = await drive.files.export({
                fileId,
                mimeType: 'application/pdf',
            });
            return response.data;
        }
        case 'application/vnd.google-apps.script':{
            const response = await drive.files.export({
                fileId,
                mimeType: 'application/vnd.google-apps.script+json',
            });
            return response.data;
        }
        case 'application/vnd.google-apps.folder': {
            return null;
        }
        default: {
            try {
                const response = await drive.files.get({
                    fileId,
                    alt: 'media',
                });
                return response.data;
            } catch (e) {
                console.log(fileId, file.mimeType, file.name);
                return e;
            }
        }
    }
}
