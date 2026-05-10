import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { TrendingUp } from "lucide-react";

type Props = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  delay?: number;
};

export function StatCard({ label, value, icon: Icon, trend, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="relative overflow-hidden rounded-2xl bg-card border border-border p-5 shadow-soft hover:shadow-elegant transition-shadow"
    >
      <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full gradient-primary opacity-10 blur-2xl" />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-3xl font-semibold mt-2 tracking-tight">{value}</p>
          {trend && (
            <p className="mt-2 inline-flex items-center gap-1 text-xs text-success font-medium">
              <TrendingUp className="h-3 w-3" /> {trend}
            </p>
          )}
        </div>
        <div className="h-11 w-11 rounded-xl gradient-primary text-primary-foreground flex items-center justify-center shadow-elegant">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}
