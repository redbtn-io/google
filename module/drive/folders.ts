import { google } from "googleapis";
import { client } from "../auth/oauth";
import { deleteFile, searchFiles } from "./files";

export async function createFolder(name:string, parent?:string) {
    const oAuth2Client = await client();
    const drive = google.drive({ version: 'v3', auth: oAuth2Client });
    const response = await drive.files.create({
        requestBody: {
            name,
            mimeType: 'application/vnd.google-apps.folder',
            parents: parent ? [parent] : undefined
        },
    });
    return response.data;
}

export async function deleteFolder(folderId: string) {
    deleteFile(folderId);
}

export async function searchFolders(query: string) {
    searchFiles(`mimeType='application/vnd.google-apps.folder' and ${query}`);
}