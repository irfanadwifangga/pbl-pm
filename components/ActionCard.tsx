"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CheckSquare, Building2, CheckCircle } from "lucide-react";
import Link from "next/link";

interface ActionCardProps {
  href: string;
  title: string;
  description: string;
  iconName: "checkSquare" | "building" | "checkCircle";
  gradient: string;
}

const iconMap = {
  checkSquare: CheckSquare,
  building: Building2,
  checkCircle: CheckCircle,
};

export function ActionCard({ href, title, description, iconName, gradient }: ActionCardProps) {
  const Icon = iconMap[iconName];

  return (
    <Link href={href}>
      <Card className={`cursor-pointer hover:shadow-lg transition-shadow ${gradient} text-white`}>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="text-sm opacity-90">{description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
