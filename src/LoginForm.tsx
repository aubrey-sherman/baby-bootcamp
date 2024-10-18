import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "./Alert.tsx";
import { tLogIn } from "./types.ts";

/** Log-in form for Baby Bootcamp.
 *
 * Props: logIn function
 * State: formData, formErrors
 *
 * RoutesList -> LoginForm -> Alert
 */

function LoginForm({ logIn }: tLogIn) {
  console.log("* LoginForm");

  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [formErrors, setFormErrors] = useState([]);
  console.log("* LoginForm");

  /** Updates formData as user types into form fields. */
  function handleChange(evt: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = evt.target;
    setFormData(currentData => ({ ...currentData, [name]: value }));
  }

  /** Sends formData to BabyBootcampApp on form submission.
   *
   * If login is not successful, sets errors.
   */
  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    try{
      await logIn(formData);
      navigate("/")
    }
    catch (errs: any) {
      setFormErrors(errs);
    }
  }

  return (
    <div className="LoginForm">
      <h2>Welcome back!</h2>

      <form onSubmit={handleSubmit}>

        <div className="form-group row align-items-center mb-3">
          <label htmlFor="username-input" className="col-sm-4 col-form-label">Username</label>
          <div className="col-sm-8">
            <input
              type="text"
              name="username"
              className="form-control"
              placeholder="username"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group row align-items-center mb-3">
          <label htmlFor="password-input" className="col-sm-4 col-form-label">Password</label>
          <div className="col-sm-8">
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="password"
              onChange={handleChange}
            />
          </div>
        </div>

          <button type="submit" className="btn btn-dark">Login</button>
        {formErrors.length > 0 && <Alert messageStyle="alert alert-danger" messages={formErrors} />}
      </form>

    </div>
  );
}

export default LoginForm;