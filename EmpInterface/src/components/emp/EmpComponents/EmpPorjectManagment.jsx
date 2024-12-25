import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EmpProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token'); // Assume the token is stored in localStorage
        const response = await axios.get('/api/getProjects', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(response.data.projects);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching projects');
      }
    };

    fetchProjects();
  }, []);

  return (
    <div>
      <h1>Assigned Projects</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {projects.map((project) => (
          <li key={project._id}>
            <strong>{project.projectName}</strong> (Client: {project.clientName})
            <p>Start Date: {new Date(project.startDate).toLocaleDateString()}</p>
            <p>End Date: {new Date(project.endDate).toLocaleDateString()}</p>
            <p>Project Head: {project.projectHead}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmpProjectManagement;
