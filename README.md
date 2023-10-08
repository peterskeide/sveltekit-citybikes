# Bysykkel App

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Run tests

### All tests

First you must install the required Playwright tools with `npx playwright install`.

Once that is done, start WireMock via Docker to stub the API:

```
docker run -it --rm \
  -p 9000:8080 \
  --name wiremock \
  -v $PWD/tests/wiremock:/home/wiremock \
  wiremock/wiremock:3.1.0-1
```

... or if you have make installed, simply `make wiremock`.

Finally, run the tests with `npm run test`.

If you don't want vitest to watch for file changes after running the tests, pass the `run` command to vitest like so:
`npm run test run`

### Just unit tests

Run command: `npm run test:unit` (or `npm run test:unit run` to skip watching).

### Just integration / end-to-end tests

Make sure Playwright dependencies are installed and WireMock is running, as described above.

Then run: `npm run test:integration`.

## Run the application in Docker

### Build the docker image

`docker build -t bysykkel-app .` (or `make docker-build`)

### Start the container

Start docker: `docker run -it --rm -p 3000:3000 --name bysykkel-app bysykkel-app` (or `make docker-run`)

Open `http://localhost:3000` in your preferred browser.
