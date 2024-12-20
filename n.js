let a = {

    time: '13/12/2024, 2:26:11 am',
    sbp: 99,
    dbp: 99,
    weight: 99,
    __v: 0
  }
let b = {

    time: '5/12/2024, 4:52:23 pm',
    sbp: 120,
    dbp: 80,
    weight: 65,
    __v: 0
  }
const timeString = a.time;
const [datePart, timePart] = timeString.split(", ");
const [hour, minute, second] = timePart.split(" ")[0].split(":");
let [day, month, year] = datePart.split("/");
const timeObject = new Date(year, month-1, day, hour, minute, second);

console.log(timeObject)


