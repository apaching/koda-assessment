interface AuthShellProps {
  children: React.ReactNode;
}

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* form panel */}
      <div className="flex w-full flex-col lg:w-[480px] lg:shrink-0 lg:border-r lg:border-border">
        {/* form body */}
        <div className="flex flex-1 flex-col items-center justify-center px-10 pb-16 lg:px-14">
          <div className="w-full max-w-[340px]">{children}</div>
        </div>
      </div>

      {/* brand panel — desktop only */}
      <div className="hidden flex-1 bg-muted lg:block" />
    </div>
  );
}
