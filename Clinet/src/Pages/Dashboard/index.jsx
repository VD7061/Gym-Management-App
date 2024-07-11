import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
  const [members, setMembers] = useState([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfJoining, setDateOfJoining] = useState('');
  const [shift, setShift] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await axios.get('/members');
      setMembers(response.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch members');
    }
  };

  const addMember = async () => {
    try {
      const newMember = { name, age, phoneNumber, dateOfJoining, shift, paymentStatus };
      const response = await axios.post('/members', newMember);
      setMembers([...members, response.data]);
      clearForm();
      toast.success('Member added successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to add member');
    }
  };

  const updateMember = async () => {
    try {
      const updatedMember = { name, age, phoneNumber, dateOfJoining, shift, paymentStatus };
      const response = await axios.put(`/members/${editId}`, updatedMember);
      setMembers(members.map((member) => (member._id === editId ? response.data : member)));
      clearForm();
      setEditId(null);
      toast.success('Member updated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update member');
    }
  };

  const deleteMember = async (id) => {
    try {
      await axios.delete(`/members/${id}`);
      setMembers(members.filter((member) => member._id !== id));
      toast.success('Member deleted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete member');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      updateMember();
    } else {
      addMember();
    }
  };

  const clearForm = () => {
    setName('');
    setAge('');
    setPhoneNumber('');
    setDateOfJoining('');
    setShift('');
    setPaymentStatus('');
  };

  const handleEdit = (member) => {
    setName(member.name);
    setAge(member.age);
    setPhoneNumber(member.phoneNumber);
    setDateOfJoining(member.dateOfJoining);
    setShift(member.shift);
    setPaymentStatus(member.paymentStatus);
    setEditId(member._id);
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Dashboard</h1>
      <div className="row">
        <div className="col-md-4">
          <h2>{editId ? 'Edit Member' : 'Add Member'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                className="form-control"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                className="form-control"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Date of Joining</label>
              <input
                type="date"
                className="form-control"
                value={dateOfJoining}
                onChange={(e) => setDateOfJoining(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Shift</label>
              <select
                className="form-control"
                value={shift}
                onChange={(e) => setShift(e.target.value)}
                required
              >
                <option value="">Select Shift</option>
                <option value="morning">Morning</option>
                <option value="evening">Evening</option>
              </select>
            </div>
            <div className="form-group">
              <label>Payment Status</label>
              <select
                className="form-control"
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                required
              >
                <option value="">Select Payment Status</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary mt-3">
              {editId ? 'Update Member' : 'Add Member'}
            </button>
          </form>
        </div>
        <div className="col-md-8">
          <h2>Members</h2>
          <table className="table table-striped table-hover">
            <thead className="thead-dark">
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Phone Number</th>
                <th>Date of Joining</th>
                <th>Shift</th>
                <th>Payment Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member._id}>
                  <td>{member.name}</td>
                  <td>{member.age}</td>
                  <td>{member.phoneNumber}</td>
                  <td>{member.dateOfJoining}</td>
                  <td>{member.shift}</td>
                  <td>{member.paymentStatus}</td>
                  <td>
                    <button
                      className="btn btn-info mr-2"
                      onClick={() => handleEdit(member)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteMember(member._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
