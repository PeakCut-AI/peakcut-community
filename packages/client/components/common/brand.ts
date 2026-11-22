
/** Public runtime configuration, loaded before the client starts. */
type Brand = {
  name: string; title: string; accent: string; background: string; analyticsId?: string;
  wordmark: string; icon: string; home: string; terms: string;
  privacy: string; guidelines: string; support: string; source: string;
  communityPath: string; communityServer?: string; changelog?: string; feedback: string; announcements: string; tagline: string; description: string;
};
declare global { interface Window { PEAKCUT_BRAND?: Brand } }
if (!window.PEAKCUT_BRAND) throw new Error("Community branding configuration is missing");
export const brand: Brand = window.PEAKCUT_BRAND;
document.title = brand.title;
