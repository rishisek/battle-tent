export interface User {
  id: number;
}
export function validate(user: User) {
  if (!user) return false;
  return true;
}
