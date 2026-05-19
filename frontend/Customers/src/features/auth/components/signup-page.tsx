import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "../../../shared/components/ui/input";
import { Button } from "../../../shared/components/ui/button";
import { Card, CardContent } from "../../../shared/components/ui/card";
import { ROUTES } from "../../../app/router/routes";
import { authRepository } from "../repository/AuthRepository";
import { RegisterRequest } from "../types/RegisterRequest";
import { Mail, Lock, User, Phone, MapPin } from "lucide-react";

export const SignupPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [apartment, setApartment] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData: RegisterRequest = {
      email,
      password,
      name,
      phone,
      role: "CUSTOMER",
      address: {
        city,
        street,
        apartment,
      },
    };

    try {
      setLoading(true);
      await authRepository.register(formData);
      toast.success("Account created successfully! Please log in.");
      navigate(ROUTES.LOGIN, {
        replace: true,
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create account",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-xl">
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
              Create Account
            </h1>
            <p className="text-muted text-sm">
              Join us and start shopping today
            </p>
          </div>

          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
            onSubmit={handleSignup}
          >
            <Input
              id="name"
              label="Full Name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<User className="h-5 w-5" />}
              required
            />
            <Input
              id="phone"
              label="Phone Number"
              placeholder="+9627..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              icon={<Phone className="h-5 w-5" />}
              required
            />
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

            <div className="col-span-1 md:col-span-2 border-t border-white/10 pt-4 mt-2">
              <p className="text-muted mb-4 text-xs font-semibold uppercase tracking-[0.2em]">
                Delivery Address
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  id="city"
                  placeholder="City (e.g. Amman)"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  icon={<MapPin className="h-4 w-4" />}
                  required
                />
                <Input
                  id="street"
                  placeholder="Street name"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  required
                />
                <Input
                  id="apartment"
                  placeholder="Apartment / Bldg"
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="col-span-1 md:col-span-2 mt-4"
            >
              Sign Up
            </Button>
          </form>

          <p className="text-center text-sm text-white/60">
            Already have an account?{" "}
            <Link
              to={ROUTES.LOGIN}
              className="font-bold text-indigo-400 hover:text-indigo-300"
            >
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
};
