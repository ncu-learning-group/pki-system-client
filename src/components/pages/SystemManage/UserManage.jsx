import React from "react";
import { ProTable, TableDropdown } from "@ant-design/pro-components";
import { Button, Card } from "antd";
import { DownOutlined } from "@ant-design/icons";

function UserManage(props) {
  const valueEnum = {
    0: "close",
    1: "running",
    2: "online",
    3: "error",
  };
  const tableListDataSource = [];

  const creators = ["付小小", "曲丽丽", "林东东", "陈帅帅", "兼某某"];

  for (let i = 0; i < 5; i += 1) {
    tableListDataSource.push({
      key: i,
      name: creators[Math.floor(Math.random() * creators.length)],
      containers: Math.floor(Math.random() * 20),
      creator: creators[Math.floor(Math.random() * creators.length)],
      status: valueEnum[Math.floor(Math.random() * 10) % 4],
      createdAt: Date.now() - Math.floor(Math.random() * 100000),
      age: i + 20,
      memo:
        i % 2 === 1
          ? "很长很长很长很长很长很长很长的文字要展示但是要留下尾巴"
          : "简短备注文案",
    });
  }

  const columns = [
    {
      title: "序号",
      width: 80,
      render: (text, row, index) => index + 1,
    },
    {
      title: "用户名",
      width: 80,
      dataIndex: "name",
    },
    {
      title: "年龄",
      width: 80,
      dataIndex: "age",
    },
    {
      title: "创建者",
      width: 240,
      dataIndex: "creator",
      valueEnum: {
        all: { text: "全部" },
        付小小: { text: "付小小" },
        曲丽丽: { text: "曲丽丽" },
        林东东: { text: "林东东" },
        陈帅帅: { text: "陈帅帅" },
        兼某某: { text: "兼某某" },
      },
    },
    {
      title: "操作",
      width: 180,
      key: "option",
      valueType: "option",
      render: () => [
        <a key="link">编辑</a>,
        <a key="link2">删除</a>,
        // <TableDropdown
        //   key="actionGroup"
        //   menus={[
        //     { key: "copy", name: "复制" },
        //     { key: "delete", name: "删除" },
        //   ]}
        // />,
      ],
    },
  ];

  return (
    <ProTable
      dataSource={tableListDataSource}
      rowKey="key"
      pagination={{
        showQuickJumper: true,
      }}
      columns={columns}
      // search={false}
      dateFormatter="string"
      headerTitle="用户列表"
      toolBarRender={() => [
        <Button key="out">创建用户</Button>,
        <Button>删除用户</Button>,
      ]}
    />
  );
}

export default UserManage;
