import { ReactNode } from "react";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import { Sparkles } from "lucide-react";

interface PageHeroProps {
  badge?: string;
  title: string;
  highlightedTitle?: string;
  description?: string;
  statsTitle?: string;
  statsValue?: string | number;
  statsDescription?: string;
  stateIcon?: ReactNode;

  buttonAction?: () => void;
  buttonLabel?: string;
  buttonIcon?: ReactNode;
  buttonLoading?: boolean;
}

export const PageHero = ({
  badge,
  title,
  highlightedTitle,
  description,
  statsTitle,
  statsValue,
  stateIcon,
  buttonAction,
  buttonLabel,
  buttonIcon,
  buttonLoading,
}: PageHeroProps) => {
  return (
    <section className="relative overflow-hidden rounded-4xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
      <div className="absolute top-0 right-0 h-60 w-60 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="absolute bottom-0 left-0 h-60 w-60 rounded-full bg-violet-500/20 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          {badge && (
            <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-xs font-semibold tracking-wide text-indigo-300">
              <Sparkles size={14} />
              {badge}
            </div>
          )}

          <h1 className="text-4xl font-black leading-tight text-white md:text-5xl">
            {title}

            {highlightedTitle && (
              <span className="ml-3 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                {highlightedTitle}
              </span>
            )}
          </h1>

          {description && (
            <p className="text-muted mt-5 max-w-xl text-base leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {(statsTitle || statsValue) && (
          <Card className="w-full max-w-sm">
            <CardContent className="flex flex-col gap-6">
              {(statsTitle || statsValue || stateIcon) && (
                <div className="flex items-center justify-between">
                  <div>
                    {statsTitle && (
                      <p className="text-muted text-sm">{statsTitle}</p>
                    )}

                    {statsValue && (
                      <h2 className="mt-1 text-4xl font-black text-white">
                        {statsValue}
                      </h2>
                    )}
                  </div>

                  {stateIcon && (
                    <div className="gradient-primary shadow-primary flex h-16 w-16 items-center justify-center rounded-3xl">
                      {stateIcon}
                    </div>
                  )}
                </div>
              )}
              {buttonLabel && buttonAction && (
                <Button
                  onClick={buttonAction}
                  loading={buttonLoading}
                  className="w-full"
                >
                  <div className="flex gap-8 items-center justify-between">
                    {buttonLabel}
                    {buttonIcon}
                  </div>
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};
