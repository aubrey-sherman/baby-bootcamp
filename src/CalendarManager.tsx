import { useState } from "react";
import CalendarView from "./CalendarView.tsx";

/** CalendarManager handles the logic for calculating dates.
 *
 * CalendarManager -> CalenderView
 */
function CalendarManager() {

  const today = new Date();

  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate()));

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  /** Calculates the start of the current week (Sunday) based on current date. */
  function getStartOfWeek(date: Date) {
      const dayOfWeek = date.getDay();
      const startOfWeek = new Date(date);

      startOfWeek.setDate(date.getDate() - dayOfWeek);

      return startOfWeek;
  };

  /** Modifies currentDate by subtracting 7 days to navigate between weeks. */
  function handlePreviousWeek() {
    const prevWeekDate = new Date(currentDate);
    prevWeekDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(prevWeekDate);
    }

  /** Modifies currentDate by adding 7 days to navigate between weeks. */
  function handleNextWeek() {
    const nextWeekDate = new Date(currentDate);
    nextWeekDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(nextWeekDate);
  };

  const startOfWeek = getStartOfWeek(currentDate);
  const monthAndYear = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  return (
    <div>
      <button onClick={handlePreviousWeek}>Previous</button>
      <button onClick={handleNextWeek}>Next</button>
      <CalendarView
          startOfWeek={startOfWeek}
          monthAndYear={monthAndYear}
      />
    </div>
  );
};

export default CalendarManager;