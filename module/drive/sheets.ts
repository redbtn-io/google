import { google } from "googleapis";
import { client } from "../auth/oauth";

/**
 * Lists the user's spreadsheets.
 *
 * @param {string} sheetId - The ID of the spreadsheet.
 * @returns {Promise<any>} - A promise that resolves to the spreadsheet.
 */
export async function Spreadsheet(sheetId: string): Promise<any> {
    const oAuth2Client = await client();
    const sheets = google.sheets({ version: 'v4', auth: oAuth2Client });
    const response = await sheets.spreadsheets.get({
        spreadsheetId: sheetId,
    });
    return response.data;
}


/**
 * Fetches the values from a specified Google Sheets spreadsheet and sheet.
 *
 * @param {string} sheetId - The ID of the Google Sheets spreadsheet.
 * @param {string} sheetName - The name of the sheet within the spreadsheet.
 * @returns {Promise<any>} A promise that resolves to the data from the specified sheet.
 *
 * @throws {Error} If there is an issue with the OAuth2 client or the API request.
 */
export async function Sheet(sheetId: string, sheetName: string): Promise<any> {
    const oAuth2Client = await client();
    const sheets = google.sheets({ version: 'v4', auth: oAuth2Client });
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: sheetName,
    });
    return response.data;
}

/**
 * Fetches the values from multiple sheets within a Google Sheets spreadsheet.
 *
 * @param {string} sheetId - The ID of the Google Sheets spreadsheet.
 * @param {string[]} sheetName - An array of sheet names within the spreadsheet.
 * @returns {Promise<any>} A promise that resolves to the data from the specified sheets.
 *
 * @throws {Error} If there is an issue with the OAuth2 client or the API request.
 */
export async function Sheets(sheetId: string, sheetName: string[]): Promise<any> {
    const oAuth2Client = await client();
    const sheets = google.sheets({ version: 'v4', auth: oAuth2Client });
    const response = await sheets.spreadsheets.values.batchGet({
        spreadsheetId: sheetId,
        ranges: sheetName,
    });
    return response.data;
}

/**
 * Fetches the values from a specified range within a Google Sheets spreadsheet and sheet.
 *
 * @param {string} sheetId - The ID of the Google Sheets spreadsheet.
 * @param {string} sheetName - The name of the sheet within the spreadsheet.
 * @param {string} range - The range of cells to retrieve (e.g., 'A1:B2').
 * @returns {Promise<any>} A promise that resolves to the data from the specified range.
 *
 * @throws {Error} If there is an issue with the OAuth2 client or the API request.
 */
export async function Cells(sheetId: string, sheetName: string, range: string): Promise<any> {
    const oAuth2Client = await client();
    const sheets = google.sheets({ version: 'v4', auth: oAuth2Client });
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: `${sheetName}!${range}`,
    });
    return response.data;
}

/**
 * Updates the values in a specified range within a Google Sheets spreadsheet and sheet.
 *
 * @param {string} sheetId - The ID of the Google Sheets spreadsheet.
 * @param {string} sheetName - The name of the sheet within the spreadsheet.
 * @param {any} data - The data to write to the specified range.
 * @returns {Promise<any>} A promise that resolves to the updated data.
 *
 * @throws {Error} If there is an issue with the OAuth2 client or the API request.
 */
export async function updateSheet(sheetId: string, sheetName: string, data: any): Promise<any> {
    const oAuth2Client = await client();
    const sheets = google.sheets({ version: 'v4', auth: oAuth2Client });
    const response = await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: sheetName,
        valueInputOption: 'RAW',
        requestBody: {
            values: data,
        },
    });
    return response.data;
}

/**
 * Appends the values to the end of a specified sheet within a Google Sheets spreadsheet.
 *
 * @param {string} sheetId - The ID of the Google Sheets spreadsheet.
 * @param {string} sheetName - The name of the sheet within the spreadsheet.
 * @param {any} data - The data to append to the sheet.
 * @returns {Promise<any>} A promise that resolves to the updated data.
 *
 * @throws {Error} If there is an issue with the OAuth2 client or the API request.
 */
