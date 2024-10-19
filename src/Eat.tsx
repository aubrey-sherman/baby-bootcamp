import CalendarManager from "./CalendarManager.tsx";
import { HomeProps } from './types.ts';

function Eat({ currentUser }: HomeProps) {
  console.log("* Eat")

  return (
    <div className="Eat">
    <p>Feeding Calendar for {currentUser?.babyName}</p>
    <CalendarManager />
    </div>
  )
}

export default Eat;