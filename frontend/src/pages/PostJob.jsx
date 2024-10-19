import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';

const PostJob = () => {
  const navigate = useNavigate();
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    experienceLevel: '',
    endDate: '',
    candidates: [], // Initially empty list of candidates
  });
  const [emailInput, setEmailInput] = useState(''); // For the candidate input
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch token and add it to axios headers
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('Token:', token); // Log token for debugging
    } else {
      console.error('No token found. Please log in again.');
      navigate('/login'); // Redirect to login page if no token
    }
  }, [navigate]);

  // Function to handle changes in job input fields (title, description, etc.)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Function to handle adding a candidate
  const addCandidate = () => {
    if (emailInput.trim()) {
      setJobData((prevState) => ({
        ...prevState,
        candidates: [...prevState.candidates, { email: emailInput }],
      }));
      setEmailInput(''); // Clear input field after adding
    }
  };

  // Function to handle removing a candidate
  const removeCandidate = (index) => {
    const updatedCandidates = jobData.candidates.filter((_, i) => i !== index);
    setJobData((prevState) => ({
      ...prevState,
      candidates: updatedCandidates,
    }));
  };

  // Function to submit job data to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send POST request with job data
      const response = await axiosInstance.post('/jobs/post-job', jobData);
      console.log(response.data);
      setSuccess('Job posted successfully!');
      navigate('/dashboard/jobs');

      setError(null);
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to post job');
      setSuccess(null);
    }
  };

  return (
    <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
      <form onSubmit={handleSubmit}>
        {/* Job Title */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="title">
            Job Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Enter Job Title"
            value={jobData.title}
            onChange={handleChange}
          />
        </div>

        {/* Job Description */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="description">
            Job Description
          </label>
          <textarea
            id="description"
            name="description"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Enter Job Description"
            value={jobData.description}
            onChange={handleChange}
            rows="4"
          ></textarea>
        </div>

        {/* Experience Level */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="experienceLevel">
            Experience Level
          </label>
          <select
            id="experienceLevel"
            name="experienceLevel"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            value={jobData.experienceLevel}
            onChange={handleChange}
          >
            <option value="">Select Experience Level</option>
            <option value="Junior">Junior</option>
            <option value="Mid">Mid</option>
            <option value="Senior">Senior</option>
          </select>
        </div>

        {/* End Date */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="endDate">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            value={jobData.endDate}
            onChange={handleChange}
          />
        </div>

        {/* Add Candidate Email */}
        <div className="mb-4 relative">
  <label className="block text-sm font-semibold mb-1">Add Candidate</label>
  
  {/* Input field for adding emails */}
  <div className="w-full flex flex-wrap items-center px-3 py-2 border rounded-md focus-within:ring focus-within:border-purple-300 mb-2">
    {jobData.candidates.map((candidate, index) => (
      <div key={index} className="flex items-center bg-gray-200 rounded-full px-2 py-1 mr-2 mb-1">
        <span className="text-sm">{candidate.email}</span>
        <button
          type="button"
          onClick={() => removeCandidate(index)}
          className="ml-2 text-xs text-gray-500 hover:text-red-500"
        >
          &times;
        </button>
      </div>
    ))}

    {/* Input for entering new candidate email */}
    <input
      type="email"
      placeholder="Candidate Email"
      value={emailInput}
      onChange={(e) => setEmailInput(e.target.value)}
      onBlur={addCandidate} // Add candidate when input loses focus
      className="flex-grow outline-none border-none focus:ring-0 focus:outline-none py-1"
    />
  </div>
</div>


        {/* Submit Button */}
        <div className="text-center w-20  ml-auto ">
          <button
            type="submit"
            className="px-6 py-1 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-700"
          >
            Send 
          </button>
        </div>

        {/* Success or Error Messages */}
        {success && <p className="text-green-500 mt-4">{success}</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
    </div>
  );
};

export default PostJob;
