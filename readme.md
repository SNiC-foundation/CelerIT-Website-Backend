# CelerIT-Website-Backend
Welcome to the repository of the SNiC 2022: CelerIT backend.
The website is built in such a way that other committees can use it as well.
For possible improvement to the frontend, please look at the CelerIT evaluation document.

## Installation
1. Install NodeJS 16, e.g. via Node Version Manager.
2. Clone this repository. Place its folder next to the frontend repository folder (for client generation).
3. `npm install`.
4. `npm run dev`.

The backend generates routes dynamically based on the definitions in the controllers using TSOA.
This program runs in parallel to the rest of the project.
There are also some test cases present, but the test suite was abandoned at some point.
If possible, please extend this test suite to prevent any issues and hidden bugs when developing.

## Handy-dandy scripts
### `npm run lint:fix`
Run ESlint and fix any issues if possible. Makes sure your code remains nice, clean and consistent.

### `npm run gen-client`
Generate an HTTP client for the frontend. Make sure the folder in `package.json` at the script definition is correct.

### `npm run gen-barcodes:dev` or `npm run gen-barcodes:prod`
If you want to generate barcodes manually.

## Deployment
Deployment is defined in the repository of the frontend. Please visit that repository instead.
