import React from "react";

const TeacherDashboard = () => {
  return (
    <div>
      <h1>Teacher Dashboard</h1>
      <ul>
        <li>
          <a href="/attendance">Mark Attendance</a>
        </li>
        <li>
          <a href="/materials">Upload Notes</a>
        </li>
        <li>
          <a href="/leave">Apply for Leave</a>
        </li>
      </ul>
    </div>
  );
};
export default TeacherDashboard;
