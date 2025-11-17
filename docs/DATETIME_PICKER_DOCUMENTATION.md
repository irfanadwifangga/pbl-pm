# 📅 DateTimePicker Component - Dokumentasi

## Overview

Komponen DateTimePicker yang user-friendly untuk memilih tanggal dan waktu dengan visual calendar dan dropdown untuk jam/menit.

---

## ✨ Fitur Utama

### 1. **Visual Calendar Picker**

- 📅 Kalender interaktif dengan bulan/tahun navigation
- 🚫 Disable tanggal di masa lalu
- 📍 Highlight tanggal hari ini
- 🎯 Tampilan bulan dalam bahasa Indonesia

### 2. **Time Picker dengan Dropdown**

- 🕐 Pilih jam: 07:00 - 20:00 (jam operasional)
- ⏰ Pilih menit: 00, 15, 30, 45 (interval 15 menit)
- 👁️ Preview waktu terpilih dalam format Indonesia

### 3. **Smart Auto-Complete**

- ⚡ End time otomatis +2 jam dari start time
- 🔒 End date tidak bisa lebih awal dari start date
- 🎯 End time picker disabled sampai start time dipilih

### 4. **Validasi Otomatis**

- ✅ Tanggal tidak bisa di masa lalu
- ✅ End time harus lebih besar dari start time
- ✅ Format display yang jelas dan readable

---

## 🎨 UI/UX Improvements

### Before (datetime-local input):

```
❌ Input manual rawan typo
❌ Format berbeda per browser
❌ Tidak intuitif untuk mobile
❌ Tidak ada validasi visual
```

### After (DateTimePicker):

```
✅ Visual calendar - mudah dipilih
✅ Dropdown jam/menit - no typo
✅ Format konsisten (Indonesia)
✅ Validasi real-time
✅ Mobile-friendly
✅ Preview datetime yang jelas
```

---

## 📱 Component Structure

```tsx
<DateTimePicker
  value={startDateTime}
  onChange={handleStartDateTimeChange}
  placeholder="Pilih tanggal dan waktu"
  minDate={minDate} // Optional
  disabled={false} // Optional
/>
```

---

## 🔧 How It Works

### 1. Pilih Tanggal

```
Click button → Popover muncul → Kalender interaktif
↓
User pilih tanggal → Kalender close → Button update
```

### 2. Pilih Waktu

```
Setelah tanggal dipilih → Time picker muncul
↓
Dropdown Jam (07-20) + Dropdown Menit (00,15,30,45)
↓
Preview update real-time
```

### 3. Preview

```
Tampilan: "Senin, 11 November 2025 pukul 14:30"
Format: Bahasa Indonesia, mudah dibaca
```

---

## 🎯 BookingForm Integration

### State Management

```tsx
const [startDateTime, setStartDateTime] = useState<Date | undefined>();
const [endDateTime, setEndDateTime] = useState<Date | undefined>();
```

### Auto-complete Logic

```tsx
const handleStartDateTimeChange = (date: Date | undefined) => {
  setStartDateTime(date);
  if (date) {
    setValue("startTime", date.toISOString());

    // Auto-set end time +2 hours
    if (!endDateTime) {
      const autoEndTime = new Date(date);
      autoEndTime.setHours(autoEndTime.getHours() + 2);
      setEndDateTime(autoEndTime);
      setValue("endTime", autoEndTime.toISOString());
    }
  }
};
```

### Validation

```tsx
<DateTimePicker
  value={endDateTime}
  onChange={handleEndDateTimeChange}
  minDate={startDateTime} // ← Can't select before start
  disabled={!startDateTime} // ← Disabled until start is set
/>
```

---

## 🎨 Visual Flow

```
┌─────────────────────────────────────┐
│  [📅 Pilih tanggal]  ← Button       │
└─────────────────────────────────────┘
            ↓ Click
┌─────────────────────────────────────┐
│     📅 November 2025                │
│  Su Mo Tu We Th Fr Sa               │
│              1  2  3  4             │
│   5  6  7  8  9 10 [11]            │ ← Calendar Popover
│  12 13 14 15 16 17 18              │
│  19 20 21 22 23 24 25              │
│  26 27 28 29 30                    │
└─────────────────────────────────────┘
            ↓ Select
┌─────────────────────────────────────┐
│  [📅 11 November 2025]              │
│                                     │
│  🕐 [14 ▼] : [30 ▼]                │ ← Time Dropdowns
│                                     │
│  Senin, 11 November 2025 pukul 14:30│ ← Preview
└─────────────────────────────────────┘
```

