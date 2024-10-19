import CalendarView from "./CalendarView.tsx";
import { useState } from "react";

/** CalendarManager handles the logic for calculating dates.
 *
 * CalendarManager -> CalenderView
 */
function CalendarManager() {

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentWeek, setCurrentWeek] = useState(0);

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  function generateCalendarData(month, year) {
    const firstDay = new Date(year, month).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return { firstDay, daysInMonth };
  };

  function handlePreviousWeek() {
    if (currentWeek === 0) {
      handlePreviousMonth();
      setCurrentWeek(4);
    } else {
      setCurrentWeek(currentWeek - 1);
    }
};

  function handleNextWeek() {
    const { firstDay, daysInMonth } = generateCalendarData(currentMonth, currentYear);
    const totalWeeks = Math.ceil((daysInMonth + firstDay) / 7);

    if (currentWeek >= totalWeeks - 1) {
      handleNextMonth();
      setCurrentWeek(0);
    } else {
      setCurrentWeek(currentWeek + 1);
    }
};

  function handlePreviousMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  function handleNextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const calendarData = generateCalendarData(currentMonth, currentYear);
const monthAndYear = `${monthNames[currentMonth]} ${currentYear}`;

  return (
    <div>
      <button onClick={handlePreviousMonth}>Previous</button>
      <button onClick={handleNextMonth}>Next</button>
      <CalendarView
          firstDay={calendarData.firstDay}
          daysInMonth={calendarData.daysInMonth}
          monthAndYear={monthAndYear}
          currentWeek={currentWeek}
      />
    </div>
  );
};

export default CalendarManager;