import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './sumit.css';

// Inside your component
const notify = (message) => toast(message);

const Homepage = () => {
  const [accounts, setAccounts] = useState([]);
  const [accountId, setAccountId] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [bankName, setBankName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [ifsc, setIfsc] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccounts = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:3000/accounts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAccounts(response.data);
      } catch (error) {
        notify('Error fetching accounts');
        console.error('Error fetching accounts:', error);
      }
    };

    fetchAccounts();
  }, []);

  const handleAddAccount = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    console.log('Token:', token);
  
    try {
      const response = await axios.post('http://localhost:3000/add', {
        accountNumber,
        accountName,
        bankName,
        branchName,
        ifsc,
      },{
        headers: {
          Authorization: `Bearer ${token}`,
        }
     });
  
      console.log('Add Account Response:', response.data);
      if (Array.isArray(accounts)) {
        setAccounts([...accounts, response.data.result]);
      } else {
        setAccounts([response.data.result]);
      }
  
      setAccountNumber('');
      setAccountName('');
      setBankName('');
      setBranchName('');
      setIfsc('');
      notify('Account added successfully');
    } catch (error) {
      console.error('Error adding account:', error);
    }
  };

  const handleEditAccount = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    try {
      const response = await axios.put(
        `http://localhost:3000/edit/${accountId}`, // Include accountId in the URL
        {
          accountNumber,
          accountName,
          bankName,
          branchName,
          ifsc,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          }
        }
      );
      setAccounts(
        accounts.map((account) =>
          account._id === accountId ? response.data.result : account
        )
      );
      setAccountId('');
      setAccountNumber('');
      setAccountName('');
      setBankName('');
      setBranchName('');
      setIfsc('');
      notify('Account updated successfully');
    } catch (error) {
      console.error('Error updating account:', error);
      notify('Error updating account');
    }
  };

  const handleDeleteAccount = async (accountId) => {
    try {
      const token = localStorage.getItem('token'); // Retrieve the token from localStorage
      await axios.delete(`http://localhost:3000/delete/${accountId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        }
      });

      setAccounts(accounts.filter((account) => account._id !== accountId));
      notify('Account deleted successfully');
    } catch (error) {
      console.error('Error deleting account:', error);
      notify('Error deleting account');
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    try {
      await axios.post('http://localhost:3000/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        }
      });
      localStorage.removeItem('token');
      toast("Logout Succesfully") 
      navigate('/'); 
    } catch (error) {
      console.error('Error logging out:', error);
      notify('Error logging out');
    }
  };

  return (
    <div className="homepage-container">
      <h2 className="homepage-heading">Your Bank Accounts</h2>

      <button onClick={handleLogout} className="button">Logout</button>

      <form onSubmit={accountId ? handleEditAccount : handleAddAccount}>
        <h3>{accountId ? 'Edit Account' : 'Add New Account'}</h3>
        <input
          type="text"
          placeholder="Account Number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
        />
        <input
          type="text"
          placeholder="Account Name"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Bank Name"
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Branch Name"
          value={branchName}
          onChange={(e) => setBranchName(e.target.value)}
        />
        <input
          type="text"
          placeholder="IFSC Code"
          value={ifsc}
          onChange={(e) => setIfsc(e.target.value)}
        />
        <button type="submit" className="button">
          {accountId ? 'Update Account' : 'Add Account'}
        </button>
      </form>

      {accounts.length > 0 ? (
        accounts.map((account) => (
          <div key={account._id} className="account-entry">
            <p>Account Number: {account.accountNumber}</p>
            <p>Account Name: {account.accountName}</p>
            <p>Branch Name: {account.branchName}</p>
            <p>IFSC Code: {account.ifsc}</p>
            <p>Bank Name: {account.bankName}</p>
            <button
              onClick={() => {
                setAccountId(account._id);
                setAccountNumber(account.accountNumber);
                setAccountName(account.accountName);
                setBankName(account.bankName);
                setBranchName(account.branchName);
                setIfsc(account.ifsc);
              }}
              className="button"
            >
              <i className="fas fa-edit"></i> Edit
            </button>
            <button
              onClick={() => handleDeleteAccount(account._id)}
              className="button"
            >
              <i className="fas fa-trash"></i> Delete
            </button>
          </div>
        ))
      ) : (
        <div>
          <p>No bank accounts found. Please add a new account.</p>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Homepage;
