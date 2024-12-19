import React, { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { Table, Button, Modal, Form, Row, Col } from "react-bootstrap";

const AllCourse = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);

  const [courseFormData, setCourseFormData] = useState({
    courseName: "",
    courseCode: "",
    class: "",
    section: "",
  });

  // State for search inputs
  const [courseSearch, setCourseSearch] = useState({
    subject: "",
    class: "all",
    section: "all",
  });
  // Fetch courses from Firestore
  const fetchCourses = async () => {
    const querySnapshot = await getDocs(collection(db, "courses"));
    const courseList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCourses(courseList);
    setFilteredCourses(courseList); // Initialize filteredCourses with all courses
  };

  useEffect(() => {
    // fetchUsers();
    fetchCourses();
  }, []);
  // Handle search course
  const handleCourseSearch = (e) => {
    const { name, value } = e.target;
    const updatedSearch = { ...courseSearch, [name]: value };
    setCourseSearch(updatedSearch);

    const filtered = courses.filter((course) => {
      const subjectMatch = course?.courseName
        ?.toLowerCase()
        ?.includes(updatedSearch.subject.toLowerCase());
      const classMatch =
        updatedSearch.class === "all" || course?.class === updatedSearch.class;
      const sectionMatch =
        updatedSearch.section === "all" ||
        course?.section === updatedSearch.section;

      return subjectMatch && classMatch && sectionMatch;
    });

    setFilteredCourses(filtered); // Update filtered courses
  };
  // Add or edit course
  const handleCourseFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentCourse) {
        await updateDoc(doc(db, "courses", currentCourse.id), courseFormData);
      } else {
        await addDoc(collection(db, "courses"), courseFormData);
      }
      fetchCourses();
      closeCourseModal();
    } catch (error) {
      console.error("Error saving course:", error);
    }
  };

  // Delete course
  const handleDeleteCourse = async (id) => {
    try {
      const confirm = window.confirm("Are you want to delete the course?");
      if (confirm === true) {
        await deleteDoc(doc(db, "courses", id));
        fetchCourses();
      }

      console.log(confirm);
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  // Open course modal
  const openCourseModal = (course = null) => {
    setCurrentCourse(course);
    setCourseFormData(
      course || {
        courseName: "",
        courseCode: "",
        class: "",
        section: "",
      }
    );
    setShowCourseModal(true);
  };

  // Close course modal
  const closeCourseModal = () => {
    setShowCourseModal(false);
    setCurrentCourse(null);
  };

  return (
    <div>
      {/* Add Course */}
      <Row className="mb-3">
        {/* Search input fields */}
        <Form className="mb-3">
          <Row>
            <h3 className="text-center">All Courses List</h3>

            <Col md={4}>
              <Form.Control
                type="text"
                placeholder="Search by Subject"
                name="subject"
                value={courseSearch.subject}
                onChange={handleCourseSearch}
              />
            </Col>
            <Col md={4}>
              <Form.Select
                name="class"
                value={courseSearch.class}
                onChange={handleCourseSearch}
              >
                <option value="all">All Classes</option>
                {[...Array(12)].map((_, index) => (
                  <option key={index + 1} value={`${index + 1}`}>
                    Class {index + 1}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Select
                name="section"
                value={courseSearch.section}
                onChange={handleCourseSearch}
              >
                <option value="all">All Sections</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
                <option value="D">Section D</option>
              </Form.Select>
            </Col>
          </Row>
        </Form>
      </Row>
      <Row className="mb-3">
        <Col md={4}>
          <Button variant="primary" onClick={() => openCourseModal()}>
            Add New Course
          </Button>
        </Col>
      </Row>
      <Table striped bordered hover responsive className="mb-4">
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Course Code</th>
            <th>Class</th>
            <th>Section</th>
            <th>Actions</th>
          </tr>
        </thead>
        {/* Render filteredCourses in the table */}
        <tbody>
          {filteredCourses.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                No courses found
              </td>
            </tr>
          ) : (
            filteredCourses.map((course) => (
              <tr key={course.id}>
                <td>{course.courseName}</td>
                <td>{course.courseCode}</td>
                <td>{course.class}</td>
                <td>{course.section}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => openCourseModal(course)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteCourse(course.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <Modal show={showCourseModal} onHide={closeCourseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentCourse ? "Edit Course" : "Add New Course"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCourseFormSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Course Name</Form.Label>
              <Form.Control
                type="text"
                value={courseFormData.courseName}
                onChange={(e) =>
                  setCourseFormData({
                    ...courseFormData,
                    courseName: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Course Code</Form.Label>
              <Form.Control
                type="text"
                value={courseFormData.courseCode}
                onChange={(e) =>
                  setCourseFormData({
                    ...courseFormData,
                    courseCode: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Class</Form.Label>
              <Form.Select
                name="class"
                value={courseFormData.class}
                onChange={(e) =>
                  setCourseFormData({
                    ...courseFormData,
                    class: e.target.value,
                  })
                }
                required
              >
                <option value="">Select Class</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Class {i + 1}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Section</Form.Label>
              <Form.Select
                name="section"
                value={courseFormData.section}
                onChange={(e) =>
                  setCourseFormData({
                    ...courseFormData,
                    section: e.target.value,
                  })
                }
                required
              >
                <option value="">Select Section</option>
                {["A", "B", "C", "D"].map((section) => (
                  <option key={section} value={section}>
                    Section {section}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit">
              {currentCourse ? "Save Changes" : "Add Course"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AllCourse;
