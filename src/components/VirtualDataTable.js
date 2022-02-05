import React, { useMemo, forwardRef } from "react";
import { Virtuoso } from "react-virtuoso";

const VirtualDataTable = (props, ref) => {
  return (
    <Virtuoso
      ref={ref}
      style={{ height: 405 }}
      totalCount={props.rows.length}
      components={{
        List: React.forwardRef(({ children, style }, ref) => {
          return (
            <table
              style={{
                "--virtuosoPaddingTop": (style?.paddingTop ?? 0) + "px",
                "--virtuosoPaddingBottom": (style?.paddingBottom ?? 0) + "px",
              }}
            >
              <thead>
                <tr>
                  <th>Row</th>
                  {props.headers.map((col, index) => (
                    <th key={index}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody ref={ref}>{children}</tbody>
            </table>
          );
        }),
        Item: useMemo(
          () => (itemProps) => {
            const row = props.rows[itemProps["data-index"]];
            return (
              <tr {...itemProps}>
                <td>{itemProps["data-index"]}</td>
                {props.headers.map((col, index) => (
                  <td key={itemProps["data-index"] + index}>{row[index]}</td>
                ))}
              </tr>
            );
          },
          [props.headers, props.rows]
        ),
      }}
    />
  );
};

export default forwardRef(VirtualDataTable);
