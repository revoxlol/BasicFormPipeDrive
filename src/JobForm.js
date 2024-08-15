import React, { useState } from 'react';
import axios from 'axios';
import Modal from './Modal'; 
const JobForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    jobType: '',
    jobSource: '',
    jobDescription: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    area: '',
    startDate: '',
    startTime: '',
    endTime: ''
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [dealLink, setDealLink] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };

  const validateAddress = () => {
    if (!formData.address) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        address: 'Address is required'
      }));
      return false;
    } else {
      setErrors((prevErrors) => {
        const { address, ...rest } = prevErrors;
        return rest;
      });
      return true;
    }
  };

  const createJob = async () => {
    if (!validateAddress()) {
      return;
    }

    const API_TOKEN = '85d46dceee517bbed9c677169cec8dfacc384101';
    const BASE_URL = 'https://api.pipedrive.com/v1';

    try {
      const personResponse = await axios.post(
        `${BASE_URL}/persons?api_token=${API_TOKEN}`,
        {
          name: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
          email: formData.email,
        }
      );
      const personId = personResponse.data.data.id;

      const dealResponse = await axios.post(
        `${BASE_URL}/deals?api_token=${API_TOKEN}`,
        {
          title: `${formData.jobType} for ${formData.firstName} ${formData.lastName}`,
          person_id: personId,
        }
      );
      const dealId = dealResponse.data.data.id;

      const location = `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`;
      const activityResponse = await axios.post(
        `${BASE_URL}/activities?api_token=${API_TOKEN}`,
        {
          subject: `${formData.jobType} - ${formData.jobDescription}`,
          deal_id: dealId,
          location: location,
          due_date: formData.startDate,
          due_time: formData.startTime,
          duration: formData.endTime,
        }
      );

      console.log(activityResponse.data);
      setSuccessMessage('Job created successfully!');
      setDealLink(`https://your-pipedrive-domain.pipedrive.com/deal/${dealId}`);
    } catch (error) {
      console.error(error);
      setSuccessMessage('Failed to create job.');
    }
  };

  return (
    <div className="container">
      <div className="section">
        <h2>Client details</h2>
        <input type="text" id="firstName" placeholder="First name" value={formData.firstName} onChange={handleChange} />
        <input type="text" id="lastName" placeholder="Last name" value={formData.lastName} onChange={handleChange} />
        <input type="text" id="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
        <input type="email" id="email" placeholder="Email (optional)" value={formData.email} onChange={handleChange} />
      </div>
      <div className="section">
        <h2>Job details</h2>
        <input type="text" id="jobType" placeholder="Job type" value={formData.jobType} onChange={handleChange} />
        <input type="text" id="jobSource" placeholder="Job source" value={formData.jobSource} onChange={handleChange} />
        <textarea id="jobDescription" placeholder="Job description (optional)" value={formData.jobDescription} onChange={handleChange} />
      </div>
      <div className="section">
        <h2>Service location</h2>
        <input type="text" id="address" placeholder="Address" value={formData.address} onChange={handleChange} />
        {errors.address && <span style={{ color: 'red' }}>{errors.address}</span>}
        <input type="text" id="city" placeholder="City" value={formData.city} onChange={handleChange} />
        <input type="text" id="state" placeholder="State" value={formData.state} onChange={handleChange} />
        <input type="text" id="zipCode" placeholder="Zip code" value={formData.zipCode} onChange={handleChange} />
        <input type="text" id="area" placeholder="Area" value={formData.area} onChange={handleChange} />
      </div>
      <div className="section">
        <h2>Scheduled</h2>
        <input type="date" id="startDate" placeholder="Start date" value={formData.startDate} onChange={handleChange} />
        <input type="time" id="endTime" placeholder="End time" value={formData.endTime} onChange={handleChange} />
      </div>
      <button onClick={createJob}>Create Job</button>
      <button onClick={() => setIsModalOpen(true)}>Open Job Creation</button> {}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        iframeSrc="http://localhost:3000" //I'm testing it on my machine so to test it, make sure you run the react 
                                          //  app as well, usually on "http://localhost:3000"
      />
      {successMessage && (
        <div style={{ color: successMessage.includes('successfully') ? 'green' : 'red', marginTop: '20px' }}>
          {successMessage}
          {dealLink && (
            <a href={dealLink} target="_blank" rel="noopener noreferrer" style={{ marginLeft: '2px', color: 'blue' }}>
              (Click to view)
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default JobForm;
