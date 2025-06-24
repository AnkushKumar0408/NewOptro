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
  // const [isSubmitted, setIsSubmitted] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      try {
        axios.post("https://new-optro-back.vercel.app/register", {
          ...formData,
          deviceInfo,
        });
        setSubmitted(true);
        // setMessage("Customer registered successfully!");
        // setIsSubmitted(true);
      } catch (err) {
        // setMessage("Submission failed!", err);
        console.log(err);
      }
    }
  };

  // if (isSubmitted) {
  //   return <h3>{message}</h3>;
  // }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Customer Registration
        </h1>

        {submitted ? (
          <p className="text-center text-green-600 text-xl font-semibold">
            Form submitted successfully!
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="input"
              />
              <span className="error">{errors.fullName}</span>
            </div>

            <div>
              <input
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="input"
              />
              <span className="error">{errors.email}</span>
            </div>

            <div>
              <input
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleCheckCustomer}
                className="input"
              />
              <span className="error">{errors.phone}</span>
            </div>

            <div>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="input"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="input"
              />
              <span className="error">{errors.dob}</span>
            </div>

            <div>
              <textarea
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="input h-24 resize-none"
              />
              <span className="error">{errors.address}</span>
              <small className="text-sm text-gray-500">
                {charCount}/500 characters
              </small>
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="input"
              />
              <span className="error">{errors.password}</span>
              <div className="mt-1">
                <div className="h-2 w-full bg-gray-300 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      passwordStrength === "Weak"
                        ? "bg-red-500 w-1/3"
                        : passwordStrength === "Moderate"
                        ? "bg-yellow-400 w-2/3"
                        : passwordStrength === "Strong"
                        ? "bg-green-500 w-full"
                        : ""
                    }`}
                  ></div>
                </div>
                <small
                  className={`text-sm font-medium ${
                    passwordStrength === "Weak"
                      ? "text-red-500"
                      : passwordStrength === "Moderate"
                      ? "text-yellow-500"
                      : passwordStrength === "Strong"
                      ? "text-green-500"
                      : "text-gray-500"
                  }`}
                >
                  {passwordStrength && `Password strength: ${passwordStrength}`}
                </small>
              </div>
            </div>

            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input"
              />
              <span className="error">{errors.confirmPassword}</span>
            </div>

            <div>
              <button
                type="button"
                onClick={handleGetLocation}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg transition"
              >
                Get Location
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                readOnly
                name="latitude"
                placeholder="Latitude"
                value={formData.latitude}
                className="input bg-gray-100"
              />
              <input
                readOnly
                name="longitude"
                placeholder="Longitude"
                value={formData.longitude}
                className="input bg-gray-100"
              />
            </div>

            {formData.latitude && formData.longitude && (
              <div className="mt-4 rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="200"
                  loading="lazy"
                  className="rounded-lg border border-blue-300"
                  src={`https://maps.google.com/maps?q=${formData.latitude},${formData.longitude}&z=15&output=embed`}
                />
              </div>
            )}

            <div className="text-center">
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg shadow-md transition"
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default App;
