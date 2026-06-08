export function resolveAuthorAvatar(authorName, cmsAvatarUrl) {
  if (cmsAvatarUrl) return cmsAvatarUrl;

  const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120&h=120';
  
  if (authorName === 'Rajesh Koppula') {
    return '/images/team/rajesh.jpg';
  }
  
  if (authorName === 'Andrew Igharo') {
    return '/images/team/andrew.jpg';
  }

  return defaultAvatar;
}
