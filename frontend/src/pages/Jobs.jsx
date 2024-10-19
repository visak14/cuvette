import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);

  
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axiosInstance.get('/jobs/jobs');
        console.log(response); 
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="p-5 font-sans">
      <h1 className="text-center text-3xl font-bold mb-8">Available Jobs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white border border-gray-300 rounded-lg p-6 shadow-md hover:shadow-lg transition transform hover:-translate-y-2 cursor-pointer"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">{job.title}</h2>
              <p className="text-gray-600 mb-3">
                <strong>Company:</strong> {job.company?.name}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Experience Level:</strong> {job.experienceLevel}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>End Date:</strong> {new Date(job.endDate).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p>No jobs available.</p>
        )}
      </div>
    </div>
  );
};

export default Jobs;
