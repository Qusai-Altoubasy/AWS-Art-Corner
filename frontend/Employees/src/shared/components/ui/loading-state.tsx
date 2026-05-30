import { Card, CardContent } from "./card";

interface LoadingStateProps {
  count?: number;
}

export const LoadingState = ({ count = 6 }: LoadingStateProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="overflow-hidden border-white/5 bg-white/3">
          <div className="h-72 animate-pulse bg-white/5" />

          <CardContent className="flex flex-col gap-5">
            <div className="space-y-3">
              <div className="h-5 w-3/4 animate-pulse rounded-full bg-white/5" />

              <div className="h-4 w-full animate-pulse rounded-full bg-white/5" />

              <div className="h-4 w-2/3 animate-pulse rounded-full bg-white/5" />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-3 w-16 animate-pulse rounded-full bg-white/5" />

                <div className="h-7 w-24 animate-pulse rounded-full bg-white/5" />
              </div>

              <div className="h-12 w-28 animate-pulse rounded-2xl bg-white/5" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
