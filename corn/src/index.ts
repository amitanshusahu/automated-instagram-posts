export interface Env {
  // Secret environment variable for API endpoint
  API_ENDPOINT: string;
}

export default {
  async scheduled(
    event: any,
    env: Env,
    ctx: any
  ): Promise<void> {
    console.log(`Cron trigger fired at: ${new Date().toISOString()}`);
    
    try {
      // Check if API_ENDPOINT secret is configured
      if (!env.API_ENDPOINT) {
        throw new Error('API_ENDPOINT secret is not configured');
      }

      // Make the GET request to your endpoint
      const response = await fetch(env.API_ENDPOINT, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      console.log('Successfully triggered endpoint:', await response.text());
    } catch (error) {
      console.error('Error triggering endpoint:', error);
      throw error;
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
