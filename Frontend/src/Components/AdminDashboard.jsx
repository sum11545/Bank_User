import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const notify = (message) => toast(message);

const AdminDashboard = () => {
  const [bankData, setBankData] = useState([]);
  const [searchParams, setSearchParams] = useState({
    branchName: '',
    bankName: '',
    accountName: '',
    accountNumber: '',
  });

  useEffect(() => {
    const fetchBankData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:3000/admin', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBankData(response.data);
      } catch (error) {
        notify('Error fetching bank data');
        console.error('Error fetching bank data:', error);
      }
    };

    fetchBankData();
  }, []);

  const handleSearch = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:3000/admin/search', {
        headers: { Authorization: `Bearer ${token}` },
        params: searchParams,
      });
      setBankData(response.data.data);
    } catch (error) {
      notify('Error searching bank data');
      console.error('Error searching bank data:', error);
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    try {
      await axios.post('http://localhost:3000/admin/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        }
      });
      localStorage.removeItem('token'); // Clear the token from localStorage
      window.location.href = '/admin/login'; // Redirect to the admin login page
    } catch (error) {
      console.error('Error logging out:', error);
      notify('Error logging out');
    }
  };

  return (
    <div className="admin-dashboard-container">
      <h2>Admin Dashboard</h2>

      <button onClick={handleLogout} className="button">Logout</button>

      <div className="search-container">
        <input
          type="text"
          placeholder="Branch Name"
          value={searchParams.branchName}
          onChange={(e) => setSearchParams({ ...searchParams, branchName: e.target.value })}
        />
        <input
          type="text"
          placeholder="Bank Name"
          value={searchParams.bankName}
          onChange={(e) => setSearchParams({ ...searchParams, bankName: e.target.value })}
        />
        <input
          type="text"
          placeholder="Account Name"
          value={searchParams.accountName}
          onChange={(e) => setSearchParams({ ...searchParams, accountName: e.target.value })}
        />
        <input
          type="text"
          placeholder="Account Number"
          value={searchParams.accountNumber}
          onChange={(e) => setSearchParams({ ...searchParams, accountNumber: e.target.value })}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {bankData.length > 0 ? (
        bankData.map((account) => (
          <div key={account._id} className="account-entry">
            <p>Account Number: {account.accountNumber}</p>
            <p>Account Name: {account.accountName}</p>
            <p>Bank Name: {account.bankName}</p>
            <p>Branch Name: {account.branchName}</p>
            <p>IFSC Code: {account.ifsc}</p>
          </div>
        ))
      ) : (
        <p>No bank data available.</p>
      )}

      <ToastContainer />
    </div>
  );
};

export default AdminDashboard;
