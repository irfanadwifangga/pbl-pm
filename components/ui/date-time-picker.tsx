"use client";

import * as React from "react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateTimePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Pilih tanggal dan waktu",
  disabled = false,
  minDate,
}: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(value);
  const [selectedHour, setSelectedHour] = React.useState<string>(
    value ? format(value, "HH") : "08"
  );
  const [selectedMinute, setSelectedMinute] = React.useState<string>(
    value ? format(value, "mm") : "00"
  );

  // Generate hours (07:00 - 20:00 for typical office hours)
  const hours = Array.from({ length: 14 }, (_, i) => {
    const hour = i + 7;
    return hour.toString().padStart(2, "0");
  });

  // Generate minutes (00, 15, 30, 45)
  const minutes = ["00", "15", "30", "45"];

  React.useEffect(() => {
    if (value) {
      setSelectedDate(value);
      setSelectedHour(format(value, "HH"));
      setSelectedMinute(format(value, "mm"));
    }
  }, [value]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      updateDateTime(date, selectedHour, selectedMinute);
    }
  };

  const handleHourChange = (hour: string) => {
    setSelectedHour(hour);
    if (selectedDate) {
      updateDateTime(selectedDate, hour, selectedMinute);
    }
  };

  const handleMinuteChange = (minute: string) => {
    setSelectedMinute(minute);
    if (selectedDate) {
      updateDateTime(selectedDate, selectedHour, minute);
    }
  };

  const updateDateTime = (date: Date, hour: string, minute: string) => {
    const newDate = new Date(date);
    newDate.setHours(parseInt(hour), parseInt(minute), 0, 0);
    onChange(newDate);
  };

  return (
    <div className="flex flex-col gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? (
              format(selectedDate, "PPP", { locale: localeId })
            ) : (
              <span>Pilih tanggal</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) => {
              if (minDate) {
                return date < minDate;
              }
              return date < new Date(new Date().setHours(0, 0, 0, 0));
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {selectedDate && (
        <div className="flex gap-2 items-center">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedHour} onValueChange={handleHourChange}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Jam" />
            </SelectTrigger>
            <SelectContent>
              {hours.map((hour) => (
                <SelectItem key={hour} value={hour}>
                  {hour}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-muted-foreground">:</span>
          <Select value={selectedMinute} onValueChange={handleMinuteChange}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Menit" />
            </SelectTrigger>
            <SelectContent>
              {minutes.map((minute) => (
                <SelectItem key={minute} value={minute}>
                  {minute}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {selectedDate && (
        <p className="text-sm text-muted-foreground">
          {format(
            new Date(
              selectedDate.getFullYear(),
              selectedDate.getMonth(),
              selectedDate.getDate(),
              parseInt(selectedHour),
              parseInt(selectedMinute)
            ),
            "EEEE, dd MMMM yyyy 'pukul' HH:mm",
            { locale: localeId }
          )}
        </p>
      )}
    </div>
  );
}
