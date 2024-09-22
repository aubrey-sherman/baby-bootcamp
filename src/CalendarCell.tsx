
/** Calendar cell component.
 *
 * Displays time and feeding amount (in ounces) for a given day and time block.
 *
 * Eat -> Calendar -> CalendarCell
 */
function CalendarCell() {
  console.log("* Calendar")

  return (
    <div className="CalendarCell">
    <p>Time: </p>
    <p>Amount: </p>
    </div>
  )
}

export default CalendarCell;