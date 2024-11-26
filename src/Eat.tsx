import CalendarManager from "./CalendarManager.tsx";
import { EatProps } from './types.ts';
import './Eat.css';

/** Presentational component that renders calendar.
 *
 * RoutesList -> Eat -> CalendarManager
 */
function Eat({ username, babyName }: EatProps) {

  return (
    <div className="Eat">
    <p>Feeding Calendar for {babyName}</p>
    <CalendarManager
      username={username}
    />
    </div>
  )
}

export default Eat;