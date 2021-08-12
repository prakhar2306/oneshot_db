const { model } = require("mongoose");
const { collegeSchema, studentSchema } = require("./schemas");

const College = model("College", collegeSchema);
const Student = model("Student", studentSchema);

module.exports = {
    College,
    Student,
};
