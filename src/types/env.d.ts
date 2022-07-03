declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      WEBHOOK_MAX_RETRIES: string;
      WEBHOOK_RETRY_INTERVAL_SECONDS: string;
    }
  }
}

export {};
