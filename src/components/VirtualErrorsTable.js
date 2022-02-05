import React, { useMemo, forwardRef } from "react";
import { Virtuoso } from "react-virtuoso";

const VirtualErrorsTable = (props, ref) => {
  return (
    <Virtuoso
      ref={ref}
      style={{ height: 200 }}
      totalCount={props.errors.length}
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
                  <th>Error(s)</th>
                </tr>
              </thead>
              <tbody ref={ref}>{children}</tbody>
            </table>
          );
        }),
        Item: useMemo(
          () => (itemProps) => {
            const row = props.errors[itemProps["data-index"]];
            return (
              <tr {...itemProps}>
                <td
                  onClick={() =>
                    props.dataTableRef.current.scrollToIndex({
                      index: row[0],
                      align: "start",
                    })
                  }
                >
                  {row[0]}
                </td>
                <td
                  onClick={() =>
                    props.dataTableRef.current.scrollToIndex({
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
          [props.dataTableRef, props.errors]
        ),
      }}
    />
  );
};

export default forwardRef(VirtualErrorsTable);
