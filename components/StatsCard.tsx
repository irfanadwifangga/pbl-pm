"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Clock, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  CheckSquare, 
  FileText, 
  Building2 
} from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  iconName: "clock" | "calendar" | "checkCircle" | "xCircle" | "checkSquare" | "fileText" | "building";
  iconColor: string;
}

const iconMap = {
  clock: Clock,
  calendar: Calendar,
  checkCircle: CheckCircle,
  xCircle: XCircle,
  checkSquare: CheckSquare,
  fileText: FileText,
  building: Building2,
};

export function StatsCard({ title, value, iconName, iconColor }: StatsCardProps) {
  const Icon = iconMap[iconName];
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
