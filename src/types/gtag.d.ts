// Google Tag (gtag.js) TypeScript definitions

type GtagCommand = 'config' | 'set' | 'event' | 'consent' | 'js';
type ConsentAction = 'default' | 'update';

interface ConsentParams {
  ad_storage?: 'granted' | 'denied';
  ad_user_data?: 'granted' | 'denied';
  ad_personalization?: 'granted' | 'denied';
  analytics_storage?: 'granted' | 'denied';
  functionality_storage?: 'granted' | 'denied';
  personalization_storage?: 'granted' | 'denied';
  security_storage?: 'granted' | 'denied';
  wait_for_update?: number;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: {
      (command: 'consent', action: ConsentAction, params: ConsentParams): void;
      (command: 'config', targetId: string, config?: Record<string, unknown>): void;
      (command: 'event', eventName: string, params?: Record<string, unknown>): void;
      (command: 'set', params: Record<string, unknown>): void;
      (command: 'js', date: Date): void;
      (command: string, ...args: unknown[]): void;
    };
  }
}

export {};
