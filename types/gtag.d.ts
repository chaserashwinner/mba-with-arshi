export {};

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    gaInitialized?: boolean;
  }
}
