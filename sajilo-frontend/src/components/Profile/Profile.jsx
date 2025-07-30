import React, { useState, useEffect } from 'react';
import './Profile.css';
import { updateUserApi } from '../../apis/Api';
import { toast } from 'react-toastify';

const Profile = () => {
  const [user, setUser] = useState({
    fullName: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      setUser({
        fullName: savedUser.fullName || '',
        email: savedUser.email || '',
        phone: savedUser.phone || '',
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      fullName: user.fullName,
      phone: user.phone,
    };

    updateUserApi(userData)
      .then((res) => {
        toast.success(res.data.message || 'Profile updated!');
        localStorage.setItem('user', JSON.stringify({ ...user, ...userData }));
      })
      .catch((err) => {
        toast.error('Failed to update profile');
        console.error(err);
      });
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Welcome Back,</h2>
        <p>Update your account info below.</p>
      </div>
      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="input-box">
          <input
            type="text"
            name="fullName"
            value={user.fullName}
            onChange={handleChange}
            required
          />
          <label>Full Name</label>
        </div>
        <div className="input-box">
          <input
            type="email"
            name="email"
            value={user.email}
            disabled
          />
          <label>Email</label>
        </div>
        <div className="input-box">
          <input
            type="text"
            name="phone"
            value={user.phone}
            onChange={handleChange}
            required
          />
          <label>Phone Number</label>
        </div>
        <button type="submit" className="save-button">
          ✅ Save Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;