---

## ⚙️ Configuration

### Time Range

```tsx
// Current: 07:00 - 20:00
const hours = Array.from({ length: 14 }, (_, i) => {
  const hour = i + 7; // Starts at 07
  return hour.toString().padStart(2, "0");
});

// To extend: Change start hour and length
// Example 24h: (_, i) => i (length: 24)
```

### Minute Intervals

```tsx
// Current: 00, 15, 30, 45
const minutes = ["00", "15", "30", "45"];

// To add more:
const minutes = ["00", "10", "20", "30", "40", "50"];
```

---

## 🌐 Localization

Uses `date-fns` with Indonesian locale:

```tsx
import { id as localeId } from "date-fns/locale";

// Date format
format(date, "PPP", { locale: localeId });
// Output: "11 November 2025"

// DateTime format
format(date, "EEEE, dd MMMM yyyy 'pukul' HH:mm", { locale: localeId });
// Output: "Senin, 11 November 2025 pukul 14:30"
```

---

## 📦 Dependencies

```json
{
  "react-day-picker": "^8.10.0",
  "@radix-ui/react-popover": "^1.0.7",
  "date-fns": "^3.3.1"
}
```

---

## 🎯 Usage Examples

### Basic Usage

```tsx
<DateTimePicker value={date} onChange={setDate} placeholder="Pilih tanggal dan waktu" />
```

### With Min Date

```tsx
<DateTimePicker
  value={endDate}
  onChange={setEndDate}
  minDate={startDate} // Can't select before startDate
/>
```

### Disabled State

```tsx
<DateTimePicker value={date} onChange={setDate} disabled={!someCondition} />
```

---

## ♿ Accessibility

- ✅ Keyboard navigation support
- ✅ ARIA labels for screen readers
- ✅ Focus management in popover
- ✅ Clear visual states (hover, focus, selected)
- ✅ Disabled state properly indicated

---

## 📱 Responsive Design

### Desktop

- Popover aligned to start
- Calendar full width
- Time pickers horizontal layout

### Mobile

- Touch-friendly button size
- Popover adapts to screen size
- Select dropdowns native on mobile
- Scrollable calendar

---

## 🐛 Error Handling

### Date in Past

```tsx
disabled={(date) => {
  return date < new Date(new Date().setHours(0, 0, 0, 0));
}}
```

### End Before Start

```tsx
minDate = { startDateTime };
```

### Required Field

```tsx
{
  errors.startTime && <p className="text-sm text-red-500">{errors.startTime.message}</p>;
}
```

---

## 🚀 Performance

- ✅ React.useState for local state
- ✅ React.useEffect for sync with external value
- ✅ Memoized date calculations
- ✅ Lazy loading of popover content
- ✅ No unnecessary re-renders

---

## 🎓 User Guide

### Cara Menggunakan:

1. **Pilih Tanggal**
   - Klik button "Pilih tanggal"
   - Kalender akan muncul
   - Klik tanggal yang diinginkan
   - Tanggal masa lalu tidak bisa dipilih

2. **Pilih Waktu**
   - Setelah pilih tanggal, time picker muncul
   - Pilih jam dari dropdown (07:00 - 20:00)
   - Pilih menit dari dropdown (00, 15, 30, 45)
   - Preview akan update otomatis

3. **Waktu Selesai**
   - Otomatis terisi +2 jam dari waktu mulai
   - Bisa diubah sesuai kebutuhan
   - Tidak bisa lebih awal dari waktu mulai

4. **Konfirmasi**
   - Check preview datetime
   - Pastikan sudah sesuai
   - Lanjut isi form lainnya

---

## 💡 Tips & Best Practices

1. **Always show preview** - User tahu exactly apa yang dipilih
2. **Auto-complete wisely** - +2 jam is reasonable for room booking
3. **Disable past dates** - Prevent invalid bookings
4. **Link start/end** - End can't be before start
5. **Clear error messages** - Tell user what's wrong
6. **Mobile-first** - Touch targets 44x44px minimum

---

## 🔮 Future Enhancements

1. **Preset Times** - Quick select (Morning, Afternoon, Evening)
2. **Duration Picker** - Select duration instead of end time
3. **Recurring Events** - Weekly, Monthly patterns
4. **Timezone Support** - If needed for distributed teams
5. **Holiday Marking** - Mark and disable holidays
6. **Available Slots** - Show only available time slots
7. **Time Zones Display** - If multiple campuses
