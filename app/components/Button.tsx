import type { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";

export interface Props
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  size?: "sm" | "md" | "lg";
}

// type Props = {
//   className?: string;
//   children: ReactNode;
// };

export const Button = ({ className, children, ...props }: Props) => (
  <button
    className={`btn rounded-md bg-slate-400 py-0.5 px-3 font-medium text-white shadow-md ${className}`}
    {...props}
  >
    {children}
  </button>
);
