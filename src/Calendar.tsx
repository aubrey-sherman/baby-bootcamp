import CalendarCell from "./CalendarCell.tsx";

/** Calendar component.
 *
 * Displayer's the current feeding times for a logged-in user.
 *
 * Eat -> Calendar
 */
function Calendar() {
  console.log("* Calendar")

  return (
    <div className="Calendar">
    <p>Feeding Calendar</p>
    <CalendarCell />
    </div>


  )
}

export default Calendar;