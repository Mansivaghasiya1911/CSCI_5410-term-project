import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyComponent: React.FC = () => {
  const [responseData, setResponseData] = useState<string>(''); // Response data from Lambda function
  const [items, setItems] = useState<any[]>([]); // Items received from the Lambda response


  

  useEffect(() => {
    
    // getDataFromLocalStorage();
  }, []);

  return (
    <div>
      {/* Display the response data if you want */}
      {responseData && <p>Response Data: {responseData}</p>}
      {/* You can also map over the 'items' array and display its content */}
      {items.map((item) => (
        <div key={item.id}>
          <p>{item.name}</p>
          {/* Add other properties you want to display */}
        </div>
      ))}
    </div>
  );
};

export default MyComponent;