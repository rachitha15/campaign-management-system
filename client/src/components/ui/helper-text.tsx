import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface HelperTextProps {
  children: React.ReactNode;
  className?: string;
  icon?: boolean;
}

export function HelperText({ children, className, icon = true }: HelperTextProps) {
  return (
    <div className={cn("flex items-center text-sm text-muted-foreground", className)}>
      {icon && <Info className="mr-1 h-4 w-4 flex-shrink-0" />}
      <span>{children}</span>
    </div>
  );
}
