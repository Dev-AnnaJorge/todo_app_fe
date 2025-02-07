import { useState, useRef, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  const toggleCalendar = () => setIsOpen((prev) => !prev);
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  interface DayProps {
    day: Date;
    formattedDate: string;
    cloneDay: Date;
  }

  const onDateClick = (day: Date): void => {
    setSelectedDate(day);
    setIsOpen(false); // Close calendar after selecting date
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
      setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const renderHeader = () => (
    <div className="flex justify-between items-center p-2 bg-gray-100 rounded-t-lg text-sm">
      <button onClick={prevMonth} className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400">
        &#60;
      </button>
      <h2 className="text-sm font-semibold">{format(currentMonth, "MMM yyyy")}</h2>
      <button onClick={nextMonth} className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400">
        &#62;
      </button>
    </div>
  );

  const renderDays = () => {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div className="flex gap-1 p-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="flex justify-center items-center h-10 w-10 m-1">
            <span className="text-sm font-medium">{day}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    let day = startDate;
    let rows = [];

    while (day <= endDate) {
      let days = [];
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, "d");
        const cloneDay = day;
        days.push(
          <div
            className={`flex justify-center items-center h-10 w-full m-1 cursor-pointer ${
              isSameMonth(day, monthStart) ? "" : "text-gray-400"
            } ${isSameDay(day, selectedDate) ? "bg-blue-500 text-white rounded-full" : ""}`}
            key={day.toString()}
            onClick={() => onDateClick(cloneDay)}
          >
            <span className="text-sm">{formattedDate}</span>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="flex" key={day.toString()}>
          {days}
        </div>
      );
    }
    return <div className="flex flex-col">{rows}</div>;
  };

  return (
    <div className="relative inline-block" ref={calendarRef}>
      <button
        onClick={toggleCalendar}
        className="flex items-center space-x-2 p-2 text-white rounded-lg hover:bg-blue-600"
      >
        <FontAwesomeIcon icon={faCalendar} className="h-5 w-5" />
        <span>{format(selectedDate, "MMM d, yyyy")}</span>
      </button>
      {isOpen && (
         <div className="absolute top-12 left-0 sm:right-auto sm:left-[-150px] shadow-lg rounded-lg bg-white w-56 border z-50">
          {renderHeader()}
          {renderDays()}
          {renderCells()}
        </div>
      )}
    </div>
  );
}
