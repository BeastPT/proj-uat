import 'dotenv/config'; // Load environment variables first
import { createApp } from './app';
import { appConfig } from './config/app.config';

async function startServer() {
  try {
    const app = await createApp();
    
    const address = await app.listen({ 
      port: appConfig.port,
      host: '0.0.0.0' // Listen on all network interfaces
    });
    
    app.log.info(`Server listening at ${address}`);
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
}

// Start the server
startServer();