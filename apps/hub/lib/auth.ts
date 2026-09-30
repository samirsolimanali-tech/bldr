export interface HubSession {
  email: string;
  scope?: string;
  authenticatedAt: string;
}

export function getHubSession(): HubSession | null {
  if (typeof window === 'undefined') return null;
  try {
    // If explicitly marked as logged out in this session, deny auth
    if (sessionStorage.getItem('bldr_hub_logged_out') === '1') {
      return null;
    }
    const raw = localStorage.getItem('bldr_hub_session');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.email) return null;
    return parsed;
  } catch (e) {
    return null;
  }
}

export function isHubAuthenticated(): boolean {
  return getHubSession() !== null;
}

export function loginHubUser(session: { email: string; scope?: string }, redirectUrl = '/') {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem('bldr_hub_logged_out');
    localStorage.setItem(
      'bldr_hub_session',
      JSON.stringify({
        email: session.email,
        scope: session.scope || 'all',
        authenticatedAt: new Date().toISOString(),
      })
    );
  } catch (e) {}

  // Use replace to prevent back-button loops into login
  window.location.replace(redirectUrl);
}

export function logoutHubUser() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('bldr_hub_session');
    localStorage.removeItem('bldr_token');
    localStorage.removeItem('bldr_role');
    sessionStorage.setItem('bldr_hub_logged_out', '1');
  } catch (e) {}

  // Replace current history entry so clicking browser 'Back' cannot return to protected page
  window.location.replace('/login');
}
