// yyyy-mm-dd hh:mi
const datePartialTimeRegex =
  "^((19|20)[0-9]{2})-((0|1)[0-9])-((0|1|2|3)[0-9]) ([0-9]{2}):([0-9]{2})$";
// 55555 or 555554444 or 55555-4444
const zip5Plus4Regex = "(^[0-9]{5}$)|(^[0-9]{9}$)|(^[0-9]{5}-[0-9]{4}$)";

// "order" is not part of the draft-07 spec
const MyOtherCsvFileSchema = {
  type: "object",
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "MyOtherCsvFileSchema",
  title: "Other file definition",
  properties: {
    // "First Name": {
    //   type: "string",
    //   order: 0,
    // },
    Email: {
      type: "string",
      order: 2,
      format: "email",
    },
    "Address Zip": {
      type: "string",
      order: 7,
      oneOf: [
        {
          type: "string",
          maxLength: 0,
        },
        {
          type: "string",
          pattern: zip5Plus4Regex,
        },
      ],
    },
    "Created At": {
      type: "string",
      order: 10,
      pattern: datePartialTimeRegex,
    },
  },
  required: ["First Name", "Email"],
};

// Custom error messages
const MyOtherCsvFileSchemaMessages = {
  errors: {
    "Address Zip": {
      oneOf: "Address Zip must be Zip5/Zip9/Zip5-Zip4",
    },
  },
};

export { MyOtherCsvFileSchema, MyOtherCsvFileSchemaMessages };
