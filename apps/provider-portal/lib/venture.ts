export interface VentureInfo {
  id: string;
  name: string;
  userName: string;
  brandColor?: string;
}

export const KNOWN_VENTURES: Record<string, { id: string; name: string; brandColor: string; defaultUser: string }> = {
  bldr: {
    id: 'bldr',
    name: 'bldr (Storefront Pilot)',
    brandColor: '#D10721',
    defaultUser: 'bldr Store Team',
  },
  studyhub: {
    id: 'studyhub',
    name: 'StudyHub Academy',
    brandColor: '#2E6F5E',
    defaultUser: 'Sarah Ibrahim',
  },
  apex: {
    id: 'apex',
    name: 'Apex Classes',
    brandColor: '#1B2A4A',
    defaultUser: 'Omar Hassan',
  },
  'el-hesa': {
    id: 'el-hesa',
    name: 'EL HESA Institute',
    brandColor: '#6B46C1',
    defaultUser: 'Fatima Al-Nasser',
  },
  'career-hub': {
    id: 'career-hub',
    name: 'Career Hub',
    brandColor: '#2563EB',
    defaultUser: 'Career Hub Team',
  },
  'techbridge-academy': {
    id: 'techbridge-academy',
    name: 'TechBridge Academy',
    brandColor: '#0D9488',
    defaultUser: 'Alex Rivera',
  },
};

export function resolveVentureForEmail(
  email?: string | null,
  fallbackName?: string | null,
  fallbackId?: string | null
): VentureInfo {
  const normEmail = (email || '').trim().toLowerCase();

  // 1. Check user accounts stored from Central Payment Hub
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('bldr_brand_users');
      if (raw) {
        const users = JSON.parse(raw);
        if (Array.isArray(users)) {
          const match = users.find((u: any) => (u.email || '').trim().toLowerCase() === normEmail);
          if (match && match.ventureName) {
            return {
              id: match.ventureId || 'bldr',
              name: match.ventureName,
              userName: match.name || normEmail.split('@')[0],
              brandColor: match.ventureColor,
            };
          }
        }
      }
    } catch (e) {}
  }

  // 2. Direct email matches
  if (
    normEmail === 'team@bldr.io' ||
    normEmail.includes('bldr.io') ||
    (normEmail.includes('bldr') && !normEmail.includes('studyhub'))
  ) {
    return {
      id: 'bldr',
      name: 'bldr (Storefront Pilot)',
      userName: 'bldr Store Team',
      brandColor: '#D10721',
    };
  }

  if (normEmail === 'sarah@studyhub.eg' || normEmail.includes('studyhub')) {
    return {
      id: 'studyhub',
      name: 'StudyHub Academy',
      userName: 'Sarah Ibrahim',
      brandColor: '#2E6F5E',
    };
  }

  if (normEmail === 'samirsolimanali@gmail.com') {
    return {
      id: fallbackId || 'studyhub',
      name: fallbackName && fallbackName !== 'bldr (Storefront Pilot)' ? fallbackName : 'StudyHub Academy',
      userName: 'Samir Soliman',
      brandColor: '#2E6F5E',
    };
  }

  if (normEmail === 'omar@apexclasses.eg' || normEmail.includes('apex')) {
    return {
      id: 'apex',
      name: 'Apex Classes',
      userName: 'Omar Hassan',
      brandColor: '#1B2A4A',
    };
  }

  if (normEmail === 'fatima@elhesa.eg' || normEmail.includes('elhesa') || normEmail.includes('el-hesa')) {
    return {
      id: 'el-hesa',
      name: 'EL HESA Institute',
      userName: 'Fatima Al-Nasser',
      brandColor: '#6B46C1',
    };
  }

  if (normEmail.includes('career')) {
    return {
      id: 'career-hub',
      name: 'Career Hub',
      userName: 'Career Hub Team',
      brandColor: '#2563EB',
    };
  }

  if (normEmail.includes('techbridge')) {
    return {
      id: 'techbridge-academy',
      name: 'TechBridge Academy',
      userName: 'Alex Rivera',
      brandColor: '#0D9488',
    };
  }

  // 3. Fallback name if explicitly given and meaningful
  if (
    fallbackName &&
    fallbackName.trim() &&
    fallbackName !== 'StudyHub Academy' &&
    fallbackName !== 'Brand Partner'
  ) {
    return {
      id: fallbackId || 'bldr',
      name: fallbackName.trim(),
      userName: normEmail ? normEmail.split('@')[0] : 'Brand Admin',
    };
  }

  // 4. Default: bldr (Storefront Pilot)
  return {
    id: fallbackId || 'bldr',
    name: fallbackName || 'bldr (Storefront Pilot)',
    userName: normEmail ? normEmail.split('@')[0] : 'bldr Store Team',
  };
}
