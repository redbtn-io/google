
#  (WORK IN PROGRESS) Google API Integration Module

This project provides a modular and reusable TypeScript connector for interacting with various Google APIs, including Google Calendar, Google Drive, and Google OAuth. It is built using the official `googleapis` and `google-auth-library` packages.

## Features (WORK IN PROGRESS)

- **Google Calendar API**:
  - Manage calendars and events.
  - Create, retrieve, update, and delete events.

- **Google Drive API**:
  - Manage files, folders, and sheets.

- **Google OAuth**:
  - Authenticate users using OAuth 2.0.
  - Generate OAuth links and manage access tokens.

## Project Structure

The project is organized into the following modules:

```
module/
├── auth/
│   └── oauth.ts          # Handles OAuth authentication
├── calendar/
│   ├── calendars.ts      # Manage Google Calendars
│   └── events.ts         # Manage Google Calendar events
├── drive/
│   ├── files.ts          # Manage Google Drive files
│   ├── folders.ts        # Manage Google Drive folders
│   └── sheets.ts         # Manage Google Sheets
├── index.ts              # Main entry point for exports
└── package.json          # Project dependencies
```

## Installation

To use this library, clone the repository and install the dependencies:

```bash
git clone <repository-url>
cd module
npm install
```

## Usage

### Importing Modules

You can import specific modules from the library:

```ts
import { Calendars, CalendarId } from './calendar/calendars';
import { Events, createEvent } from './calendar/events';
import { getProfile, authorize, getOAuthLink, client } from './auth/oauth';
```

### Example: Authenticate and List Calendars

```ts
import { authorize, getOAuthLink } from './auth/oauth';
import { Calendars } from './calendar/calendars';

async function main() {
  const authUrl = getOAuthLink();
  console.log(`Authorize the app by visiting this URL: ${authUrl}`);

  const authClient = await authorize();
  const calendars = await Calendars.list(authClient);
  console.log('Your calendars:', calendars);
}

main();
```

## Dependencies

- [`google-auth-library`](https://www.npmjs.com/package/google-auth-library): Handles authentication and authorization.
- [`googleapis`](https://www.npmjs.com/package/googleapis): Provides access to Google APIs.

## Development

### Prerequisites

- Node.js (v16 or later)
- TypeScript

### Scripts

- **Build**: Compile TypeScript files.
  ```bash
  npm run build
  ```
- **Test**: Run unit tests (if applicable).
  ```bash
  npm test
  ```

### Folder Structure

- **`auth/`**: Contains OAuth-related functionality.
- **`calendar/`**: Contains modules for interacting with Google Calendar.
- **`drive/`**: Contains modules for interacting with Google Drive.

## License

This project is licensed under the [GNU General Public License v3.0](./LICENSE).

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Acknowledgments

- Built using the official Google APIs Node.js client libraries.
- Inspired by the need for modular Google API integrations.

## Contact

For questions or support, please open an issue in the repository.
