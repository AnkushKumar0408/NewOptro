import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    address: "",
    password: "",
    confirmPassword: "",
    latitude: "",
    longitude: "",
  });

  const [errors, setErrors] = useState({});
  const [charCount, setCharCount] = useState(0);
  const [passwordStrength, setPasswordStrength] = useState("");
  // const [message, setMessage] = useState("");
  const [deviceInfo, setDeviceInfo] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    setDeviceInfo(userAgent);
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Valid email required";
    if (!formData.phone.match(/^\d{10}$/))
      newErrors.phone = "Phone must be 10 digits";
    if (!formData.dob) newErrors.dob = "Date of Birth is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (formData.password.length < 6)
      newErrors.password = "Minimum 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords must match";
    return newErrors;
  };

  const checkPasswordStrength = (pwd) => {
    if (pwd.length < 6) return "Weak";
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) return "Strong";
    return "Moderate";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "address") setCharCount(value.length);
    if (name === "password") setPasswordStrength(checkPasswordStrength(value));
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => alert("Location access denied!")
      );
    } else {
      alert("Geolocation not supported");
    }
  };

  const handleCheckCustomer = async () => {
    if (formData.phone.length === 10) {
      try {
        const res = await axios.get(
          `https://new-optro-back.vercel.app/customer/${formData.phone}`
        );
        if (res.data) setFormData({ ...formData, ...res.data });
      } catch {
        console.log("");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      try {
        // console.log(formData.fullName);
        axios.post("https://new-optro-back.vercel.app/register", {
          ...formData,
          deviceInfo,
        });
        // setMessage("Customer registered successfully!");
        setSubmitted(true);
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          gender: "",
          dob: "",
          address: "",
          password: "",
          confirmPassword: "",
          latitude: "",
          longitude: "",
        });
        setCharCount(0);
        setPasswordStrength("");
      } catch (err) {
        // setMessage("Submission failed!", err);
        console.log(err);
      }
    }
  };

  return (
    <div>
      <h1>Customer Registration</h1>
      {submitted ? (
        <p>Form submitted successfully!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
          />
          <span>{errors.fullName}</span>

          <input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <span>{errors.email}</span>

          <input
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleCheckCustomer}
          />
          <span>{errors.phone}</span>

          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
          />
          <span>{errors.dob}</span>

          <textarea
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />
          <span>{errors.address}</span>
          <small>{charCount}/500 characters</small>

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <span>{errors.password}</span>
          <small>Password strength: {passwordStrength}</small>

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <span>{errors.confirmPassword}</span>

          <button type="button" onClick={handleGetLocation}>
            Get Location
          </button>
          <input
            readOnly
            name="latitude"
            placeholder="Latitude"
            value={formData.latitude}
          />
          <input
            readOnly
            name="longitude"
            placeholder="Longitude"
            value={formData.longitude}
          />

          {formData.latitude && formData.longitude && (
            <iframe
              width="300"
              height="200"
              loading="lazy"
              src={`https://maps.google.com/maps?q=${formData.latitude},${formData.longitude}&z=15&output=embed`}
            />
          )}

          <button type="submit">Submit</button>
        </form>
      )}
      {/* <h3>{message}</h3> */}
    </div>
  );
}

export default App;
