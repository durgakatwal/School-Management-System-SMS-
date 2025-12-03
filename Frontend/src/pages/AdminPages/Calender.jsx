// src/pages/AdminPages/Calender.jsx
import { Calendar as ShadcnCalendar } from "@/components/ui/calendar"; // 👈 Renamed import
import React from "react";

export default function Calender() {
  const [date, setDate] = React.useState(new Date());

  return (
    <ShadcnCalendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-lg border"
    />
  );
}
