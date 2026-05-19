import { Button } from "./button";
import { Input } from "./input";
import { LucideIcon } from "lucide-react";

interface PageSectionHeaderProps {
  title: string;
  description?: string;

  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;

  onRefresh?: () => void;
  refreshLoading?: boolean;

  refreshIcon?: LucideIcon;
  searchIcon?: LucideIcon;
}

export const PageSectionHeader = ({
  title,
  description,

  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",

  onRefresh,
  refreshLoading = false,

  refreshIcon: RefreshIcon,
  searchIcon: SearchIcon,
}: PageSectionHeaderProps) => {
  return (
    <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* Left Side */}
      <div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>

        {description && (
          <p className="text-muted mt-1 text-sm">{description}</p>
        )}
      </div>

      {/* Right Side */}
      <div className="flex w-full items-center gap-2 md:max-w-md">
        {onSearchChange && (
          <div className="flex-1">
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              icon={SearchIcon ? <SearchIcon size={18} /> : undefined}
            />
          </div>
        )}

        {onRefresh && (
          <Button onClick={onRefresh} loading={refreshLoading} title="Refresh">
            {RefreshIcon && <RefreshIcon size={20} />}
          </Button>
        )}
      </div>
    </section>
  );
};
