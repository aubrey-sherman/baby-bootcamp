import { v4 as uuid } from "uuid";

/** Shows alerts from forms.
 *
 * Props: array of alert messages => ["message", ...], messageStyle => "alert"
 * State: None
 *
 * {LoginForm, SignupForm} -> Alert
 *
 */
function Alert({ messages, messageStyle }) {
  return (
    <div className={messageStyle}>
      {messages.map(message => <p key={message}>{message}</p>)}
    </div>
  );
}

export default Alert;