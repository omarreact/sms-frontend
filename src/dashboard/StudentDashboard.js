import React from "react";

const StudentDashboard = () => {
  return (
    <div>
      <h1>Student Dashboard</h1>
      <ul>
        <li>
          <a href="/admission">Online Admission</a>
        </li>
        <li>
          <a href="/courses">Course Registration</a>
        </li>
        <li>
          <a href="/routine">Class Routine</a>
        </li>
        <li>
          <a href="/results">Exam Results</a>
        </li>
        <li>
          <a href="/fees">Fees Payment</a>
        </li>
      </ul>
    </div>
  );
};

export default StudentDashboard;
