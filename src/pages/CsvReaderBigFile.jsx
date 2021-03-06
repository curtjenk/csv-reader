import React from "react";
import { useState } from "react";
import convertToYup from "json-schema-yup-transformer";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { Container, Row, Col, InputGroup, FormControl } from "react-bootstrap";

import { useStateWithCallback } from "../customHooks/useStateWithCallBack.hook";
import { Schemas, SchemasIndex } from "../file_schemas/Schemas";
import GenericCsvReader from "../components/GenericCsvReader";
import VirtualDataTable from "../components/VirtualDataTable";
import VirtualErrorsTable from "../components/VirtualErrorsTable";

const maxErrors = 1000;
let customFuncs = [];

export default function CSVReaderBigFile() {
  const [headers, setHeaders] = useState([]);
  const [rows, setRows] = useState([]);
  const [rowNum, setRowNum] = useState(-1);
  const ref = React.useRef(null);
  const errorsRef = React.useRef(null);
  const [selSchemaNdx, setselSchemaNdx] = useStateWithCallback("-1", 2);
  const [validationErrors, setValidationErrors] = useState([]);
  const [validating, setValidating] = useStateWithCallback(false, 10);

  const onChangeSchemaSel = (event) => {
    // console.log("select changed", event.target.value);
    setValidationErrors([]);
    setselSchemaNdx(event.target.value, (schemaNdx) => {
      console.log("ndx = ", schemaNdx);
      customFuncs = getCustomFuncs(schemaNdx);
    });
  };

  const setCsvData = (results) => {
    const [headers, ...data] = results.data;
    setHeaders(headers);
    setRows(data);
    setValidationErrors([]);
  };

  const validate = async () => {
    setValidationErrors([]);
    setValidating(true, validateFlow);
  };

  const validateFlow = async () => {
    if (validateHeaders()) {
      await validateData();
    }
    setValidating(false);
  };

  const validateHeaders = () => {
    const headerErrors = [];
    const { properties } = Schemas[selSchemaNdx].schema;
    Object.keys(properties).forEach((key) => {
      const prop = properties[key];
      const ndx = headers.findIndex((el) => el === key);
      if (ndx === -1) {
        headerErrors.push([key, "Missing"]);
      } else if (prop.order !== ndx) {
        headerErrors.push([key, `Expected at ${prop.order} Found at ${ndx}`]);
      }
    });
    setValidationErrors(headerErrors);
    if (headerErrors.length > 0) {
      return false;
    }
    return true;
  };

  const getCustomFuncs = (schemaNdx) => {
    const { properties } = Schemas[schemaNdx].schema;
    let customFuncs = [];
    Object.keys(properties).forEach((key) => {
      const prop = properties[key];
      if (prop.custom && typeof prop.custom === "function") {
        customFuncs.push({
          order: prop.order,
          header: headers[prop.order],
          func: prop.custom,
        });
      }
    });
    return customFuncs;
  };

  const validateCustom = (rowNdx, colArray) => {
    const dataErrors = [];
    for (let i = 0; i < customFuncs.length; i++) {
      const { msg, isValid } = customFuncs[i].func(
        colArray[customFuncs[i].order]
      );
      if (!isValid) {
        dataErrors.push(`${customFuncs[i].header} : ${msg}`);
      }
    }
    return dataErrors;
  };

  const validateData = async () => {
    const dataErrors = [];
    const yupschema = convertToYup(
      Schemas[selSchemaNdx].schema,
      Schemas[selSchemaNdx].messages
    );
    for (let i = 0; i < rows.length; i++) {
      if (dataErrors.length > maxErrors) break;
      let iterationErrors = [];
      const customErrors = validateCustom(i, rows[i]);
      if (customErrors.length > 0) {
        iterationErrors.push(...customErrors);
      }
      try {
        await yupschema.validate(convertRowToJson(rows[i]), {
          abortEarly: false,
        });
      } catch (error) {
        iterationErrors.push(...error.errors);
      }
      if (iterationErrors.length > 0) {
        dataErrors.push([i, iterationErrors.join("; ")]);
      }
    }

    setValidationErrors([...validationErrors, ...dataErrors]);
  };

  const convertRowToJson = (row) => {
    const res = row.reduce((acc, item, index) => {
      acc[headers[index]] = item;
      return acc;
    }, {});
    return res;
  };

  return (
    <>
      <Container>
        <Row>
          <Col md={6} className="ps-0 mt-3">
            <GenericCsvReader uploadAccepted={setCsvData} />
            <br />
          </Col>
          <Col md={4} className="ps-0 mt-3">
            <Form.Select
              style={{ lineHeight: "1.0" }}
              aria-label="Select File/Schema Type"
              onChange={onChangeSchemaSel}
            >
              <option key="-1" value="-1">
                --Select File Type--
              </option>
              {SchemasIndex.map((s) => (
                <option key={s.ndx} value={s.ndx}>
                  {s.title}
                </option>
              ))}
            </Form.Select>
            <br />
          </Col>
        </Row>
        <Row>
          <Col md={2}>
            <Row>
              <Button
                variant="primary"
                disabled={
                  validating || rows.length === 0 || selSchemaNdx === "-1"
                }
                onClick={() => validate()}
              >
                {validating && (
                  <Spinner
                    as="span"
                    animation="grow"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                )}
                Validate
              </Button>
            </Row>
            <Row className="mt-1">
              <InputGroup
                className="p-0"
                onChange={(e) => setRowNum(e.target.value)}
              >
                <Button
                  variant="primary"
                  onClick={() =>
                    ref.current.scrollToIndex({
                      index: rowNum,
                      align: "start",
                    })
                  }
                >
                  Go To
                </Button>
                <FormControl />
              </InputGroup>
            </Row>
          </Col>
          <Col>
            <VirtualErrorsTable
              ref={errorsRef}
              dataTableRef={ref}
              errors={validationErrors}
            />
          </Col>
        </Row>
      </Container>
      <div style={{ margin: "15px" }}>
        {rows.length > 0 && <h6>File contains {rows.length} rows</h6>}
        <VirtualDataTable ref={ref} headers={headers} rows={rows} />
      </div>
    </>
  );
}
