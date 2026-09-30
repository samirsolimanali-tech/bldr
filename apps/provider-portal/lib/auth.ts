export function getProviderToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    if (sessionStorage.getItem('bldr_provider_logged_out') === '1') {
      return null;
    }
    return localStorage.getItem('bldr_token');
  } catch (e) {
    return null;
  }
}

export function isProviderAuthenticated(): boolean {
  return !!getProviderToken();
}

export function logoutProvider() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('bldr_token');
    localStorage.removeItem('bldr_provider_email');
    localStorage.removeItem('bldr_provider_name');
    localStorage.removeItem('bldr_venture_name');
    localStorage.removeItem('bldr_venture_id');
    localStorage.removeItem('bldr_provider_role');
    sessionStorage.setItem('bldr_provider_logged_out', '1');
  } catch (e) {}

  // Use replace to prevent browser Back button from navigating into protected views
  window.location.replace('/login');
}