export async function appendSheet(sheetId: string, sheetName: string, data: any): Promise<any> {
    const oAuth2Client = await client();
    const sheets = google.sheets({ version: 'v4', auth: oAuth2Client });
    const response = await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: sheetName,
        valueInputOption: 'RAW',
        requestBody: {
            values: data,
        },
    });
    return response.data;
}

/**
 * Clears the values from a specified sheet within a Google Sheets spreadsheet.
 *
 * @param {string} sheetId - The ID of the Google Sheets spreadsheet.
 * @param {string} sheetName - The name of the sheet within the spreadsheet.
 * @returns {Promise<void>} A promise that resolves when the sheet has been cleared.
 *
 * @throws {Error} If there is an issue with the OAuth2 client or the API request.
 */
export async function clearSheet(sheetId: string, sheetName: string): Promise<void> {
    const oAuth2Client = await client();
    const sheets = google.sheets({ version: 'v4', auth: oAuth2Client });
    await sheets.spreadsheets.values.clear({
        spreadsheetId: sheetId,
        range: sheetName,
    });
    return
}
/**
 * Copy and pastes between two ranges within a Google Sheets spreadsheet, with option to cut the original data. Includes all formatting.
 *  @param {string} sheetId - The ID of the Google Sheets spreadsheet.
 * @param {string} sheetName - The name of the sheet within the spreadsheet.
 * @param {number} from - The range to copy.
 * @param {number} to - The range to paste to.
 * @param {boolean} cut - Whether to cut the original data.
 * @returns {Promise<void>} A promise that resolves when the data has been copied and pasted.
 * @throws {Error} If there is an issue with the OAuth2 client or the API request.
 **/
export async function copyAndPaste(sheetId: string, sheetName: string, from: string, to: string, cut: boolean): Promise<void> {
    const oAuth2Client = await client();
    try {
        const sheets = google.sheets({ version: 'v4', auth: oAuth2Client });
        // 1. Read the data to be copied
        const readRange = `${sheetName}!${from}`;
        const readResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: readRange,
        });
        const readData = readResponse.data.values;
        
        // 2. Read the formatting of the data to be copied
        const readFormatResponse = await sheets.spreadsheets.get({
            spreadsheetId: sheetId,
            ranges: [readRange],
            includeGridData: true,
        });
        const readFormat = readFormatResponse.data.sheets?.[0].data?.[0].rowData;

        // 3. Write the formatting to the new location
        const requests = [
            {
                updateCells: {
                    range: {
                        sheetId: readFormatResponse.data.sheets?.[0].properties?.sheetId,
                        startRowIndex: Number(to.split(':')[0].split('!')[1]) - 1,
                        endRowIndex: Number(to.split(':')[1].split('!')[1]),
                        startColumnIndex: to.split(':')[0].split('!')[1].charCodeAt(0) - 65,
                        endColumnIndex: to.split(':')[1].split('!')[1].charCodeAt(0) - 64,
                    },
                    rows: readFormat,
                    fields: '*',
                },
            },
        ]

        await sheets.spreadsheets.batchUpdate({
            spreadsheetId: sheetId,
            requestBody: { requests },
        });

        // 4. Write the data to the new location
        const writeRange = `${sheetName}!${to}`;
        await sheets.spreadsheets.values.update({
            spreadsheetId: sheetId,
            range: writeRange,
            valueInputOption: 'RAW',
            requestBody: { values: readData },
        });

        // 5. Clear the original data if cut is true
        if (cut) {
            await sheets.spreadsheets.values.clear({
                spreadsheetId: sheetId,
                range: readRange,
            });
        }

    } catch(err) {
        if (err instanceof Error) {
            console.error('Error copying and pasting:', err.message);
        } else {
            console.error('Error copying and pasting:', err);
        }
    }
}

/**
 * Copy and pastes only formatting and merges between two ranges within a Google Sheets spreadsheet.
 * @param {string} sheetId - The ID of the Google Sheets spreadsheet.
 * @param {string} from - The range to copy.
 * @param {string} to - The range to paste to.
 * @returns {Promise<void>} A promise that resolves when the formatting has been copied and pasted.
 * @throws {Error} If there is an issue with the OAuth2 client or the API request.
 */
