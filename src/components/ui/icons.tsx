type IconProps = {
  className?: string;
};

const base = "size-4 shrink-0";

export function ArrowRightIcon({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${base} ${className}`}
      aria-hidden
    >
      <path d="M3 8h9.5" />
      <path d="M9 4.5 12.5 8 9 11.5" />
    </svg>
  );
}

export function ArrowDownIcon({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${base} ${className}`}
      aria-hidden
    >
      <path d="M8 3v9.5" />
      <path d="M4.5 9 8 12.5 11.5 9" />
    </svg>
  );
}

export function BoltIcon({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${base} ${className}`}
      aria-hidden
    >
      <path d="M9 1.5 3.5 9h3.5l-.5 5.5L12.5 7H9l0-5.5Z" />
    </svg>
  );
}

export function PlusIcon({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      className={`${base} ${className}`}
      aria-hidden
    >
      <path d="M3 8h10" />
      <path d="M8 3v10" />
    </svg>
  );
}
