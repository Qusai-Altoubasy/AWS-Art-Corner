import { LucideIcon, Package } from "lucide-react";
import { Card, CardContent } from "./card";

interface EmptyStateProps {
  title?: string;

  description?: string;

  icon?: LucideIcon;

  children?: React.ReactNode;
}

export const EmptyState = ({
  title = "No Data Found",
  description = "There is no available data to display right now.",
  icon: Icon = Package,
  children,
}: EmptyStateProps) => {
  return (
    <Card className="border-white/10">
      <CardContent className="flex flex-col items-center justify-center gap-5 py-20 text-center">
        <div className="gradient-primary shadow-primary flex h-20 w-20 items-center justify-center rounded-3xl">
          <Icon size={34} />
        </div>

        <div className="max-w-md space-y-2">
          <h2 className="text-2xl font-bold text-white">{title}</h2>

          <p className="text-muted text-sm leading-relaxed">{description}</p>
        </div>

        {children}
      </CardContent>
    </Card>
  );
};
