export interface Env {
  // Add any environment variables here if needed
}

export default {
  // Handle scheduled cron triggers
  async scheduled(
    event: any,
    env: Env,
    ctx: any
  ): Promise<void> {
    console.log(`Cron trigger fired at: ${new Date().toISOString()}`);
    
    try {
      // Make the API call to your endpoint
      const response = await fetch("");
      
      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      console.log('Successfully triggered endpoint:', await response.text());
    } catch (error) {
      console.error('Error triggering endpoint:', error);
      // Re-throw to mark the scheduled event as failed
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
