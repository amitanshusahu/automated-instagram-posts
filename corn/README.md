# Corn Scheduler - Cloudflare Worker

A simple Cloudflare Worker that triggers an endpoint at scheduled times using Cron triggers.

## Schedule
- **10 AM IST** (4:30 AM UTC) - Daily
- **6 PM IST** (12:30 PM UTC) - Daily

## Endpoint
Triggers: `xyz.com/trigger` (Update in `src/index.ts`)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Update the endpoint URL in `src/index.ts` if needed (currently set to `xyz.com/trigger`)

3. Login to Cloudflare:
   ```bash
   npx wrangler login
   ```

4. Deploy the worker:
   ```bash
   npm run deploy
   ```

## Development

Run locally (note: cron triggers won't fire locally, but you can test the fetch handler):
```bash
npm run dev
```

## Testing Cron Triggers

You can manually trigger the scheduled event using:
```bash
npx wrangler dev --test-scheduled
```

Or via the Cloudflare dashboard after deployment.

## Configuration

- **wrangler.toml**: Contains the worker configuration and cron schedules
- **src/index.ts**: Main worker code with the scheduled event handler
