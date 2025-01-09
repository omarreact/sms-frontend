import React from "react";

import UserList from "../../components/Users/UserList";
import AllCourse from "../../components/AllCourse/AllCourse";
import AssignCourse from "../../components/AllCourse/AssignCourse";

const AdminDashboard = () => {
  return (
    <div className="container mt-4">
      <h1 className="text-center">Admin Dashboard</h1>

      <UserList />
      <AllCourse />
      <AssignCourse />
    </div>
  );
};

export default AdminDashboard;
