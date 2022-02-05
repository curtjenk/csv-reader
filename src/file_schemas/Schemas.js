import { BulkUploadSchema, BulkUploadSchemaMessages } from "./BulkUploadSchema";
import {
  OperatorLookupSchema,
  OperatorLookupSchemaMessages,
} from "./OperatorLookupSchema";

// -
// Collect all schemas here
// -
const Schemas = [];
Schemas.push({ schema: BulkUploadSchema, messages: BulkUploadSchemaMessages });
Schemas.push({
  schema: OperatorLookupSchema,
  messages: OperatorLookupSchemaMessages,
});

const SchemasIndex = Schemas.map((s, ndx) => {
  return { ndx: ndx, title: s.schema.title };
});

export { Schemas, SchemasIndex };
