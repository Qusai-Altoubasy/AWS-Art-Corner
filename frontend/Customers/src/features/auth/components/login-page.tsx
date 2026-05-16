import { useState } from "react";
import { Input } from "../../../shared/components/ui/input";
import { Button } from "../../../shared/components/ui/button";
import { Mail, Lock } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import { authRepository } from "../repository/AuthRepository";
import { ROUTES } from "../../../app/router/routes";
import { Card, CardContent } from "../../../shared/components/ui/card";
import { toast } from "sonner";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const user = await authRepository.login({
        email,
        password,
      });

      setUser(user);

      navigate(ROUTES.DASHBOARD, {
        replace: true,
      });
      toast.success(`Welcome ${user.name}`);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="mt-6 text-3xl font-bold tracking-tight text-white">
              Welcome back
            </h1>
            <p className="text-muted mt-2 text-sm">Sign in to continue</p>
          </div>
          <form className="flex flex-col gap-5" onSubmit={handleLogin}>
            <Input
              id="email"
              type="email"
              label="Email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="h-5 w-5" />}
              required
            />

            <Input
              id="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="h-5 w-5" />}
              required
            />

            <Button type="submit" loading={loading}>
              Sign in
            </Button>
          </form>
          <p className="text-center text-sm text-white/60">
            Don't have an account?{" "}
            <Link
              to={ROUTES.SIGNUP}
              className="font-bold text-indigo-400 hover:text-indigo-300"
            >
              Sign Up
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
};
