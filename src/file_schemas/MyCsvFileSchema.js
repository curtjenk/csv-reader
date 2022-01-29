// yyyy-mm-dd hh:mi
const datePartialTimeRegex =
  "^((19|20)[0-9]{2})-((0|1)[0-9])-((0|1|2|3)[0-9]) ([0-9]{2}):([0-9]{2})$";

const MyCsvFileSchema = {
  type: "object",
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "MyCsvFileSchema",
  title: "Defines MyCsvFile layout",
  properties: {
    "First Name": {
      type: "string",
      order: 0,
    },
    Email: {
      type: "string",
      order: 2,
      format: "email",
    },
    "Address Zip": {
      order: 7,
      oneOf: [
        {
          type: "string",
          maxLength: 0,
        },
        {
          type: "string",
          minLength: 5,
          maxLength: 5,
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

export default MyCsvFileSchema;
