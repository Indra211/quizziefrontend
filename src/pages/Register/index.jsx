import "./index.css";
import React, { useState } from "react";
import axios from "axios";
import { Apis } from "../../Apis";
import { showToast } from "../../utils/toast";
import { useNavigate } from "react-router-dom";
import { storeData } from "../../utils/storages";

const Register = () => {
  const navigate = useNavigate();
  const [selectAuthType, setSelectAuthType] = useState("Login");
  const [loading, setLoading] = useState(false);
  const [signUpFormData, setSignUpFormData] = useState({
    name: "",
    email: "",
    password: "",
    cnfPassword: "",
  });
  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const handleSignUpFormData = (e) => {
    const { name, value } = e.target;
    setSignUpFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = {};
    const { name, email, password, cnfPassword } = signUpFormData;
    const isSignUp = selectAuthType?.toLowerCase() === "signup";

    if (isSignUp) {
      if (!name.trim()) {
        errors.name = "Name Required";
      } else if (name.length <= 3) {
        errors.name = "Must be at least 4 characters";
      }

      if (!email?.includes("@")) {
        errors.email = "Invalid Email";
      }

      if (!password) {
        errors.password = "Password Required";
      } else if (password.length <= 3) {
        errors.password = "Must be at least 4 characters";
      }

      if (cnfPassword !== password) {
        errors.cnfPassword = "Password doesn't match";
      }
    } else {
      const { email: loginEmail, password: loginPassword } = loginFormData;

      if (!loginEmail?.includes("@")) {
        errors.email = "Invalid Email";
      }

      if (!loginPassword) {
        errors.password = "Password Required";
      }
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLoginUpFormData = (e) => {
    const { name, value } = e.target;
    setLoginFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSignUpFormSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      if (loading) {
        return;
      }
      setLoading(true);
      try {
        const response = await axios.post(Apis.signup, signUpFormData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log(response.data);

        if (response.data.success) {
          showToast("success", response?.data?.message);
          storeData("token", response?.data?.token);
          navigate("/");
        }
      } catch (error) {
        showToast("error", error?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLoginFormSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      if (loading) {
        return;
      }
      setLoading(true);
      try {
        const response = await axios.post(Apis.login, loginFormData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.data.success) {
          showToast("success", response?.data?.message);
          storeData("token", response?.data?.token);
          navigate("/");
        }
      } catch (error) {
        showToast("error", error?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <div className="register">
      <div className="register-container">
        <h1 className="register-head">QUIZZIE</h1>
        <div style={{ display: "flex", gap: 42 }}>
          {["SignUp", "Login"]?.map((item, index) => {
            const isSelected = selectAuthType === item;
            return (
              <button
                onClick={() => {
                  setErrors({});
                  setSelectAuthType(item);
                }}
                key={index}
                className={`auth-btn ${isSelected ? "auth-btn-selected" : ""}`}
              >
                {item}
              </button>
            );
          })}
        </div>
        <form
          className="register-input-container"
          onSubmit={
            selectAuthType?.toLocaleLowerCase() === "signup"
              ? handleSignUpFormSubmit
              : handleLoginFormSubmit
          }
        >
          {selectAuthType?.toLowerCase() === "signup" && (
            <div className="register-form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={signUpFormData?.name}
                onChange={handleSignUpFormData}
                autoComplete="name"
                placeholder={errors.name || ""}
                className={errors.name ? "error" : ""}
              />
            </div>
          )}
          <div className="register-form-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              name="email"
              value={
                selectAuthType?.toLocaleLowerCase() === "signup"
                  ? signUpFormData?.email
                  : loginFormData?.email
              }
              onChange={
                selectAuthType?.toLocaleLowerCase() === "signup"
                  ? handleSignUpFormData
                  : handleLoginUpFormData
              }
              autoComplete="email"
              placeholder={errors.email || ""}
              className={errors.email ? "error" : ""}
            />
          </div>
          <div className="register-form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={
                selectAuthType?.toLocaleLowerCase() === "signup"
                  ? signUpFormData?.password
                  : loginFormData?.password
              }
              onChange={
                selectAuthType?.toLocaleLowerCase() === "signup"
                  ? handleSignUpFormData
                  : handleLoginUpFormData
              }
              autoComplete="new-password"
              placeholder={errors.password || ""}
              className={errors.password ? "error" : ""}
            />
          </div>
          {selectAuthType?.toLocaleLowerCase() === "signup" && (
            <div className="register-form-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                name="cnfPassword"
                type="password"
                id="confirm-password"
                value={signUpFormData.cnfPassword}
                onChange={handleSignUpFormData}
                autoComplete="new-password"
                placeholder={errors.cnfPassword || ""}
                className={errors.cnfPassword ? "error" : ""}
              />
            </div>
          )}
          <button className="register-submit-btn" type="submit">
            {loading
              ? "Submit..."
              : selectAuthType?.toLowerCase() === "signup"
              ? "Sign-Up"
              : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
