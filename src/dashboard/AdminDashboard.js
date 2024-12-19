import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]); // All users
  const [filteredUsers, setFilteredUsers] = useState([]); // Users filtered by role or search term
  const [searchTerm, setSearchTerm] = useState(""); // Search input
  const [roleFilter, setRoleFilter] = useState("all"); // Role filter: 'all', 'student', etc.
  const [selectedUser, setSelectedUser] = useState(null); // For View/Edit actions

  // Fetch users from Firestore
  const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const userList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUsers(userList);
    setFilteredUsers(userList); // Initialize filtered users
  };

  // Handle user search
  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    // Filter users based on the search term and role
    const filtered = users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(searchValue) ||
        user.lastName.toLowerCase().includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue)
    );
    setFilteredUsers(filtered);
  };

  // Handle role filter
  const handleRoleFilter = (e) => {
    const selectedRole = e.target.value;
    setRoleFilter(selectedRole);

    // Filter users by role
    const filtered =
      selectedRole === "all"
        ? users
        : users.filter((user) => user.role === selectedRole);
    setFilteredUsers(filtered);
  };

  // Handle deleting a user
  const handleDeleteUser = async (userId) => {
    try {
      await deleteDoc(doc(db, "users", userId));
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
  };

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Admin Dashboard</h1>

      {/* Search and Filter Section */}
      <div className="d-flex justify-content-between mb-4">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Search by Name or Email"
          value={searchTerm}
          onChange={handleSearch}
        />
        <select
          className="form-select"
          onChange={handleRoleFilter}
          value={roleFilter}
          style={{ width: "200px" }}
        >
          <option value="all">All Roles</option>
          <option value="student">Students</option>
          <option value="teacher">Teachers</option>
          <option value="admin">Admins</option>
          <option value="accounts">Accounts</option>
        </select>
      </div>

      {/* Users Table */}
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => setSelectedUser(user)}
                    data-bs-toggle="modal"
                    data-bs-target="#viewModal"
                  >
                    View
                  </button>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => setSelectedUser(user)}
                    data-bs-toggle="modal"
                    data-bs-target="#editModal"
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* View Modal */}
      <div
        className="modal fade"
        id="viewModal"
        tabIndex="-1"
        aria-labelledby="viewModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="viewModalLabel">
                User Details
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {selectedUser ? (
                <>
                  <p>
                    <strong>First Name:</strong> {selectedUser.firstName}
                  </p>
                  <p>
                    <strong>Last Name:</strong> {selectedUser.lastName}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedUser.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedUser.phone}
                  </p>
                  <p>
                    <strong>Role:</strong> {selectedUser.role}
                  </p>
                </>
              ) : (
                <p>No user selected.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <div
        className="modal fade"
        id="editModal"
        tabIndex="-1"
        aria-labelledby="editModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editModalLabel">
                Edit User
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {selectedUser ? (
                <form>
                  <div className="mb-3">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={selectedUser.firstName}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={selectedUser.lastName}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      defaultValue={selectedUser.email}
                    />
                  </div>
                  <button type="submit" className="btn btn-success">
                    Save Changes
                  </button>
                </form>
              ) : (
                <p>No user selected.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
