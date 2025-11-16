import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import TextField from "@mui/material/TextField";
const Login = () => {
  // const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
    mobile:"",
  });

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL;

  const { email, password, mobile } = inputValue;
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
    });
  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-left",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/login`,
        {
          ...inputValue,
        },
        { withCredentials: true }
      );
      console.log(data);
      const { success, message } = data;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          // navigate("/");
          window.open(`${DASHBOARD_URL}`, "_blank");
        }, 1000);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.log(error);
    }
    setInputValue({
      ...inputValue,
      email: "",
      password: "",
      mobile: "",
    });
  };

   return (
      <div className="container my-5 text-center login">
        <div className="row mt-5">
          <form onSubmit={handleSubmit}>
            <fieldset>
              <legend>
                <h4>Login</h4>
              </legend>
              <div className="col-auto">
                <label htmlFor="email" className="col-sm-5 col-form-label">
                  Email
                </label>
                <TextField
                  id="email"
                  value={email}
                  type="email"
                  name="email"
                  label="Enter email"
                  variant="standard"
                  onChange={handleOnChange}
                />
                <br /> <br />
              </div>
              <div className="col-auto">
                <label htmlFor="mob" className="col-sm-5 col-form-label">
                  Mobile number
                </label>
                <input
                  id="mob"
                  value={mobile}
                  type="tel"
                  pattern="[0-9]{10}"
                  name="mobile"
                  placeholder="Enter 10 digit number"
                  variant="standard"
                  onChange={handleOnChange}
                />
                <br /> <br />
              </div>
              <div className="col-auto">
                <label htmlFor="pswrd" className="col-sm-5 col-form-label">
                  password
                </label>
                <TextField
                  id="pswrd"
                  value={password}
                  type="password"
                  name="password"
                  label="Enter password"
                  variant="standard"
                  onChange={handleOnChange}
                />{" "}
                <br /> <br /> <br />
              </div>
              <input type="submit" className="btn btn-primary" value="Login" />{" "}
              <br />
            </fieldset>
          </form>
        </div>
      </div>
    );

};

export default Login;