import React, { createContext, useState, useEffect, useContext } from 'react';

export const AdminContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [adminDetails, setAdminDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  // Function to fetch admin details based on token
  const fetchAdminDetails = async (token) => {
    if (!token) {
      setIsLoading(false); // Stop loading if no token
      return;
    }

    try {
      const response = await fetch(`https://grocery-store-server-theta.vercel.app/api/admin-details`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // console.warn('Token expired or invalid. Logging out admin.');
          localStorage.removeItem('admin_auth_token');
          setAdminDetails(null);
        } else {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
      } else {
        const data = await response.json();
        setAdminDetails(data);
      }
    } catch (err) {
      // console.error('Error fetching admin details:', err.message);
      setAdminDetails(null);
    } finally {
      setIsLoading(false); // Mark loading as complete
    }
  };

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const initializeAdmin = async () => {
      const token = localStorage.getItem('admin_auth_token');
      if (isMounted) {
        await fetchAdminDetails(token);
      }
    };

    initializeAdmin();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AdminContext.Provider value={{ adminDetails, setAdminDetails, isLoading }}>
      {children}
    </AdminContext.Provider>
  );
};
