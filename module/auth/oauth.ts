import fs from 'fs';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';

const { client_secret, client_id, redirect_uri } = process?.env;
const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uri);

oAuth2Client.on('tokens', async (tokens) => {
    if (tokens.refresh_token) {
        await saveRefreshToken(tokens);
    }
    await saveCredentials(tokens);
})

/**
 *   
 *  [   'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/documents',
        'https://www.googleapis.com/auth/gmail.readonly'
    ]
 */



/**
 * Retrieves the OAuth2 client with the credentials set from the token file.
 *
 * @returns {Promise<OAuth2Client>} The OAuth2 client with the credentials set.
 * @throws {Error} If the token file does not exist or cannot be read.
 */
export async function client(tokens? : any): Promise<OAuth2Client> {
    const token = tokens || await Token();
    const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uri);oAuth2Client.on('tokens', async (tokens) => {
        if (tokens.refresh_token) {
            await saveRefreshToken(tokens);
        }
        await saveCredentials(tokens);
    })
    oAuth2Client.setCredentials(token);
    return oAuth2Client;
}

/**
 * Generates an OAuth link for Google authentication.
 * 
 * This function checks if a token file (`token.json`) exists. If it does, it sets the credentials
 * for the OAuth2 client using the token. If the token file does not exist, it generates an 
 * authentication URL for the user to consent to the required scopes.
 * 
 * @returns {Promise<string | void>} A promise that resolves to the OAuth authentication URL if the token does not exist, otherwise resolves to `void`.
 */
export async function getOAuthLink(scope?: string[]): Promise<string | void> {
    return oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scope || [
            'https://www.googleapis.com/auth/spreadsheets.readonly',
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/drive',
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ],
        include_granted_scopes: true,
        prompt: 'consent', 
    });
}

/**
 * Authorizes a user using the provided authorization code.
 *
 * @param {string} code - The authorization code received from the OAuth2 provider.
 * @returns {Promise<object>} A promise that resolves to the tokens object if authorization is successful, or an error object if it fails.
 * @throws {Error} If there is an issue with the authorization process.
 */
export async function authorize(code: string): Promise<object> {
    try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);
        saveCredentials(tokens);
        return tokens;
    } catch (e) {
        return e as object;
    }
}

/**
 * Retrieves the user's profile information using OAuth2.
 *
 * @returns {Promise<any>} A promise that resolves to the user's profile data.
 * @throws {Error} If no token is found.
 */
export async function getProfile(tokens?: any): Promise<any> {
    const token = tokens || await Token();
    
    oAuth2Client.setCredentials(token);
    const oauth2 = google.oauth2({ version: 'v2', auth: oAuth2Client });
    const response = await oauth2.userinfo.get();
    return response.data;
}

/**
 * Retrieves the OAuth token from the token file.
 *
 * @returns {Promise<any>} A promise that resolves to the OAuth token.
 * @throws {Error} If no token is found.
 */
export async function Token(user?: string): Promise<any> {

    const token = user ? fs.existsSync(`db/${user}`) ? fs.readFileSync(`db/${user}`).toString() : null : fs.existsSync('token.json') ? fs.readFileSync('token.json').toString() : null;
    if (token && JSON.parse(token).expiry_date < new Date().getTime() + (60000*10)) { 
        await refreshToken();
        return await Token();
    }
    return token
}

/**
 * Refreshes the OAuth token using the refresh token.
 */
async function refreshToken() {
    const refresh = await getRefreshToken();
    if (refresh) {
        oAuth2Client.setCredentials({ refresh_token: refresh });
        const tokens = await oAuth2Client.refreshAccessToken();
        await saveCredentials(tokens.credentials);
    }
}

/**
 * Saves OAuth tokens to a file named 'token.json'.
 *
 * @param {any} tokens - The OAuth tokens to be saved.
 * @returns {Promise<void>} A promise that resolves when the tokens have been successfully saved.
 */
async function saveCredentials(tokens: any): Promise<void> {
    fs.writeFileSync('token.json', JSON.stringify(tokens));
}

/**
 * Saves the refresh token to a file named 'refresh.json'.
 *
 * @param {any} tokens - The OAuth tokens containing the refresh token.
 * @returns {Promise<void>} A promise that resolves when the refresh token has been successfully saved.
 */
async function saveRefreshToken(tokens: any): Promise<void> {
    fs.writeFileSync('refresh.json', JSON.stringify(tokens.refresh_token));
}

/**
 * Retrieves the refresh token from the 'refresh.json' file.
 *
 * @returns {Promise<any>} A promise that resolves to the refresh token.
 */
async function getRefreshToken(): Promise<any> {
    const refresh = fs.existsSync('refresh.json') ? fs.readFileSync('refresh.json', 'utf8') : null;
    if (refresh) return JSON.parse(refresh.toString());
    return null;
}

export async function logout() {
    fs.unlinkSync('token.json');
    fs.unlinkSync('refresh.json');
}