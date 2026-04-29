import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
}

export function Skeleton({ className, variant = "rectangular" }: SkeletonProps) {
  const baseClasses = "animate-pulse bg-muted";
  
  const variantClasses = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-md",
  };

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      role="status"
      aria-label="Loading"
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="p-6 space-y-4">
      <Skeleton variant="circular" className="w-16 h-16 mx-auto" />
      <Skeleton variant="text" className="h-6 w-3/4 mx-auto" />
      <Skeleton variant="text" className="h-4 w-full" />
      <Skeleton variant="text" className="h-4 w-2/3 mx-auto" />
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-8 w-full max-w-4xl px-6">
        <div className="text-center space-y-4">
          <Skeleton variant="text" className="h-12 w-2/3 mx-auto" />
          <Skeleton variant="text" className="h-6 w-1/2 mx-auto" />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    </div>
  );
}
