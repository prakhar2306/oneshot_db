const { Schema } = require("mongoose");

const capitalize = (place) => {
  const lowerPlace = place.toLowerCase();
  const splitPlace = lowerPlace.split(" ");
  let retString = "";
  splitPlace.forEach((str, idx) => {
    retString +=
      str.charAt(0).toUpperCase() +
      str.slice(1) +
      (idx != splitPlace.length - 1 ? " " : "");
  });
  return retString;
};

const collegeSchema = new Schema({
  name: { type: String, required: true },
  founded: { type: String, immutable: true },
  city: { type: String, required: true, set: capitalize },
  state: { type: String, required: true, set: capitalize },
  country: { type: String, required: true, set: capitalize },
  num_students: { type: Number, default: 100 },
  courses: { type: [String], required: true },
});

const studentSchema = new Schema({
  name: { type: String, required: true, set: capitalize, immutable: true },
  batch: { type: String, required: true },
  college_id: { type: Schema.Types.ObjectId, ref: "College", required: true },
  skills: { type: [String] },
});

module.exports = {
  studentSchema,
  collegeSchema,
};
