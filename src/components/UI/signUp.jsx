// src/components/UI/SignUp.jsx
"use client";
import { useFormik } from "formik";
import { signUpSchema } from "@/schemas/validationSchema/userSchema";
import { showSuccess, showError } from "@/utils/alertManager";
import { novaFlat, josefin } from "@/app/fonts";
import { Eye, EyeOff, Facebook, Mail, Linkedin, Twitter } from "lucide-react";
import { useState, useEffect } from "react";
import {
  calculatePasswordStrength,
  getPasswordStrengthColor,
} from "@/utils/passwordUtils";
import { socialSignUp,
  checkSavedAccounts } from "@/utils/socialAuth";
import { Switch } from "@/components/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";
import Link from "next/link";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  //eslint-disable-next-line
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   //eslint-disable-next-line
  const [savedAccounts, setSavedAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const referralOptions = [
    { value: "newsletter", label: "Newsletter" },
    { value: "friend", label: "Friend" },
    { value: "internet", label: "Internet" },
    { value: "youtube", label: "YouTube" },
    { value: "ads", label: "Advertisement" },
  ];

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      isAdult: false,
      city: "",
      referralSource: "",
    },
    validationSchema: signUpSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (response.ok) {
          showSuccess("Sign up successful!");
          // Handle successful signup (e.g., redirect)
        } else {
          showError(data.message || "Sign up failed");
        }
      } catch (error) {
        console.error("Error occured in signup:", error);
        showError("An error occurred during sign up");
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    const initializeAccounts = async () => {
      const accounts = await checkSavedAccounts();
      setSavedAccounts(accounts);
    };

    initializeAccounts();
  }, []);

  const handleSocialSignUp = async (provider) => {
    try {
      setIsLoading(true);
      const result = await socialSignUp(provider);
      if (result.success) {
        showSuccess(`Successfully signed up with ${provider}`);
      } else {
        showError(result.message || `Failed to sign up with ${provider}`);
      }
    } catch (error) {
      console.error("Error occured in signup:", error);
      showError(`Error signing up with ${provider}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl p-8">
        <h2
          className={`${novaFlat.className} text-3xl font-bold text-center mb-8 text-gray-900`}
        >
          Sign Up for Bandhit
        </h2>

        {/* Social Sign Up Buttons */}
        <div className="space-y-3 mb-8">
          <h3
            className={`${josefin.className} text-center text-sm font-medium text-gray-700 mb-4`}
          >
            Sign up with
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {["google", "facebook", "linkedin", "twitter"].map((provider) => (
              <button
                key={provider}
                type="button"
                onClick={() => handleSocialSignUp(provider)}
                disabled={isLoading}
                className="flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                {provider === "google" && (
                  <Mail className="h-5 w-5 text-red-500 mr-2" />
                )}
                {provider === "facebook" && (
                  <Facebook className="h-5 w-5 text-blue-600 mr-2" />
                )}
                {provider === "linkedin" && (
                  <Linkedin className="h-5 w-5 text-blue-700 mr-2" />
                )}
                {provider === "twitter" && (
                  <Twitter className="h-5 w-5 text-blue-400 mr-2" />
                )}
                {provider.charAt(0).toUpperCase() + provider.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Email Sign Up Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className={`${josefin.className} block text-sm font-medium text-gray-700`}
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter your full name"
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.name}
              </div>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className={`${josefin.className} block text-sm font-medium text-gray-700`}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter your email"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.email}
              </div>
            )}
          </div>

          {/* Phone Number Field */}
          <div>
            <label
              htmlFor="phoneNumber"
              className={`${josefin.className} block text-sm font-medium text-gray-700`}
            >
              Phone Number
            </label>
            <input
              id="phoneNumber"
              type="tel"
              name="phoneNumber"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.phoneNumber}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter your phone number"
            />
            {formik.touched.phoneNumber && formik.errors.phoneNumber && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.phoneNumber}
              </div>
            )}
          </div>

          {/* City Field */}
          <div>
            <label
              htmlFor="city"
              className={`${josefin.className} block text-sm font-medium text-gray-700`}
            >
              City
            </label>
            <input
              id="city"
              type="text"
              name="city"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.city}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter your city"
            />
            {formik.touched.city && formik.errors.city && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.city}
              </div>
            )}
          </div>

          {/* Referral Source Dropdown */}
          <div>
            <label
              htmlFor="referralSource"
              className={`${josefin.className} block text-sm font-medium text-gray-700`}
            >
              How did you hear about us?
            </label>
            <Select
              id="referralSource"
              name="referralSource"
              onValueChange={(value) =>
                formik.setFieldValue("referralSource", value)
              }
              defaultValue={formik.values.referralSource}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a referral source" />
              </SelectTrigger>
              <SelectContent>
                {referralOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formik.touched.referralSource && formik.errors.referralSource && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.referralSource}
              </div>
            )}
          </div>

          {/* Age Verification Toggle */}
          <div className="flex items-center justify-between">
            <label
              htmlFor="isAdult"
              className={`${josefin.className} block text-sm font-medium text-gray-700`}
            >
              I am 18 years or older
            </label>
            <Switch
              id="isAdult"
              checked={formik.values.isAdult}
              onCheckedChange={(checked) =>
                formik.setFieldValue("isAdult", checked)
              }
              name="isAdult"
            />
          </div>

          {/* Password Fields */}
          <div>
            <label
              htmlFor="password"
              className={`${josefin.className} block text-sm font-medium text-gray-700`}
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pr-10"
                placeholder="Create a strong password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.password}
              </div>
            )}
            {formik.values.password && (
              <div className="mt-2">
                <div className="h-2 rounded-full bg-gray-200">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${getPasswordStrengthColor(
                      calculatePasswordStrength(formik.values.password)
                    )}`}
                    style={{
                      width: `${
                        (calculatePasswordStrength(formik.values.password) /
                          5) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading || !formik.isValid}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </button>
          </div>

          {/* Sign In Link */}
          <div className="text-center mt-4">
            <span className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Sign in
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
