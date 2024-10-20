import './CalenderView.css'

/** Calendar component.
 *
 * Displayer's the current feeding times for a logged-in user.
 *
 * CalendarManager -> CalendarView
 */
function CalendarView({ startOfWeek, monthAndYear }) {
  console.log("* CalendarView")

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const week = [];
  for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      week.push(date);
  }

  return (
    <div>
      <h2>{monthAndYear}</h2>
        <table>
          <thead>
            <tr>
              <th>Night Feeding</th>
              {daysOfWeek.map((day, index) => (
                <th key={index}>{day}</th>
                ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {/* Blocks will go here, like 'First', 'Second', 'Third'... */}
              </td>
              {week.map((date, index) => (
                <td key={index}>
                    {date.getDate()} {/* Display the day of the month */}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
    </div>
    );
};

export default CalendarView;