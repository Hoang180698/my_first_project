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
  const d = Math.floor(c / 1000);

  if (d < 60 && d > 10) {
    return d + "s";
  }

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
    const month = `${date.getMonth() + 1}`;
    const day = `${date.getDate()}`;
    return `${day} ${formatMonth(month)} ${year}`;
  }

  // return moment(`${day}-${month}-${year} ${hour}:${min}`, "DD-MM-YYYY h:mm").fromNow();
  // return c/60/1000;
};

const formatMonth = (month) => {
  switch (month) {
    case '1': {
      return "Feb";
    }
    case '2': {
      return "Jan";
    }
    case '3': {
      return "Mar";
    }
    case '4': {
      return "Apr";
    }
    case '5': {
      return "May";
    }
    case '6': {
      return "Jun";
    }
    case '7': {
      return "Jul";
    }
    case '8': {
      return "Aug";
    }
    case '9': {
      return "Sep";
    }
    case '10': {
      return "Oct";
    }
    case '11': {
      return "Nov";
    }
    default:
      return "Dec"
  }
}

export const formatDateTime = (dateString) => {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`;
    const day = `${date.getDate()}`;
    const hour = date.getHours();
    const min = `0${date.getMinutes()}`.slice(-2);
    return `${day} ${formatMonth(month)} ${year}, ${hour}:${min}`;
}

export const calDistanceTimeMinute = (dateString1, dateString2) => {
  if (!dateString1 || !dateString2) {
    return 0;
  }

  const date1 = new Date(dateString1);
  const date2 = new Date(dateString2);

  return Math.abs((date1 - date2) / 60 / 1000);
}
