import React, { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { Form, Button, Row, Col, Table } from "react-bootstrap";

const AssignCourse = () => {
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  // Fetch courses from Firestore
  const fetchCourses = async () => {
    const querySnapshot = await getDocs(collection(db, "courses"));
    const courseList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCourses(courseList);
  };

  // Fetch users from Firestore
  const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const userList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUsers(userList);
  };

  useEffect(() => {
    fetchCourses();
    fetchUsers();
  }, []);

  // Handle role filter
  const handleRoleFilter = (e) => {
    setRoleFilter(e.target.value);
  };

  // Handle course assignment
  const handleAssignCourse = async (e) => {
    e.preventDefault();
    if (
      !selectedCourse ||
      !selectedUser ||
      !selectedClass ||
      !selectedSection
    ) {
      alert("Please select a course, user, class, and section.");
      return;
    }

    try {
      const userRef = doc(db, "users", selectedUser);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();
      const newAssignment = {
        courseId: selectedCourse,
        class: selectedClass,
        section: selectedSection,
      };
      const updatedAssignments = userData.assignedCourses
        ? [...userData.assignedCourses, newAssignment]
        : [newAssignment];

      await updateDoc(userRef, {
        assignedCourses: updatedAssignments,
      });

      // Update the users state to reflect the changes instantly
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser
            ? {
                ...user,
                assignedCourses: updatedAssignments,
              }
            : user
        )
      );

      alert("Course assigned successfully!");
    } catch (error) {
      console.error("Error assigning course:", error);
    }
  };

  return (
    <div>
      <h3 className="text-center">Assign Course</h3>
      <Form onSubmit={handleAssignCourse}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.courseName}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={6}>
            <Form.Select value={roleFilter} onChange={handleRoleFilter}>
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="teacher">Teachers</option>
            </Form.Select>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">Select Class</option>
              {/* Add class options here */}
              <option value="Class 1">Class 1</option>
              <option value="Class 2">Class 2</option>
              {/* Add more classes as needed */}
            </Form.Select>
          </Col>
          <Col md={6}>
            <Form.Select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
            >
              <option value="">Select Section</option>
              {/* Add section options here */}
              <option value="A">A</option>
              <option value="B">B</option>
              {/* Add more sections as needed */}
            </Form.Select>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={12}>
            <Form.Select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="">Select User</option>
              {users
                .filter((user) =>
                  roleFilter === "all" ? true : user.role === roleFilter
                )
                .map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName} ({user.role})
                  </option>
                ))}
            </Form.Select>
          </Col>
        </Row>
        <Button variant="primary" type="submit">
          Assign Course
        </Button>
      </Form>

      <h3 className="text-center mt-5">Assigned Courses</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>User</th>
            <th>Assigned Courses</th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter(
              (user) => user.assignedCourses && user.assignedCourses.length > 0
            )
            .map((user) => (
              <tr key={user.id}>
                <td>
                  {user.firstName} {user.lastName} ({user.role})
                </td>
                <td>
                  <ul>
                    {user.assignedCourses.map((assignment, index) => {
                      const assignedCourse = courses.find(
                        (course) => course.id === assignment.courseId
                      );
                      return (
                        <li key={index}>
                          {assignedCourse ? assignedCourse.courseName : "N/A"} -{" "}
                          {assignment.class} - {assignment.section}
                        </li>
                      );
                    })}
                  </ul>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AssignCourse;
