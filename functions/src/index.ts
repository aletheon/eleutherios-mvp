import {onRequest} from 'firebase-functions/v2/https';
import {logger} from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// Health check function
export const healthCheck = onRequest(async (req, res) => {
  try {
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  } catch (error) {
    logger.error('Health check failed', error);
    res.status(500).json({ error: 'Health check failed' });
  }
});

// Simple test function
export const hello = onRequest((req, res) => {
  res.send("Hello from Eleutherios PFSD Protocol!");
});
