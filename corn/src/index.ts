export interface Env {
  // Secret environment variable for API endpoint
  API_ENDPOINT: string;
}

// Retry configuration
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 2000; // 2 seconds between retries
const REQUEST_TIMEOUT_MS = 120000; // 120 seconds timeout (slightly more than Render's 50s)

export default {
  async scheduled(
    event: any,
    env: Env,
    ctx: any
  ): Promise<void> {
    console.log(`Cron trigger fired at: ${new Date().toISOString()}`);
    
    let retryCount = 0;
    
    while (retryCount <= MAX_RETRIES) {
      try {
        console.log(`Attempt ${retryCount + 1} of ${MAX_RETRIES + 1}`);
        
        // Check if API_ENDPOINT secret is configured
        if (!env.API_ENDPOINT) {
          throw new Error('API_ENDPOINT secret is not configured');
        }

        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

        try {
          // Make the GET request to your endpoint
          const response = await fetch(env.API_ENDPOINT, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            throw new Error(`API call failed with status: ${response.status}`);
          }

          const responseText = await response.text();
          console.log('Successfully triggered endpoint:', responseText);
          
          // Reset retry count on success
          retryCount = 0;
          return; // Exit successfully
          
        } catch (fetchError: any) {
          clearTimeout(timeoutId);
          
          if (fetchError.name === 'AbortError') {
            throw new Error(`Request timeout after ${REQUEST_TIMEOUT_MS}ms`);
          }
          throw fetchError;
        }
        
      } catch (error) {
        console.error(`Error on attempt ${retryCount + 1}:`, error);
        
        if (retryCount < MAX_RETRIES) {
          console.log(`Retrying in ${RETRY_DELAY_MS}ms...`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
          retryCount++;
        } else {
          console.error(`All ${MAX_RETRIES + 1} attempts failed`);
          retryCount = 0; // Reset for next scheduled run
          throw error;
        }
      }
    }
  },

  // Optional: Handle HTTP requests for testing
  async fetch(
    request: Request,
    env: Env,
    ctx: any
  ): Promise<Response> {
    return new Response('Corn scheduler is running. Cron triggers: 10 AM IST (4:30 AM UTC) and 6 PM IST (12:30 PM UTC)', {
      headers: { 'Content-Type': 'text/plain' },
    });
  },
};
