import { useState } from 'react';
import axiosInstance from '../axiosInstance';
import { useNavigate } from 'react-router-dom'; // If you are using react-router for navigation
import { useAuth } from '../context/AuthContext';
import nameIcon from "../assets/Person icon.png";
import mail from "../assets/mail.png"
import phone from "../assets/Vector.png"
import peop from "../assets/groups.png"
import { CiCircleCheck } from "react-icons/ci";

const Register = () => {
  const navigate = useNavigate();
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [emailOTP, setEmailOTP] = useState('');
  const [mobileOTP, setMobileOTP] = useState('');
  const [emailOTPVerified, setEmailOTPVerified] = useState(false);
  const [mobileOTPVerified, setMobileOTPVerified] = useState(false);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [employSize, setEmploySize] = useState('');
  const { dispatch } = useAuth();
  const formatPhoneNumber = (number) => {
    const cleaned = ('' + number).replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `+91${cleaned}`;
    }
    return null; 
  };

  const handleProceedClick = async () => {
    const formattedMobile = formatPhoneNumber(mobile);
    if (!formattedMobile) {
      console.error('Invalid mobile number format');
      return;
    }
    
    try {
      const response = await axiosInstance.post('/auth/register', {
        name,
        mobile: formattedMobile,
        company_name: companyName,
        company_email: companyEmail,
        employ_size: employSize
      });

      if (response.status === 200) {
        setShowOTPForm(true);
        console.log(response.data.message);
      }
    } catch (error) {
      console.error('Error sending registration data:', error);
    }
  };

  const handleEmailOTPVerification = async () => {
    try {
      const response = await axiosInstance.post('/auth/verify-email-otp', {
        emailOTP,
        company_email: companyEmail, // Use the actual company email from the form
      });
  
      if (response.status === 200) {
        // Email OTP verified successfully
        setEmailOTPVerified(true);
        // Check if both OTPs are verified
        if (mobileOTPVerified) {
          navigateToDashboard(); // Call navigation function if mobile OTP is also verified
        }
      }
    } catch (error) {
      console.error('Email OTP verification failed:', error.response.data.message);
      // Handle error, show notification, etc.
    }
  };
  
  const handleMobileOTPVerification = async () => {
    try {
      const response = await axiosInstance.post('/auth/verify-mobile-otp', {
        mobileOTP,
        mobile: formatPhoneNumber(mobile) // Ensure you pass the formatted mobile number
      });
  
      if (response.status === 200) {
        // Mobile OTP verified successfully
        const { token } = response.data; // Extract the token from the response
        localStorage.setItem('token', token);
        localStorage.setItem('email', companyEmail)
        setMobileOTPVerified(true);
        // Check if both OTPs are verified
       
        if (emailOTPVerified) {
          navigateToDashboard(); // Call navigation function if email OTP is also verified
        }
        dispatch({ type: 'LOGIN', payload: { token, email: companyEmail } })
      }
    } catch (error) {
      console.error('Mobile OTP verification failed:', error.response.data.message);
      // Handle error, show notification, etc.
    }
  };
  
  const navigateToDashboard = () => {
    // Redirect to the dashboard after a delay or immediately
    setTimeout(() => {
      navigate('/dashboard'); // Adjust the path as necessary
    }, 2000);
  };
  



  return (
    <div className="h-[100vh] flex flex-col lg:flex-row justify-center items-center lg:items-start p-6 lg:mt-10">
      {/* Left side: Text content */}
      <div className="lg:w-1/2 mb-8 lg:mb-0 lg:ml-10 lg:justify-center">
        <p className="text-gray-600 mb-8 lg:w-[80%] my-44">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          Lorem Ipsum has been the industrys standard dummy text ever since the 1500s,
          when an unknown printer took a galley.
        </p>
      </div>

      {/* Right side: Form */}
      <div className="lg:w-1/2 max-w-md w-full lg:mr-10">
        {/* Form 1: Sign-Up Form */}
        {!showOTPForm && (
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
            <p className="text-sm text-gray-500 mb-6 text-center">
              Lorem Ipsum is simply dummy text
            </p>

            {/* Input fields */}
            <div className="mb-4">
            <input
  type="text"
  placeholder="Name"
  className="w-full p-3 pl-12 border rounded-md bg-no-repeat bg-left"
  style={{ 
    backgroundImage:`url(${nameIcon})`
, // Ensure the path to your image is correct
    backgroundSize: '15px 15px',                     // Adjust size of the icon
    backgroundPosition: '10px center',               // Align the icon inside the input
  }}
  value={name}
  onChange={(e) => setName(e.target.value)}
/>


            </div>
            <div className="mb-4">
              <input
                type="tel"
                placeholder="Phone no."
                className="w-full p-3 pl-12 border rounded-md bg-no-repeat bg-left"
  style={{ 
    backgroundImage:`url(${phone})`
, // Ensure the path to your image is correct
    backgroundSize: '15px 15px',                     // Adjust size of the icon
    backgroundPosition: '10px center',               // Align the icon inside the input
  }}
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Company Name"
                className="w-full p-3 pl-12 border rounded-md bg-no-repeat bg-left"
  style={{ 
    backgroundImage:`url(${nameIcon})`
, // Ensure the path to your image is correct
    backgroundSize: '15px 15px',                     
    backgroundPosition: '10px center',               
  }}
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Company Email"
                className="w-full p-3 pl-12 border rounded-md bg-no-repeat bg-left"
  style={{ 
    backgroundImage:`url(${mail})`
, // Ensure the path to your image is correct
    backgroundSize: '15px 15px',                     // Adjust size of the icon
    backgroundPosition: '10px center',               // Align the icon inside the input
  }}
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <input
                type="text"
                placeholder="Employee Size"
                className="w-full p-3 pl-12 border rounded-md bg-no-repeat bg-left"
  style={{ 
    backgroundImage:`url(${peop})`
, // Ensure the path to your image is correct
    backgroundSize: '15px 15px',                     // Adjust size of the icon
    backgroundPosition: '10px center',               // Align the icon inside the input
  }}
                value={employSize}
                onChange={(e) => setEmploySize(e.target.value)}
              />
            </div>

            {/* Terms & Conditions */}
            <p className="text-sm text-center text-gray-400 mb-6">
              By clicking on proceed you will accept our{" "}
              <span className="text-blue-500">Terms & Conditions</span>
            </p>

            {/* Proceed Button */}
            <button
              onClick={handleProceedClick}
              className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600"
            >
              Proceed
            </button>
          </div>
        )}

        {/* Form 2: OTP Verification Form */}
        {showOTPForm && (
  <div className="bg-white shadow-lg rounded-lg p-8">
    <h2 className="text-2xl font-bold mb-4 text-center">Verify OTP</h2>
    <p className="text-sm text-gray-500 mb-6 text-center">
      Please enter the OTPs sent to your email and mobile.
    </p>

    {/* Email OTP Field */}
    <div className="mb-4 relative">
  <input
    type="text"
    placeholder="Email OTP"
    className={`w-full p-3 pl-12 border rounded-md bg-no-repeat bg-left ${emailOTPVerified ? 'border-green-500' : 'border-gray-300'}`}
    style={{
      backgroundImage: `url(${mail})`, // Ensure the path to your image is correct
      backgroundSize: '15px 15px',     // Adjust size of the icon
      backgroundPosition: '10px center', // Align the icon inside the input
    }}
    value={emailOTP}
    onChange={(e) => setEmailOTP(e.target.value)} // Manage email OTP input
  />

  {/* Icon with dynamic color and filled circle */}
  <span className="absolute right-4 top-8 transform -translate-y-1/2">
    <CiCircleCheck 
      className={`text-3xl ${emailOTPVerified ? 'text-green-500 bg-green-100 rounded-full p-1' : 'text-gray-400'}`} // Change color and add background
    />
  </span>

  <button
    onClick={handleEmailOTPVerification} // Verify Email OTP
    className="w-full bg-blue-500 text-white p-3 rounded-md mt-2 hover:bg-blue-600"
  >
    Verify Email OTP
  </button>
</div>


    {/* Mobile OTP Field */}
    <div className="mb-4 relative">
  <input
    type="text"
    placeholder="Mobile OTP"
    className={`w-full p-3 pl-12 border rounded-md bg-no-repeat bg-left ${mobileOTPVerified ? 'border-green-500' : 'border-gray-300'}`}
    style={{
      backgroundImage: `url(${phone})`, // Ensure the path to your image is correct
      backgroundSize: '15px 15px',       // Adjust size of the icon
      backgroundPosition: '10px center', // Align the icon inside the input
    }}
    value={mobileOTP}
    onChange={(e) => setMobileOTP(e.target.value)} // Manage mobile OTP input
  />

  {/* Single span for the icon */}
  <span className="absolute right-4 top-8 transform -translate-y-1/2">
    <CiCircleCheck 
      className={`text-3xl ${mobileOTPVerified ? 'text-green-500 bg-green-100 rounded-full p-1 ' : 'text-gray-400'}`} // Change color based on verification
    />
  </span>

  <button
    onClick={handleMobileOTPVerification} // Verify Mobile OTP
    className="w-full bg-blue-500 text-white p-3 rounded-md mt-2 hover:bg-blue-600"
  >
    Verify Mobile OTP
  </button>
</div>

  </div>
)}

      </div>
    </div>
  );
};

export default Register;
