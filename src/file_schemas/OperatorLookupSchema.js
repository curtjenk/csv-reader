import Patterns from "./Patterns";

// "order" is not part of the draft-07 spec
const OperatorLookupSchema = {
  type: "object",
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "OperatorLookup",
  title: "Operator Lookup",
  properties: {
    MONTHEND_DATE: {
      type: "string",
      order: 0,
      pattern: Patterns.dateMMDDYY_slash,
    },
    LOCATION_CODE: {
      type: "string",
      order: 1,
      pattern: Patterns.fiveDigits,
    },
    TYPE: {
      type: "string",
      order: 2,
      oneOf: [
        {
          type: "string",
          const: "Company Owned",
        },
        {
          type: "string",
          const: "Operator Run",
        },
      ],
    },
    OPERATOR_NUM: {
      type: "string",
      order: 3,
    },
    LAST_NAME: {
      type: "string",
      order: 4,
    },
    FIRST_NAME: {
      type: "string",
      order: 5,
    },
    ADDRESS_1: {
      type: "string",
      order: 6,
    },
    ADDRESS_2: {
      type: "string",
      order: 7,
    },
    ADDRESS_3: {
      type: "string",
      order: 8,
    },
    CITY: {
      type: "string",
      order: 9,
    },
    STATE: {
      type: "string",
      order: 10,
      pattern: Patterns.stateCode,
    },
    ZIP: {
      type: "string",
      order: 11,
      pattern: Patterns.fiveDigits,
    },
    GRE_NAME: {
      type: "string",
      order: 12,
    },
    FEIN: {
      type: "string",
      order: 13,
    },
    SSN: {
      type: "string",
      order: 14,
    },
  },
  required: [
    "MONTHEND_DATE",
    "LOCATION_CODE",
    "TYPE",
    "OPERATOR_NUM",
    "LAST_NAME",
    "SSN",
  ],
};

// Custom error messages
const OperatorLookupSchemaMessages = {
  errors: {
    LOCATION_CODE: {
      pattern: "Location must be 5 digits",
    },
  },
};

export { OperatorLookupSchema, OperatorLookupSchemaMessages };
