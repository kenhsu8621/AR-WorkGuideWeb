export function GetDatetimeString(date) {
  try {
    if (Number.isInteger(date)) date = new Date(date);
    if (isNaN(date.getTime())) return "";
    return (
      date.getFullYear() +
      "/" +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      "/" +
      ("0" + date.getDate()).slice(-2) +
      " " +
      ("0" + date.getHours()).slice(-2) +
      ":" +
      ("0" + date.getMinutes()).slice(-2) +
      ":" +
      ("0" + date.getSeconds()).slice(-2)
    );
  } catch (e) {
    return "";
  }
}
export function GetDateString(date) {
  try {
    if (Number.isInteger(date) && date > 0) date = new Date(date);
    if (isNaN(date.getTime())) return "";
    return date.getFullYear() + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + ("0" + date.getDate()).slice(-2);
  } catch (e) {
    return "";
  }
}
export function GetHmsByTotalSeconds(totalSecond) {
  let seconds = ("0" + Math.floor(totalSecond % 60)).slice(-2);
  totalSecond /= 60;

  let minutes = ("0" + Math.floor(totalSecond % 60)).slice(-2);
  totalSecond /= 60;

  let hours = ("0" + Math.floor(totalSecond)).slice(-2);

  return `${hours}:${minutes}:${seconds}`;
}
