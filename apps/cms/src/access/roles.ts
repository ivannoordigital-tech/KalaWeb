import type { Access, AccessArgs } from 'payload'

export type UserRole = 'superadmin' | 'operator' | 'author' | 'seo' | 'midwife_coordinator' | 'marketing';

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

export const isSuperAdmin: Access = ({ req: { user } }: AccessArgs) => {
  return getUserRole(user) === 'superadmin';
};

export const canManagePagesAndLPs: Access = ({ req: { user } }: AccessArgs) => {
  const role = getUserRole(user);
  return role === 'superadmin' || role === 'operator' || role === 'marketing' || role === 'seo';
};

export const canManageArticles: Access = ({ req: { user } }: AccessArgs) => {
  const role = getUserRole(user);
  return role === 'superadmin' || role === 'author' || role === 'seo' || role === 'operator';
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
  return role === 'superadmin' || role === 'operator';
};