export async function copyFormatting(token: any, options: any): Promise<void> {
    const { id, from, to } = options
    const oAuth2Client = await client(token);
    try {
        const sheets = google.sheets({ version: 'v4', auth: oAuth2Client });
        // 1. Read the formatting to be copied
        const readResponse = await sheets.spreadsheets.get({
            spreadsheetId: id,
            ranges: [from],
            includeGridData: true,
        });
        const readFormat = readResponse.data.sheets?.[0].data?.[0].rowData;

        const [startCell, endCell] = to.split(':');
        const startRowIndex = Number(startCell.match(/\d+/)?.[0]) - 1;
        const endRowIndex = Number(endCell.match(/\d+/)?.[0]);
        const startColumnString = startCell.match(/[A-Z]+/)?.[0];
        const startColumnIndex = startColumnString ? startColumnString.charCodeAt(0) - 65 : undefined;
        const endColumnString = endCell.match(/[A-Z]+/)?.[0];
        const endColumnIndex = endColumnString ? endColumnString.charCodeAt(0) - 64 : undefined;


        // 2. Write the formatting to the new location
        const requests: Array<{ updateCells?: any; mergeCells?: any }> = [
            {
            updateCells: {
                range: {
                sheetId: readResponse.data.sheets?.[0].properties?.sheetId,
                startRowIndex: startRowIndex,
                endRowIndex: endRowIndex,
                startColumnIndex: startColumnIndex,
                endColumnIndex: endColumnIndex,
                },
                rows: readFormat?.map(row => ({
                    values: row.values?.map(cell => ({
                        userEnteredFormat: cell.userEnteredFormat,
                        effectiveFormat: cell.effectiveFormat,
                        userEnteredValue: { stringValue: '' }, // Clear the value to only copy formatting
                    })),
                })),
                fields: 'userEnteredFormat,effectiveFormat',
            },
            },
        ];

        
        await sheets.spreadsheets.batchUpdate({
            spreadsheetId: id,
            requestBody: { requests },
        });

        //! Target row is issue
        //3. Copy merges from the original range
        const merges = readResponse.data.sheets?.[0].merges;
        if (merges) {
            const mergeRequests = merges.map(merge => {
                return {
                    mergeCells: {
                        range: {
                            sheetId: readResponse.data.sheets?.[0].properties?.sheetId ?? 0,
                            startRowIndex: startRowIndex,
                            endRowIndex: endRowIndex,
                            startColumnIndex: merge.startColumnIndex ?? startColumnIndex,
                            endColumnIndex: merge.endColumnIndex ?? endColumnIndex,
                        },
                        mergeType: 'MERGE_ALL',
                    },
                };
            });
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId: id,
                requestBody: { requests: mergeRequests },
            });
        }


    } catch(err) {
        if (err instanceof Error) {
            console.error('Error copying formatting:', err.message);
        } else {
            console.error('Error copying formatting:', err);
        }
    }
}



/**
 * Finds a value in a Google Sheets spreadsheet and returns the row that contains it.
 *
 * @param {string} sheetId - The ID of the Google Sheets spreadsheet.
 * @param {string} sheetName - The name of the sheet within the spreadsheet.
 * @param {string} value - The value to search for.
 * @returns {Promise<any>} A promise that resolves to the row that contains the value.
 *
 * @throws {Error} If there is an issue with the OAuth2 client or the API request.
 */
export async function findInSheet(token: any, options: any): Promise<any> {
    const { id, name, value } = options
    const oAuth2Client = await client(token);
    const sheets = google.sheets({ version: 'v4', auth: oAuth2Client });
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: id,
        range: name,
    });
    const data = response.data.values;
    if (!data) {
        console.log('No data found.');
        return;
    }
    const indexes: any[] = []
    const rows = data.filter((row,i) => {
        const occurs = row.includes(value)
        if (occurs) indexes.push(i)
        return occurs
    })
    return rows.map((row, i) => {
        return { row: indexes[i]+1, data: row }
    });
}



/**
 * Cuts and pastes a row from one location to another within a Google Sheets spreadsheet.
 *
 * @param {string} sheetId - The ID of the Google Sheets spreadsheet.
 * @param {string} sheetName - The name of the sheet within the spreadsheet.
 * @param {number} fromRow - The row number to cut.
 * @param {number} toRow - The row number to paste to.
 * @returns {Promise<void>} A promise that resolves when the row has been moved.
 *
 * @throws {Error} If there is an issue with the OAuth2 client or the API request.
 */
