const express = require("express");
const cors = require("cors");
const db = require("../db/operations");

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/colleges_by_state", async (req, res) => {
  try {
    const collegeGroups = await db.groupCollegesByLocation();
    res.send(collegeGroups);
  } catch (err) {
   console.log(err);
    return res.sendStatus(500);
  }
});

app.get("/api/colleges_by_courses", async (req, res) => {
  try {
    const collegeGroups = await db.groupCollegesByCourses();
    res.send(collegeGroups);
  } catch (err) {
	  console.log(err);
    return res.sendStatus(500);
  }
});

app.post("/api/college_details", async (req, res) => {
  const { college } = req.body;
  try {
    const similarColleges = await db.findSimilarCollegesTo(college);
    const collegeDetails = await db.findCollegeById(college._id);
    const collegeStudents = await db.getStudentsInCollege(college._id);
    const resObject = {
      details: collegeDetails,
      similar: similarColleges,
      students: collegeStudents,
    };
    res.send(resObject);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
});

app.post("/api/student_details", async (req, res) => {
  const { student_id } = req.body;
  try {
    const studentDetails = await db.getStudentDetails(student_id);
    res.send(studentDetails);
  } catch (err) {
	  console.log(err);
    return res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
