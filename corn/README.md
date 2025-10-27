# Corn Scheduler - Cloudflare Worker

A simple Cloudflare Worker that triggers an endpoint at scheduled times using Cron triggers.

## Schedule
- **10 AM IST** (4:30 AM UTC) - Daily
- **6 PM IST** (12:30 PM UTC) - Daily

## Endpoint
Makes a GET request to the endpoint configured in the `API_ENDPOINT` secret.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. **Set up the API endpoint secret:**

   For local development:
   ```bash
   cp .dev.vars.example .dev.vars
   # Edit .dev.vars and add your actual endpoint URL
   ```

   For production (after deploying):
   ```bash
   npx wrangler secret put API_ENDPOINT
   # Then enter your endpoint URL when prompted
   ```

3. Login to Cloudflare:
   ```bash
   npx wrangler login
   ```

4. Deploy the worker:
   ```bash
   npm run deploy
   ```

5. Set the production secret:
   ```bash
   npx wrangler secret put API_ENDPOINT
   ```
   Enter your endpoint URL (e.g., `https://xyz.com/trigger`) when prompted.

## Development

Run locally:
```bash
npm run dev
```

Note: Make sure you have `.dev.vars` file with your API_ENDPOINT set for local testing.

## Testing Cron Triggers

You can manually trigger the scheduled event using:
```bash
npx wrangler dev --test-scheduled
```

Or via the Cloudflare dashboard after deployment.

## Configuration

- **wrangler.toml**: Contains the worker configuration and cron schedules
- **src/index.ts**: Main worker code with the scheduled event handler
- **.dev.vars**: Local environment variables (not committed to git)
- **API_ENDPOINT**: Secret containing the endpoint URL to trigger

## Security

The API endpoint URL is stored as a secret and never exposed in the code. To update it:
```bash
npx wrangler secret put API_ENDPOINT
```
