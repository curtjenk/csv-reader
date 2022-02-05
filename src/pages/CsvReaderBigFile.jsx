import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import { useCSVReader } from "react-papaparse";
import { Virtuoso } from "react-virtuoso";
import convertToYup from "json-schema-yup-transformer";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { Container, Row, Col, InputGroup, FormControl } from "react-bootstrap";

import {
  MyCsvFileSchema,
  MyCsvFileSchemaMessages,
} from "../file_schemas/MyCsvFileSchema";
import { useStateWithCallback } from "../customHooks/useStateWithCallBack.hook";

import { Schemas, SchemasIndex } from "../file_schemas/Schemas";

const styles = {
  csvReader: {
    display: "flex",
    flexDirection: "row",
    marginTop: 10,
    marginRight: 40,
    marginBottom: 10,
    marginLeft: 40,
  },
  browseFile: {
    width: "15%",
    backgroundColor: "red",
  },
  acceptedFile: {
    border: "1px solid #ccc",
    height: 30,
    lineHeight: 1.5,
    paddingLeft: 10,
    width: "60%",
  },
  remove: {
    borderRadius: 0,
    padding: "0 20px",
    backgroundColor: "red",
  },
  progressBarBackgroundColor: {
    backgroundColor: "red",
  },
};

const maxErrors = 1000;

export default function CSVReaderBigFile() {
  const { CSVReader } = useCSVReader();
  const [headers, setHeaders] = useState([]);
  const [rows, setRows] = useState([]);
  const [rowNum, setRowNum] = useState(-1);
  const ref = React.useRef(null);
  const errorsRef = React.useRef(null);
  const [visible, setVisible] = React.useState(true);
  const [selSchemaNdx, setselSchemaNdx] = useState("-1");
  const [validationErrors, setValidationErrors] = useState([]);
  const [validating, setValidating] = useStateWithCallback(false, 10);

  // useEffect(() => {
  //   validationErrors.forEach((e) => console.log(e));
  // }, [validationErrors]);

  const showTable = (results) => {
    const [headers, ...data] = results.data;
    setHeaders(headers);
    setRows(data);
  };

  const validate = async () => {
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
    const { properties } = MyCsvFileSchema;
    Object.keys(properties).forEach((key) => {
      const prop = properties[key];
      const ndx = headers.findIndex((el) => el === key);
      if (ndx === -1) {
        headerErrors.push(`${key}: Missing`);
      } else if (prop.order !== ndx) {
        headerErrors.push(`${key}: Expected at ${prop.order} Found at ${ndx}`);
      }
    });
    if (headerErrors.length > 0) {
      return false;
    }
    setValidationErrors(headerErrors);
    return true;
  };

  const validateData = async () => {
    const dataErrors = [];
    const yupschema = convertToYup(
      Schemas[selSchemaNdx].schema,
      Schemas[selSchemaNdx].messages
    );
    for (let i = 0; i < rows.length; i++) {
      if (dataErrors.length > maxErrors) break;
      try {
        await yupschema.validate(convertRowToJson(rows[i]), {
          abortEarly: false,
        });
      } catch (error) {
        dataErrors.push([i, error.errors.join("; ")]);
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
      <CSVReader
        config={{ header: false }}
        onUploadAccepted={(results) => showTable(results)}
      >
        {({ getRootProps, acceptedFile, ProgressBar, getRemoveFileProps }) => (
          <>
            <div style={styles.csvReader}>
              <button
                type="button"
                {...getRootProps()}
                style={styles.browseFile}
              >
                Browse file
              </button>
              <div style={styles.acceptedFile}>
                {acceptedFile && acceptedFile.name}
              </div>
              <button {...getRemoveFileProps()} style={styles.remove}>
                Remove
              </button>
            </div>
            <ProgressBar style={styles.progressBarBackgroundColor} />
          </>
        )}
      </CSVReader>
      <Container>
        <Row>
          <Col md={4}>
            <Form.Select
              aria-label="Select File/Schema Type"
              onChange={(event) => setselSchemaNdx(event.target.value)}
            >
              <option key="-1" value="-1">
                Select File Type
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
            {/* <Row>
              <Col md={2}>
                <Button onClick={() => setVisible(!visible)}>
                  {visible ? "Hide" : "Show"}
                </Button>
              </Col>
            </Row> */}
          </Col>
          <Col>
            <Virtuoso
              ref={errorsRef}
              style={{ height: 200 }}
              totalCount={validationErrors.length}
              components={{
                List: React.forwardRef(({ children, style }, errorsRef) => {
                  return (
                    <table
                      style={{
                        "--virtuosoPaddingTop": (style?.paddingTop ?? 0) + "px",
                        "--virtuosoPaddingBottom":
                          (style?.paddingBottom ?? 0) + "px",
                      }}
                    >
                      <thead>
                        <tr>
                          <th>Row</th>
                          <th>Error(s)</th>
                        </tr>
                      </thead>
                      <tbody ref={errorsRef}>{children}</tbody>
                    </table>
                  );
                }),
                Item: useMemo(
                  () => (props) => {
                    const row = validationErrors[props["data-index"]];
                    return (
                      <tr {...props}>
                        <td
                          onClick={() =>
                            ref.current.scrollToIndex({
                              index: row[0],
                              align: "start",
                            })
                          }
                        >
                          {row[0]}
                        </td>
                        <td
                          onClick={() =>
                            ref.current.scrollToIndex({
                              index: row[0],
                              align: "start",
                            })
                          }
                        >
                          {row[1]}
                        </td>
                      </tr>
                    );
                  },
                  [validationErrors]
                ),
              }}
            />
          </Col>
        </Row>
      </Container>
      {/* Data below */}
      <div style={{ margin: "20px" }}>
        <Virtuoso
          ref={ref}
          style={{ height: 405 }}
          // style={{ height: 405, display: visible ? "block" : "none" }}
          totalCount={rows.length}
          components={{
            List: React.forwardRef(({ children, style }, ref) => {
              return (
                <table
                  style={{
                    "--virtuosoPaddingTop": (style?.paddingTop ?? 0) + "px",
                    "--virtuosoPaddingBottom":
                      (style?.paddingBottom ?? 0) + "px",
                  }}
                >
                  <thead>
                    <tr>
                      <th>Row</th>
                      {headers.map((col, index) => (
                        <th key={index}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody ref={ref}>{children}</tbody>
                </table>
              );
            }),
            Item: useMemo(
              () => (props) => {
                const row = rows[props["data-index"]];
                return (
                  <tr {...props}>
                    <td>{props["data-index"]}</td>
                    {headers.map((col, index) => (
                      <td key={props["data-index"] + index}>{row[index]}</td>
                    ))}
                  </tr>
                );
              },
              [headers, rows]
            ),
          }}
        />
      </div>
    </>
  );
}
