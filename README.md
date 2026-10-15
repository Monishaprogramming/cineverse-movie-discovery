CineVerse — Movie Discovery App
A React Native movie discovery application built with Expo and the TMDB (The Movie Database) API. CineVerse helps users explore movies, search for titles, view movie information, and discover related content using live movie data.
1. Features
• Discover popular, trending, upcoming, now-playing, and top-rated movies.
• Search for movies by title.
• View detailed movie information.
• Retrieve movie cast and crew information.
• Access movie trailers and videos.
• Explore similar and recommended movies.
• View movie reviews, posters, and backdrops.
• Retrieve movie genres and discover movies using filters.
• View streaming provider information when available.
• Explore actor and filmmaker profiles and their movie credits.
• Handle API errors, missing API tokens, request timeouts, and rate limits.
• Load movie images using TMDB image URLs.
Note: The availability of each feature in the interface depends on whether the corresponding API function is connected to a screen or component.
2. Technologies Used
• React Native — mobile application framework.
• Expo — development and testing environment.
• JavaScript — application logic.
• Axios — HTTP requests to the TMDB API.
• TMDB API v3 — movie, cast, search, and related data.
• Expo environment variables — configuration of the TMDB access token.
• Git and GitHub — source control and project hosting.
3. Prerequisites
Install the following before running the project:
• Node.js, using a version compatible with the project's Expo SDK.
• npm, included with Node.js.
• Visual Studio Code or another code editor.
• An Android emulator through Android Studio, or a compatible physical Android device with Expo Go.
• A TMDB account and API Read Access Token.
4. Installation and Setup
Step 1: Download the repository
Replace the placeholder URL with your actual public GitHub repository URL.
git clone YOUR_GITHUB_REPOSITORY_URL
cd cineverse-movie-discovery
Alternatively, download the repository as a ZIP file from GitHub and extract it. Open the extracted project root in VS Code.
Step 2: Install dependencies
Open a terminal in the project root—the folder containing package.json—and run:
npm install
Wait for the installation to finish.
Step 3: Obtain a TMDB API Read Access Token
1. Create an account at https://www.themoviedb.org/.
2. Open the TMDB developer settings: https://www.themoviedb.org/settings/api.
3. Apply for API access if required.
4. Open your API settings after access has been approved.
5. Locate the API Read Access Token (v4 auth) field.
6. Copy the token for your local environment configuration.
Keep your token private. Do not publish it in source code, screenshots, the README, or your GitHub repository.
Step 4: Create the .env file
Create a file named .env in the project root, alongside package.json.
Example project structure:
cineverse-movie-discovery/
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
├── app.json
└── src/
    └── api/
        └── tmdb.js
