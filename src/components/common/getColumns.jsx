import { Tooltip } from "antd";
import React from "react";

export const getColumns = (columns) => {
  return columns.map((column) => {
    if (!column.render) {
      return {
        ...column,
        render: (text) => {
          return (
            <Tooltip title={text}>
              <span
                style={{
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                {text}
              </span>
            </Tooltip>
          );
        },
      };
    }
    return column;
  });
};
