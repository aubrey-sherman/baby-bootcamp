import CalendarManager from "./CalendarManager.tsx";
import { HomeProps } from './types.ts';

/** Presentational component that renders calendar.
 *
 * Eat -> CalendarManager
 */
function Eat({ currentUser }: HomeProps) {
  console.log("* Eat")

  return (
    <div className="Eat">
    <p>Feeding Calendar for {currentUser?.babyName}</p>
    <CalendarManager feedingEntries={currentUser?.feedingEntries} />
    </div>
  )
}

export default Eat;