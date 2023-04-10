import React, { useEffect, useRef } from "react";
import { ProTable } from "@ant-design/pro-components";
import { pagination } from "./pagination.js";
import { getColumns } from "./getColumns.jsx";
import { Button } from "antd";

function ComProTable(props) {
  const {
    getData,
    reload,
    selectedRowKeys,
    setSelectedRowKeys,
    selectedRows,
    setSelectedRows,
    columns,
    toolBarRender,
  } = props;

  useEffect(() => {
    ref.current.reload();
  }, [reload]);

  const ref = useRef(null);

  let cancelRowKeys = [];

  const onSelect = (record, selected) => {
    if (!selected) {
      cancelRowKeys = [record.id];
    }
  };

  const onMulSelect = (selected, selectedRows, changeRows) => {
    if (!selected) {
      cancelRowKeys = changeRows.map((item) => item.id);
    }
  };

  const onChange = (keys, rows) => {
    if (cancelRowKeys.length) {
      const newKeys = selectedRowKeys.filter(
        (item) => !cancelRowKeys.includes(item)
      );
      const newRows = selectedRows.filter((item) => {
        return newKeys.includes(item.id);
      });
      setSelectedRowKeys(newKeys);
      setSelectedRows(newRows);
      cancelRowKeys = [];
    } else {
      const newKeys = [...new Set(selectedRowKeys.concat(keys))];
      setSelectedRowKeys(newKeys);
      setSelectedRows(
        selectedRows.concat(rows).filter((item) => {
          return newKeys.includes(item.id);
        })
      );
    }
  };

  const rowSelection = {
    selectedRowKeys,
    selectedRows,
    onSelect,
    onSelectMultiple: onMulSelect,
    onSelectAll: onMulSelect,
    onChange,
  };

  return (
    <ProTable
      rowSelection={rowSelection}
      request={getData}
      actionRef={ref}
      reload={reload}
      rowKey="id"
      search={false}
      pagination={pagination}
      columns={getColumns(columns)}
      toolBarRender={toolBarRender}
      tableAlertRender={() => {
        return `已选择 ${selectedRowKeys.length} 项`;
      }}
      tableAlertOptionRender={() => {
        return (
          <a
            onClick={() => {
              setSelectedRowKeys([]);
              setSelectedRows([]);
            }}
          >
            取消选择
          </a>
        );
      }}
    />
  );
}

export default ComProTable;
