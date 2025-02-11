const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;
const DATA_FILE = "data.json";

app.use(cors());
app.use(bodyParser.json());

// Read student data
const readData = () => {
    if (!fs.existsSync(DATA_FILE)) return [];
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8") || "[]");
};

// Save student data
const saveData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// GET all students
app.get("/students", (req, res) => {
    res.json(readData());
});

// POST - Add a new student
app.post("/students", (req, res) => {
    const students = readData();
    students.push(req.body);
    saveData(students);
    res.json({ message: "Student added successfully!" });
});

// PUT - Update student data
app.put("/students/:rollNo", (req, res) => {
    let students = readData();
    const index = students.findIndex(student => student.rollNo === req.params.rollNo);

    if (index !== -1) {
        students[index] = { ...students[index], ...req.body };
        saveData(students);
        res.json({ message: "Student updated successfully!" });
    } else {
        res.status(404).json({ message: "Student not found!" });
    }
});

// DELETE - Remove a student
app.delete("/students/:rollNo", (req, res) => {
    let students = readData();
    const newStudents = students.filter(student => student.rollNo !== req.params.rollNo);

    if (students.length === newStudents.length) {
        return res.status(404).json({ message: "Student not found!" });
    }

    saveData(newStudents);
    res.json({ message: "Student deleted successfully!" });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
