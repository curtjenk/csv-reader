// yyyy-mm-dd hh:mi
const datePartialTime =
  "^((19|20)[0-9]{2})-((0|1)[0-9])-((0|1|2|3)[0-9]) ([0-9]{2}):([0-9]{2})$";
// 55555 or 555554444 or 55555-4444
const zip5Plus4 = "(^[0-9]{5}$)|(^[0-9]{9}$)|(^[0-9]{5}\\-?[0-9]{4}$)";
// 5 digits
const fiveDigits = "(^[0-9]{5}$)";
// Social security number
//https://www.geeksforgeeks.org/how-to-validate-ssn-social-security-number-using-regular-expression/
const ssnSSA =
  "^(?!666|000|9[0-9]{2})[0-9]{3}\\-?(?!00)[0-9]{2}\\-?(?!0{4})[0-9]{4}$)";
const ssnCommon = "^[0-9]{3}\\-?[0-9]{2}\\-?[0-9]{4}$";

const fein = "^[0-9]{2}\\-?[0-9]{7}$";
const dateMMDDYY_slash =
  /^([1-9]|0[1-9]|1[0-2])\/([1-9]|0[1-9]|1\d|2\d|3[01])\/\d{2}$/;

const lastCommaFirst = /^[A-Za-z]+\s*,\s*[A-Za-z]+\s*[()A-Za-z\s.]+$/;

const stateCode = /^[A-Z]{2}$/;

const Patterns = {
  datePartialTime,
  zip5Plus4,
  fiveDigits,
  ssnSSA,
  ssnCommon,
  fein,
  dateMMDDYY_slash,
  lastCommaFirst,
  stateCode,
};
export default Patterns;
