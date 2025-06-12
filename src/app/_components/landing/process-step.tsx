import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface ProcessStepProps {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function ProcessStep({
  number,
  icon: Icon,
  title,
  description,
}: ProcessStepProps) {
  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="relative rounded-2xl border border-border bg-card p-8 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)]"
    >
      <div className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-background">
        {number}
      </div>
      <div className="mb-6 flex justify-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-muted text-foreground">
          <Icon className="h-7 w-7 text-primary" />
        </div>
      </div>
      <h3 className="mb-3 text-xl font-medium text-center text-foreground">
        {title}
      </h3>
      <p className="text-muted-foreground text-center">{description}</p>
    </motion.div>
  );
}
