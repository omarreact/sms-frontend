import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { doc, getDoc, collection, getDocs, setDoc } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext"; // Assuming you have an AuthContext to get the current user
import { Form, Button, Row, Col, Table } from "react-bootstrap";

const TeacherDashboard = () => {
  const { currentUser } = useAuth(); // Get the current user
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [courses, setCourses] = useState({});
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [attendance, setAttendance] = useState({});
  const [examResults, setExamResults] = useState({});

  useEffect(() => {
    const fetchAssignedCourses = async () => {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setAssignedCourses(userData.assignedCourses || []);
        }
      }
    };

    const fetchCourses = async () => {
      const querySnapshot = await getDocs(collection(db, "courses"));
      const coursesData = {};
      querySnapshot.forEach((doc) => {
        coursesData[doc.id] = doc.data().courseName;
      });
      setCourses(coursesData);
    };

    const fetchStudents = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const studentList = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((user) => user.role === "student");
      setStudents(studentList);
    };

    fetchAssignedCourses();
    fetchCourses();
    fetchStudents();
  }, [currentUser]);

  const handleClassFilter = (e) => {
    setSelectedClass(e.target.value);
  };

  const handleCourseFilter = (e) => {
    setSelectedCourse(e.target.value);
  };

  const handleSemesterFilter = (e) => {
    setSelectedSemester(e.target.value);
  };

  const handleAttendanceChange = (studentId, value) => {
    setAttendance((prev) => ({ ...prev, [studentId]: value }));
  };

  const handleExamResultChange = (studentId, value) => {
    setExamResults((prev) => ({ ...prev, [studentId]: value }));
  };

  const handleAttendanceSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourse || !selectedClass || !selectedSemester) {
      alert("Please select a course, class, and semester.");
      return;
    }

    try {
      const attendanceRef = doc(
        db,
        "attendance",
        `${selectedClass}_${selectedCourse}_${selectedSemester}`
      );
      await setDoc(attendanceRef, { ...attendance }, { merge: true });
      alert("Attendance submitted successfully!");
    } catch (error) {
      console.error("Error submitting attendance: ", error);
      alert("Failed to submit attendance. Please try again.");
    }
  };

  const handleExamResultSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourse || !selectedClass || !selectedSemester) {
      alert("Please select a course, class, and semester.");
      return;
    }

    try {
      const examResultsRef = doc(
        db,
        "examResults",
        `${selectedClass}_${selectedCourse}_${selectedSemester}`
      );
      await setDoc(examResultsRef, { ...examResults }, { merge: true });
      alert("Exam results submitted successfully!");
    } catch (error) {
      console.error("Error submitting exam results: ", error);
      alert("Failed to submit exam results. Please try again.");
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.class === selectedClass &&
      assignedCourses.some(
        (course) =>
          course.courseId === selectedCourse && course.class === selectedClass
      )
  );

  return (
    <div className="container mt-4">
      <h1 className="text-center">Teacher Dashboard</h1>
      <ul className="list-unstyled">
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
      <h2 className="text-center mt-4">Assigned Courses</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Course</th>
            <th>Class</th>
            <th>Section</th>
          </tr>
        </thead>
        <tbody>
          {assignedCourses.length > 0 ? (
            assignedCourses.map((course, index) => (
              <tr key={index}>
                <td>{courses[course.courseId] || "Unknown Course"}</td>
                <td>{course.class}</td>
                <td>{course.section}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No courses assigned</td>
            </tr>
          )}
        </tbody>
      </Table>

      <h2 className="text-center mt-4">Filter Courses and Students</h2>
      <Form>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formClass">
              <Form.Label>Select Class</Form.Label>
              <Form.Control
                as="select"
                value={selectedClass}
                onChange={handleClassFilter}
              >
                <option value="">Select Class</option>
                {/* Add class options here */}
                <option value="Class 1">Class 1</option>
                <option value="Class 2">Class 2</option>
                {/* Add more classes as needed */}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formCourse">
              <Form.Label>Select Course</Form.Label>
              <Form.Control
                as="select"
                value={selectedCourse}
                onChange={handleCourseFilter}
              >
                <option value="">Select Course</option>
                {assignedCourses.map((course, index) => (
                  <option key={index} value={course.courseId}>
                    {courses[course.courseId] || "Unknown Course"}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formSemester">
              <Form.Label>Select Semester</Form.Label>
              <Form.Control
                as="select"
                value={selectedSemester}
                onChange={handleSemesterFilter}
              >
                <option value="">Select Semester</option>
                {/* Add semester options here */}
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
                {/* Add more semesters as needed */}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </Form>

      <h2 className="text-center mt-4">Student List</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Student Name</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <tr key={student.id}>
                <td>
                  {student.firstName} {student.lastName}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td>No students found</td>
            </tr>
          )}
        </tbody>
      </Table>

      <h2 className="text-center mt-4">Mark Attendance</h2>
      <Form onSubmit={handleAttendanceSubmit}>
        {filteredStudents.map((student) => (
          <Form.Group controlId={`attendance-${student.id}`} key={student.id}>
            <Form.Check
              type="checkbox"
              label={`${student.firstName} ${student.lastName}`}
              checked={attendance[student.id] || false}
              onChange={(e) =>
                handleAttendanceChange(student.id, e.target.checked)
              }
            />
          </Form.Group>
        ))}
        <Button variant="primary" type="submit" className="mt-3">
          Submit Attendance
        </Button>
      </Form>

      <h2 className="text-center mt-4">Add Exam Results</h2>
      <Form onSubmit={handleExamResultSubmit}>
        {filteredStudents.map((student) => (
          <Form.Group controlId={`examResult-${student.id}`} key={student.id}>
            <Form.Label>{`${student.firstName} ${student.lastName}`}</Form.Label>
            <Form.Control
              type="number"
              value={examResults[student.id] || ""}
              onChange={(e) =>
                handleExamResultChange(student.id, e.target.value)
              }
            />
          </Form.Group>
        ))}
        <Button variant="primary" type="submit" className="mt-3">
          Submit Exam Results
        </Button>
      </Form>
    </div>
  );
};

export default TeacherDashboard;
