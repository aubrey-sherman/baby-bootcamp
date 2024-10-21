import { FeedingBlock } from 'types';
import './CalenderView.css'

/** Calendar component.
 *
 * Displayer's the current feeding times for a logged-in user.
 *
 * CalendarManager -> CalendarView
 */
function CalendarView({ startOfWeek, monthAndYear, feedingBlocks, removeFeedingBlock }) {
  console.log("* CalendarView", feedingBlocks)

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const week: Date[] = [];
  for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      week.push(date);
  }

  function handleTableClick(evt: React.MouseEvent<HTMLTableElement>) {
    console.log("Clicked element:", evt)
    const target = evt.target as HTMLElement;
    const spanElement = target.tagName === 'TD' ? target.querySelector('span') : null;
    console.log(spanElement)

    if (spanElement) {
      const blockId = spanElement.getAttribute('data-id');
      console.log("blockId=", blockId);
      if (blockId && window.confirm(`Are you sure you want to remove this block?`)) {
        removeFeedingBlock(blockId);
      }
    }
  };

  return (
    <div>
      <h2>{monthAndYear}</h2>
        <table onClick={handleTableClick}>
          <thead>
            <tr>
              <th>Night Feeding</th>
              {daysOfWeek.map((day, index) => (
                <th key={index}>{day}</th>
                ))}
            </tr>
          </thead>
          <tbody>
            {feedingBlocks.map((feedingBlock: FeedingBlock) => (
              <tr key={feedingBlock.id}>
                <td>
                  <span data-id={feedingBlock.id}>
                    {feedingBlock.number}
                  </span>
                </td>
                {week.map((date, dateIndex) => (
                  <td key={dateIndex}>
                    {/* {date.getDate()} */}
                    Time:<br></br>
                    Amount:
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
    </div>
    );
};

export default CalendarView;