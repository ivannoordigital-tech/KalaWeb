import type { Access, AccessArgs } from 'payload'

/**
 * AUT-013 & FIX-002: Matriks Peran Pengguna (Role-Based Access Control)
 * Mengimplementasikan prinsip Least Privilege untuk melindungi data operasional dan klinis.
 */
export type UserRole =
  | 'superadmin'
  | 'operator'
  | 'author'
  | 'seo'
  | 'midwife_coordinator'
  | 'marketing'
  | 'automation';

export interface UserDoc {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
}

export function getUserRole(user?: any): UserRole | null {
  if (!user || !user.role) return null;
  return user.role as UserRole;
}

/**
 * Peran yang boleh melihat fitur teknis di CMS (HTML kustom, canonical, no-index).
 * Peran lain (marketing, author, midwife_coordinator) memakai tampilan sederhana.
 */
export const TECHNICAL_ROLES: UserRole[] = ['superadmin', 'operator', 'seo', 'automation'];

export function isTechnicalRole(userOrRole?: any): boolean {
  const role =
    typeof userOrRole === 'string' ? (userOrRole as UserRole) : getUserRole(userOrRole);
  return role ? TECHNICAL_ROLES.includes(role) : false;
}

export const isSuperAdmin: Access = ({ req: { user } }: AccessArgs) => {
  return getUserRole(user) === 'superadmin';
};

export const canManagePagesAndLPs: Access = ({ req: { user } }: AccessArgs) => {
  const role = getUserRole(user);
  return role === 'superadmin' || role === 'operator' || role === 'marketing' || role === 'seo';
};

export const canManageArticles: Access = ({ req: { user } }: AccessArgs) => {
  const role = getUserRole(user);
  return role === 'superadmin' || role === 'author' || role === 'seo' || role === 'operator' || role === 'automation';
};

export const canManageServices: Access = ({ req: { user } }: AccessArgs) => {
  const role = getUserRole(user);
  return role === 'superadmin' || role === 'operator' || role === 'seo';
};

export const canManageAreas: Access = ({ req: { user } }: AccessArgs) => {
  const role = getUserRole(user);
  return role === 'superadmin' || role === 'operator' || role === 'seo';
};

export const canManageMidwives: Access = ({ req: { user } }: AccessArgs) => {
  const role = getUserRole(user);
  return role === 'superadmin' || role === 'operator' || role === 'midwife_coordinator' || role === 'seo';
};

export const canManageTestimonials: Access = ({ req: { user } }: AccessArgs) => {
  const role = getUserRole(user);
  return role === 'superadmin' || role === 'operator' || role === 'midwife_coordinator' || role === 'seo';
};

export const canManageFAQ: Access = ({ req: { user } }: AccessArgs) => {
  const role = getUserRole(user);
  return role === 'superadmin' || role === 'operator' || role === 'seo';
};

export const canManageSiteSettings = ({ req: { user } }: { req: { user?: any } }) => {
  const role = getUserRole(user);
  return role === 'superadmin' || role === 'operator' || role === 'marketing';
};
