import React from "react";

import UserList from "../../components/Users/UserList";
import AllCourse from "../../components/AllCourse/AllCourse";

const AdminDashboard = () => {
  return (
    <div className="container mt-4">
      <h1 className="text-center">Admin Dashboard</h1>

      <UserList />
      <AllCourse />
    </div>
  );
};

export default AdminDashboard;
