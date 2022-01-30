import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import { useCSVReader } from "react-papaparse";
import { Virtuoso } from "react-virtuoso";
import convertToYup from "json-schema-yup-transformer";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import {
  MyCsvFileSchema,
  MyCsvFileSchemaMessages,
} from "../file_schemas/MyCsvFileSchema";
import { useStateWithCallback } from "../customHooks/useStateWithCallBack.hook";

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
    width: "20%",
    backgroundColor: "red",
  },
  acceptedFile: {
    border: "1px solid #ccc",
    height: 45,
    lineHeight: 2.5,
    paddingLeft: 10,
    width: "80%",
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
  const [visible, setVisible] = React.useState(true);
  const [validationErrors, setValidationErrors] = useState([]);
  const [validating, setValidating] = useStateWithCallback(false, 10);

  useEffect(() => {
    validationErrors.forEach((e) => console.log(e));
  }, [validationErrors]);

  const showTable = (results) => {
    const [headers, ...data] = results.data;
    setHeaders(headers);
    setRows(data);
  };

  const validate = async () => {
    console.log("begin validation");
    setValidating(true, validateFlow);
  };

  const validateFlow = async () => {
    if (validateHeaders()) {
      await validateData();
    }
    setValidating(false);
    console.log("end validation");
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
    const yupschema = convertToYup(MyCsvFileSchema, MyCsvFileSchemaMessages);
    for (let i = 0; i < rows.length; i++) {
      if (dataErrors.length > maxErrors) break;
      try {
        await yupschema.validate(convertRowToJson(rows[i]), {
          abortEarly: false,
        });
      } catch (error) {
        dataErrors.push(`${i}:${error.errors.join("; ")}`);
      }
    }
    console.log("done");
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
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          // width: "100%",
          justifyContent: "center",
        }}
      >
        <div>
          <Button
            variant="primary"
            disabled={validating}
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
          {/* <div>
            <button onClick={() => validate()}>Validate</button>
          </div> */}
          <input onChange={(e) => setRowNum(e.target.value)} />
          <button
            onClick={() =>
              ref.current.scrollToIndex({ index: rowNum, align: "start" })
            }
          >
            Go
          </button>
          <button onClick={() => setVisible(!visible)}>
            {visible ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      <div style={{ margin: "20px" }}>
        <Virtuoso
          ref={ref}
          style={{ height: 400, display: visible ? "block" : "none" }}
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
                      <th>#</th>
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
