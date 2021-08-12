const { places, courses } = require("./dummy");
const { makeCollege } = require("../db/operations");

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

for (let i = 1; i <= 100; i++) {
  let college_name = `College ${i}`;
  let college_founded = getRandomInt(1900, 2021).toString();
  const countries = Object.keys(places);
  college_country = countries[getRandomInt(0, countries.length - 1)];
  const states = Object.keys(places[college_country]);
  college_state = states[getRandomInt(0, states.length - 1)];
  const cities = places[college_country][college_state];
  college_city = cities[getRandomInt(0, cities.length - 1)];
  shuffle(courses);
  const lower = getRandomInt(0, courses.length / 4);
  const upper = getRandomInt(lower + 2, courses.length - 1);
  const college_courses = courses.slice(lower, upper + 1);
  try {
    makeCollege(
      college_name,
      college_founded,
      college_city,
      college_state,
      college_country,
      college_courses
    );
  } catch (err) {
    console.error(err);
  }
}
