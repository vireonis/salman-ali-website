type ClassValue = string | number | null | false | undefined;

/** Minimal clsx replacement — joins truthy class values with a space. */
export default function clsx(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
