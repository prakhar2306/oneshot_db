require("./connector");
const { College, Student } = require("./models");
const mongoose = require("mongoose");

async function makeStudent(name, batch, college_id, skills) {
  if (!name || !batch || !college_id || !skills || !Array.isArray(skills)) {
    throw "Some required data is missing";
  }
  const ns = new Student({
    name: name,
    batch: batch,
    college_id: college_id,
    skills: skills,
  });
  await ns.save((err) => {
    if (err) throw err;
  });
}

async function makeCollege(name, founded, city, state, country, courses) {
  if (
    !name ||
    !founded ||
    !city ||
    !state ||
    !country ||
    !courses ||
    !Array.isArray(courses)
  ) {
    throw "Some required data is missing";
  }
  const nc = new College({
    name: name.toString(),
    founded: founded.toString(),
    city: city.toString(),
    state: state.toString(),
    country: country.toString(),
    courses: courses.map((course) => course.toString()),
  });
  await nc.save();
}

async function findSimilarCollegesTo(college) {
  if (!college) {
    throw "Some required data is missing";
  }
  const response = await College.aggregate([
    {
      $project: {
        _id: 1,
        num_students: 1,
        name: 1,
        founded: 1,
        city: 1,
        state: 1,
        country: 1,
        courses: 1,
        courseMatch: {
          $gt: [
            {
              $size: {
                $setIntersection: [college.courses, "$courses"],
              },
            },
            2,
          ],
        },
        countryMatch: {
          $cond: [
            {
              $eq: ["$country", college.country],
            },
            true,
            false,
          ],
        },
        stateMatch: {
          $cond: [
            {
              $eq: ["$state", college.state],
            },
            true,
            false,
          ],
        },
        cityMatch: {
          $cond: [
            {
              $eq: ["$city", college.city],
            },
            true,
            false,
          ],
        },
        notSimilar: {
          $ne: ["$_id", mongoose.Types.ObjectId(college._id.$oid)],
        },
      },
    },
    {
      $match: {
        $or: [
          {
            $or: [
              {
                cityMatch: true,
              },
              {
                city: "",
              },
            ],
          },
          {
            $or: [
              {
                stateMatch: true,
              },
              {
                state: "",
              },
            ],
          },
          {
            $or: [
              {
                countryMatch: true,
              },
              {
                country: "",
              },
            ],
          },
        ],
        $and: [
          {
            courseMatch: true,
          },
          {
            notSimilar: true,
          },
        ],
      },
    },
    {
      $match: {
        num_students: {
          $gt: college.num_students - 100,
          $lte: college.num_students + 100,
        },
      },
    },
    {
      $sort: {
        countryMatch: -1,
        stateMatch: -1,
        cityMatch: -1,
        state: 1,
        city: 1,
      },
    },
    {
      $project: {
        _id: 1,
        num_students: 1,
        name: 1,
        founded: 1,
        city: 1,
        state: 1,
        country: 1,
        courses: 1,
      },
    },
    {
      $sort: {
        "_id.cityMatch": -1,
        "_id.stateMatch": -1,
      },
    },
  ]).exec();
  return response;
}

async function groupCollegesByLocation() {
  const response = await College.aggregate([
    {
      $group: {
        _id: {
          state: "$state",
          country: "$country",
        },
        colleges: {
          $push: {
            _id: "$_id",
            name: "$name",
            num_students: "$num_students",
            courses: "$courses",
            founded: "$founded",
            city: "$city",
            state: "$state",
            country: "$country",
          },
        },
      },
    },
  ]).exec();
  return response;
}

async function groupCollegesByCourses() {
  const response = await College.aggregate([
    {
      $project: {
        num_students: 1,
        courses: 1,
        name: 1,
        queryCourses: "$courses",
        founded: 1,
        city: 1,
        state: 1,
        country: 1,
      },
    },
    {
      $unwind: {
        path: "$queryCourses",
      },
    },
    {
      $group: {
        _id: {
          courses: "$queryCourses",
        },
        colleges: {
          $push: {
            _id: "$_id",
            name: "$name",
            num_students: "$num_students",
            founded: "$founded",
            city: "$city",
            state: "$state",
            country: "$country",
            courses: "$courses",
          },
        },
      },
    },
  ]).exec();
  return response;
}

async function findCollegeById(id) {
  if (!id) {
    throw "Some required data is missing";
  }
  const response = await College.findById(id);
  return response;
}

async function findCollegeByName(name) {
  if (!name) {
    throw "Some required data is missing";
  }
  const response = await College.findOne({ name: name });
  return response;
}

async function getStudentsInCollege(college_id) {
  if (!college_id) {
    throw "Some required data is missing";
  }
  const response = await Student.find({ college_id: college_id });
  return response;
}

async function getStudentDetails(student_id) {
  if (!student_id) throw "Some required data is missing";
  const response = await Student.findById(student_id)
    .populate("college_id")
    .exec();
  return response;
}

module.exports = {
  makeCollege,
  makeStudent,
  findSimilarCollegesTo,
  groupCollegesByCourses,
  groupCollegesByLocation,
  findCollegeById,
  findCollegeByName,
  getStudentsInCollege,
  getStudentDetails,
};