Your project may contain additional files and folders.
Add the following line to .env:
EXPO_PUBLIC_TMDB_ACCESS_TOKEN=YOUR_TMDB_READ_ACCESS_TOKEN
Replace the placeholder with your actual token. The example above is not a working token.
Security note: Variables prefixed with EXPO_PUBLIC_ can be included in the application bundle and may be visible to users. Never store private credentials or server-only secrets in these variables. Use this variable only for a token intended for client-side use.
Step 5: Protect the .env file
Open .gitignore in the project root and ensure it contains:
.env
.env.*
!.env.example
node_modules/
.expo/
dist/
web-build/
If .env was already committed to Git, adding it to .gitignore alone will not remove it from Git history. Remove it from tracking and rotate the token if it was exposed.
Optionally, create a .env.example file containing only a placeholder:
EXPO_PUBLIC_TMDB_ACCESS_TOKEN=YOUR_TMDB_READ_ACCESS_TOKEN
Commit .env.example, not the real .env file.
Step 6: Start the application
Run this command from the project root:
npx expo start --clear
Wait for Expo to start.
• Android emulator: Start a compatible emulator and press a in the Expo terminal.
• Physical Android device: Install a compatible Expo Go version, connect the phone and computer to the same Wi-Fi network, and scan the QR code.
• Keep the development terminal running while testing.
If you modify .env, restart Expo so the updated environment variable is loaded.
5. Running on the Android Emulator
1. Install Android Studio and the required Android SDK and emulator components.
2. Create and start an Android Virtual Device.
3. Wait until the emulator is fully booted.
4. Open the project root in VS Code.
5. Start Expo with npx expo start --clear.
6. Press a in the Expo terminal.
If Expo cannot connect to ADB, check that the emulator appears as device when running adb devices. If your system uses a custom ADB server port, make sure the Expo process inherits the same ANDROID_ADB_SERVER_PORT setting.
6. TMDB API Integration
The API functions are defined in src/api/tmdb.js.
Base API URL:
https://api.themoviedb.org/3
Axios sends the TMDB Read Access Token as a Bearer token in the authorization header. API requests use English-language responses by default.
List of 23 distinct TMDB endpoint patterns
No.
HTTP method
Endpoint pattern
Purpose
1
GET
/configuration
API and image configuration
2
GET
/trending/movie/{window}
Trending movies by day or week
3
GET
/movie/now_playing
Movies currently playing
4
GET
/movie/popular
Popular movies
5
GET
/movie/top_rated
Top-rated movies
6
GET
/movie/upcoming
Upcoming movies
7
GET
/search/movie
Search for movies
8
GET
/movie/{id}
Movie details
9
GET
/movie/{id}/credits
Movie cast and crew
10
GET
/movie/{id}/videos
Trailers and videos
11
GET
/movie/{id}/similar
Similar movies
12
GET
/movie/{id}/recommendations
Recommended movies
13
GET
/movie/{id}/reviews
Movie reviews
14
GET
/movie/{id}/images
Movie images
15
GET
/movie/{id}/watch/providers
Streaming provider information
16
GET
/movie/{id}/external_ids
External identifiers
17
GET
/movie/{id}/release_dates
Release dates and certifications
18
GET
/movie/{id}/keywords
Movie keywords
19
GET
/movie/{id}/lists
Lists containing a movie
20
GET
/genre/movie/list
Available movie genres
21
GET
/discover/movie
Discover movies using filters
22
GET
/person/{id}
Actor or filmmaker details
23
GET
/person/{id}/movie_credits
Movies associated with a person
Endpoint count: The src/api/tmdb.js file defines 23 distinct endpoint patterns, exceeding the assignment's minimum requirement of 15 patterns.
The {id} and {window} values are placeholders replaced with actual movie IDs, person IDs, or supported trending time windows.
This list documents the API wrappers defined in the source file. An endpoint should only be described as fully integrated when its function is called and its response is handled by the application.
Official documentation: https://developer.themoviedb.org/reference/getting-started
7. Error Handling
The TMDB API service includes a getErrorMessage() helper for common problems:
• HTTP 401: The API token was rejected or is invalid.
• HTTP 429: Too many requests were made in a short period.
• Request timeout: The request took too long to complete.
• Missing token: The required environment variable is not configured.
• Other errors: The API error message is used when available, with a general fallback message.
Screens should display appropriate loading and error states and provide a way to retry failed requests where appropriate.
8. Project Structure
The main files relevant to the API integration include:
cineverse-movie-discovery/
├── src/
│   └── api/
│       └── tmdb.js
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── app.json
└── README.md
• src/api/tmdb.js — Axios client, TMDB endpoint wrappers, image URL helper, and error-message helper.
• .env — local environment configuration; do not commit this file.
• .gitignore — excludes local configuration and generated files from Git.
• package.json — project dependencies and scripts.
• package-lock.json — records resolved dependency versions.
• app.json — Expo application configuration.
• README.md — project documentation and setup instructions.
The actual application may contain additional screens, navigation, components, and services.
9. Troubleshooting
Missing TMDB token
• Confirm that .env exists in the project root.
• Check that the variable name is exactly EXPO_PUBLIC_TMDB_ACCESS_TOKEN.
• Confirm that the token is valid.
• Restart Expo after changing .env.
API returns HTTP 401
Verify that the API Read Access Token was copied correctly and has not been revoked.
API returns HTTP 429
Wait before retrying. Avoid making unnecessary repeated requests.
Android emulator does not open the app
• Ensure the emulator is running and fully booted.
• Run adb devices and confirm that the emulator state is device.
• Keep Expo running in the terminal.
• If your system uses a custom ADB port, ensure the Expo process inherits the correct ANDROID_ADB_SERVER_PORT setting.
Changes are not appearing
Stop and restart Expo with:
npx expo start --clear
10. Testing Checklist
Before submitting the project, verify the following:
• Dependencies install successfully.
• The .env file is configured locally.
• The TMDB token works.
• The application launches on the target platform.
• Movie data loads from TMDB.
• Movie search works.
• Movie details and related features work.
• At least 15 distinct endpoint patterns are implemented and verified.
• Loading, empty, and error states are handled.
• The README contains correct setup instructions.
• The actual .env file and token are not committed to GitHub.
11. GitHub Submission
After testing the project, open a terminal in the project root and run:
git status
git add .
git commit -m "Document CineVerse setup and TMDB API integration"
git push
Before committing, verify that .env is not included in the staged files. If Git reports that no repository is configured or no remote exists, configure the Git repository and GitHub remote first.
After pushing, open your GitHub repository and confirm that README.md displays correctly on the repository home page.
12. Credits and Disclaimer
• Movie metadata and related information are provided by The Movie Database (TMDB).
• API documentation: https://developer.themoviedb.org/reference/getting-started
This project uses TMDB API data. It is not endorsed or certified by TMDB unless explicitly stated otherwise. Follow TMDB's current API terms, attribution, and branding requirements when distributing the application.
Author: Monisha

