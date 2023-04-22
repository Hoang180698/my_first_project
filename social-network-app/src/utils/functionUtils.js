import moment from "moment";

// Format date
export const formatDate = (dateString) => {
  const date = new Date(dateString);

  // 1/1/2023 => 01/01/2023
  // 01 => 01
  // 020 => 20
  // const year = date.getFullYear();
  // const month = `0${date.getMonth() + 1}`.slice(-2);
  // const day = `0${date.getDate()}`.slice(-2);
  // const hour = date.getHours();
  // const min = date.getMinutes();

  const c = moment() - date;

  const b = Math.floor(c / 60 / 1000);

  if (b == 0) {
    return "now";
  } else if (b > 0 && b < 60) {
    return b + "m";
  } else if (b / 60 < 24) {
    return Math.floor(b / 60) + "h";
  } else if (b / 60 / 24 < 10) {
    return Math.floor(b / 60 / 24) + "d";
  } else {
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    return `${day}-${month}-${year}`;
  }

  // return moment(`${day}-${month}-${year} ${hour}:${min}`, "DD-MM-YYYY h:mm").fromNow();
  // return c/60/1000;
};

export const formatDateTime = (dateString) => {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    const hour = date.getHours();
    const min = `0${date.getMinutes()}`.slice(-2);
    return `${day}-${month}-${year} at ${hour}:${min}`;
}
