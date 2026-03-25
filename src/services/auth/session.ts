export type AuthUser = Record<string, unknown>;

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

export function clearSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;

  const raw = localStorage.getItem('auth_user');
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === 'object') {
      return parsed as AuthUser;
    }
    return null;
  } catch {
    return null;
  }
}

export function getUserDisplayName(user: AuthUser | null): string {
  if (!user) return '';

  const firstName = typeof user.firstName === 'string' ? user.firstName : '';
  const lastName = typeof user.lastName === 'string' ? user.lastName : '';
  const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();

  if (fullName) return fullName;

  const name = typeof user.name === 'string' ? user.name : '';
  if (name) return name;

  const email = typeof user.email === 'string' ? user.email : '';
  if (email) return email;

  return '';
}

export function getUserFirstName(user: AuthUser | null): string {
  if (!user) return '';

  const firstName = typeof user.firstName === 'string' ? user.firstName : '';
  if (firstName) return firstName;

  const name = typeof user.name === 'string' ? user.name : '';
  if (name) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    return parts[0] ?? '';
  }

  return '';
}
