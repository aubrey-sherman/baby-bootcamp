import './Alert.css';

type AlertProps = {
  messages: string[];
}

/** Shows alerts from forms.
 *
 * Props: array of alert messages => ["message", ...], messageStyle => "alert"
 * State: None
 *
 * {LoginForm, SignupForm} -> Alert
 *
 */
function Alert({ messages }: AlertProps) {
  return (
    <div className='Alert'>
      {messages.map(
        message => <p key={message}>{message}</p>)}
    </div>
  );
}

export default Alert;