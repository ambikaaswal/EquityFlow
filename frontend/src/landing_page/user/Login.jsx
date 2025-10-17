import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import TextField from "@mui/material/TextField";
const Login = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
    mobile:"",
  });
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
        "http://localhost:8000/login",
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
          navigate("/");
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
    });
  };

   return (
      <div className="container my-5 text-center user">
        <div className="row mt-5">
          <form onSubmit={handleSubmit}>
            <fieldset>
              <legend>
                <h4>SignUp</h4>
              </legend>
              <div className="col-auto pt-3">
                <label htmlFor="username" className="col-sm-5 col-form-label">
                  Username
                </label>
                <TextField
                  id="username"
                  value={username}
                  type="text"
                  name="username"
                  label="Enter username"
                  variant="standard"
                  onChange={handleOnChange}
                />
                <br /> <br />
              </div>
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
              <div className="col-auto">
                <label htmlFor="repswrd" className="col-sm-5 col-form-label">
                  Re-type password
                </label>
                <TextField
                  id="repswrd"
                  type="password"
                  name="password2"
                  label="Enter password"
                  variant="standard"
                />{" "}
                <br /> <br /> <br />
              </div>
              <input type="submit" className="btn btn-primary" value="Submit" />{" "}
              <br />
              <span>
                Already have an account? <Link to={"/login"}>Login</Link>
              </span>
            </fieldset>
          </form>
        </div>
      </div>
    );


  // return (
  //   <div className="form_container">
  //     <h2>Login Account</h2>
  //     <form onSubmit={handleSubmit}>
  //       <div>
  //         <label htmlFor="email">Email</label>
  //         <input
  //           type="email"
  //           name="email"
  //           value={email}
  //           placeholder="Enter your email"
  //           onChange={handleOnChange}
  //         />
  //       </div>
  //       <div>
  //         <label htmlFor="password">Password</label>
  //         <input
  //           type="password"
  //           name="password"
  //           value={password}
  //           placeholder="Enter your password"
  //           onChange={handleOnChange}
  //         />
  //       </div>
  //       <button type="submit">Submit</button>
  //       <span>
  //         Already have an account? <Link to={"/signup"}>Signup</Link>
  //       </span>
  //     </form>
  //     <ToastContainer />
  //   </div>
  // );
};

export default Login;