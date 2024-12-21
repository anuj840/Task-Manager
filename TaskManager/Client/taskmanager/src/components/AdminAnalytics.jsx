import * as React from 'react';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import axios from 'axios';
import Sidebar from './sidebar';

// Value formatter
const valueFormatter = (value) => `${value} tasks`;

// Chart size
const size = {
  width: 400,
  height: 200,
};

// Analytics component
export default function Analytics() {
  const [taskStatus, setTaskStatus] = React.useState([]);  
  const [loading, setLoading] = React.useState(true); // Loading state
  const [error, setError] = React.useState(null); // State to handle errors

  // Function to get the token (assuming it's stored in localStorage)
  const getToken = () => localStorage.getItem('token'); // Retrieve the token from localStorage

  // Fetch data from the API
  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true before fetching data
      console.log('Fetching task status analytics...'); // Debug log
      try {
        const token = getToken(); // Get the token
        console.log('Token retrieved:', token); // Debug log
        if (!token) {
          throw new Error('No token, authorization denied');
        }

        const response = await axios.get('http://localhost:5000/tasks/task-status-analytics', {
          headers: {
            'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
          },
        });

        console.log('API response:', response.data); // Debug log

        const { analytics } = response.data;

        // Check if analytics is present
        if (!analytics) {
          throw new Error('No analytics data found in the response');
        }

        // Transform the API response to match the format required by the PieChart
        const transformedData = Object.entries(analytics).map(([status, value], index) => ({
          id: index, // Use index as id
          value,
          label: status, // Use status as label
        }));

        console.log('Transformed data:', transformedData); // Debug log

        setTaskStatus(transformedData); // Update the state with transformed data
      } catch (error) {
        setError(error.response?.data?.message || error.message); // Set the error state if an error occurs
        console.error('Error fetching task status analytics:', error);
      } finally {
        setLoading(false); // Set loading to false after the data is fetched
        console.log('Loading state set to false'); // Debug log
      }
    };

    fetchData(); // Call fetchData function when the component mounts
  }, []); // Empty dependency array to run once when the component mounts

  // Return early if data is still being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // Return early if there is an error
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Log the current taskStatus before rendering
  console.log('Current taskStatus:', taskStatus);

  // Data object with dynamic data
  const data = {
    data: taskStatus,
    valueFormatter,
  };

  return (
    <div className="">
      <Sidebar />
      <div className="containt">
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h1>Task Status Analytics</h1>
          <PieChart
            series={[
              {
                data: taskStatus, // Use the transformed taskStatus data directly
              },
            ]}
            sx={{
              [`& .${pieArcLabelClasses.root}`]: {
                fontWeight: 'bold',
              },
            }}
            {...size}
          />
         
        </div>
      </div>
    </div>
  );
}