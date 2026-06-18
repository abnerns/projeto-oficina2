import { useAuth, type UserRole } from "@/context/AuthContext";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

type Props = {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export function RoleGuard({ allowedRoles, children, fallback }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !allowedRoles.includes(user.role)) {
      navigate({ to: "/" });
    }
  }, [user, allowedRoles, navigate]);

  if (!user) return null;
  if (!allowedRoles.includes(user.role)) {
    return fallback || null;
  }
  return <>{children}</>;
}