export async function cutAndPasteRow(sheetId: string, sheetName: string, fromRow: number, toRow: number): Promise<void> {
    const oAuth2Client = await client();
    try {
        const sheets = google.sheets({ version: 'v4', auth: oAuth2Client });
        // 1. Read the row to be moved
        const readRange = `${sheetName}!${fromRow}:${fromRow}`;
        const readResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: readRange,
        });

        const rowData = readResponse.data.values;
        if (!rowData || rowData.length === 0) {
            console.log(`No data found in row ${fromRow}.`);
            return;
        }

        // 2. Read the row formatting
        const readFormatResponse = await sheets.spreadsheets.get({
            spreadsheetId: sheetId,
            ranges: [readRange],
            includeGridData: true,
        });

        const rowFormat = readFormatResponse.data.sheets?.[0].data?.[0].rowData?.[0];
        if (!rowFormat) {
            console.log(`No formatting found for row ${fromRow}.`);
            return;
        }

        // 3. Write the row data to the new location
        const writeRange = `${sheetName}!${toRow}:${toRow}`;
        await sheets.spreadsheets.values.update({
            spreadsheetId: sheetId,
            range: writeRange,
            valueInputOption: 'RAW',
            requestBody: { values: rowData },
        });
        console.log(`Row data moved to row ${toRow}.`);

        // 4. Write the row formatting to the new location
        const requests = [
            {
                updateCells: {
                    range: {
                        sheetId: readFormatResponse.data.sheets?.[0].properties?.sheetId,
                        startRowIndex: toRow - 1,
                        endRowIndex: toRow,
                    },
                    rows: [rowFormat],
                    fields: '*',
                },
            },
        ];

        await sheets.spreadsheets.batchUpdate({
            spreadsheetId: sheetId,
            requestBody: { requests },
        });
        console.log(`Row formatting moved to row ${toRow}.`);

        // 5. Clear the original row
        await sheets.spreadsheets.values.clear({
            spreadsheetId: sheetId,
            range: readRange,
        });

        return
    } catch (err) {
        if (err instanceof Error) {
            console.error('Error cutting and pasting row:', err.message);
        } else {
            console.error('Error cutting and pasting row:', err);
        }
    }
}

/** 
* Inserts a row above a specified location within a Google Sheets spreadsheet and sheet.
* 
* @param {string} sheetId - The ID of the Google Sheets spreadsheet.
* @param {string} sheetName - The name of the sheet within the spreadsheet.
* @param {number} row - The row number to insert the new row before.
* @param {any} data - The data to insert into the new row.
* @returns {Promise<void>} A promise that resolves when the row has been inserted.
* 
* @throws {Error} If there is an issue with the OAuth2 client or the API request.
*/
export async function insertRow(token: any, options: any): Promise<void> {
    const { id, name, row, data } = options
    const oAuth2Client = await client(token);
    try {
        const sheets = google.sheets({ version: 'v4', auth: oAuth2Client });
        const requests = [
            {
                insertDimension: {
                    range: {
                        sheetId: (await sheets.spreadsheets.get({ spreadsheetId: id })).data.sheets?.find(sheet => sheet.properties?.title === name)?.properties?.sheetId,
                        dimension: 'ROWS',
                        startIndex: row - 1,
                        endIndex: row,
                    },
                    inheritFromBefore: false,
                },
            },
            {
                updateCells: {
                    range: {
                        sheetId: (await sheets.spreadsheets.get({ spreadsheetId: id })).data.sheets?.find(sheet => sheet.properties?.title === name)?.properties?.sheetId,
                        startRowIndex: row - 1,
                        endRowIndex: row,
                    },
                    rows: [{ values: data.map((cell: any) => ({ userEnteredValue: { stringValue: cell } })) }],
                    fields: '*',
                },
            },
        ];

        await sheets.spreadsheets.batchUpdate({
            spreadsheetId: id,
            requestBody: { requests },
        });
        
        return;
    } catch (err) {
        if (err instanceof Error) {
            console.error('Error inserting row:', err.message);
        } else {
            console.error('Error inserting row:', err);
        }
    }
}
