/** Calendar component.
 *
 * Displayer's the current feeding times for a logged-in user.
 *
 * CalendarManager -> CalendarView
 */
function CalendarView({ firstDay, daysInMonth, monthAndYear, currentWeek }) {
  console.log("* CalendarView")

  const days = [];
  let day = 1;

  // Fill the array with days of the month
  for (let i = 0; i < 6; i++) {
    let week = [];

    for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
            week.push(null);  // Empty cells before the first day of the month
        } else if (day > daysInMonth) {
            week.push(null);  // Empty cells after the last day of the month
        } else {
            week.push(day);
            day++;
        }
    }

      days.push(week);
  }

  // Get the specific week to display
  const weekToDisplay = days[currentWeek] || [];


  return (
    <div className="CalendarView">
      <h2>{monthAndYear}</h2>
      <table>
          <thead>
            <tr>
              <th>Sun</th>
              <th>Mon</th>
              <th>Tue</th>
              <th>Wed</th>
              <th>Thu</th>
              <th>Fri</th>
              <th>Sat</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {weekToDisplay.map((day, index) => (
                <td key={index}>
                  {day !== null ? day : ''}
                </td>
              ))}
            </tr>
          </tbody>
      </table>
    </div>
  );
};

export default CalendarView;