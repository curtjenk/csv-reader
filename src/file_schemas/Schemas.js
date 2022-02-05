import { MyCsvFileSchema, MyCsvFileSchemaMessages } from "./MyCsvFileSchema";
import {
  MyOtherCsvFileSchema,
  MyOtherCsvFileSchemaMessages,
} from "./MyOtherCsvFileSchema";

// -
// Collect all schemas here
// -
const Schemas = [];
Schemas.push({ schema: MyCsvFileSchema, messages: MyCsvFileSchemaMessages });
Schemas.push({
  schema: MyOtherCsvFileSchema,
  messages: MyOtherCsvFileSchemaMessages,
});

const SchemasIndex = Schemas.map((s, ndx) => {
  return { ndx: ndx, title: s.schema.title };
});

export { Schemas, SchemasIndex };
