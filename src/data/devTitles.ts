/**
 * Stable fake job titles for emoji / overflow desks (cosmetic only).
 * Indexed by desk slot — same index keeps the same title across renders.
 */

export const DEV_TITLES = [
  'Intern',
  'Junior Java Dev',
  'Mid Rust Dev',
  'Senior Go Dev',
  'Staff Python Dev',
  'Designer',
  'Product Owner',
  'Engineering Manager',
  'SRE',
  'QA Engineer',
  'DevOps',
  'Data Engineer',
  'Frontend Dev',
  'Backend Dev',
  'Full-stack Dev',
  'Platform Engineer',
  'Security Engineer',
  'Technical Writer',
  'Scrum Master',
  'Architect',
  'Release Manager',
  'Build Cop',
  'On-call Hero',
  'Rubber Duck',
  'Merge Conflict Resolver',
  'Tab Evangelist',
  'Spaces Purist',
  'Hotfix Specialist',
  'Staging Sheriff',
  'LGTM Bot Operator',
  'Coffee Quartermaster',
  'Standup Enforcer',
] as const;

/** Stable title for desk index `i` (modulo the pool). */
export function devTitleForIndex(index: number): string {
  const i =
    ((index % DEV_TITLES.length) + DEV_TITLES.length) % DEV_TITLES.length;
  return DEV_TITLES[i]!;
}
