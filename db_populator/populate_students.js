const { makeStudent } = require("../db/operations");
const { College } = require("../db/models");
const { skills } = require("./dummy");

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

async function populate_students() {
  let college_ids_query = College.find({}).select("_id");
  let college_ids;
  try {
    college_ids = await college_ids_query.exec();
  } catch (err) {
    console.error(err);
  }
  college_ids.forEach(async (college) => {
    for (let i = 1; i <= 100; i++) {
      const stu_name = `Student ${i}`;
      const stu_batch = getRandomInt(2015, 2021).toString();
      const stu_college = college._id;
      shuffle(skills);
      const lower = getRandomInt(0, skills.length / 4);
      const upper = getRandomInt(
        lower,
        Math.min(skills.length - 1, lower + getRandomInt(3, 10))
      );
      const stu_skills = skills.slice(lower, upper + 1);
      try {
        makeStudent(stu_name, stu_batch, stu_college, stu_skills);
      } catch (err) {
        console.error(err);
      }
    }
  });
}

populate_students();
