type Props = {
  children: React.ReactNode;
  className?: string;
};

export const MIcon = ({ children, className, ...props }: Props) => (
  <span className={`material-symbols-rounded ${className}`} {...props}>
    {children}
  </span>
);
