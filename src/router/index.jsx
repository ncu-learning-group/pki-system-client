import RootLayout from "../components/Layout/RootLayout.jsx";
import Login from "../components/Login/index.jsx";
import Error from "../components/ErrorPage/index.jsx";
import DashBoard from "../components/pages/DashBoard/index.jsx";
import DigitalSignature from "../components/pages/DigitalSignature/index.jsx";
import SystemManage from "../components/pages/SystemManage/index.jsx";
import UserManage from "../components/pages/SystemManage/UserManage.jsx";
import MessageManage from "../components/pages/SystemManage/MessageManage.jsx";
import Test from "../components/Test/index.jsx";

export const routerConfig = [
  {
    path: "/Login",
    element: <Login />,
  },
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <Error />,
    children: [
      {
        errorElement: <Error />,
        children: [
          {
            index: true,
            element: <DashBoard />,
          },
          {
            path: "/DigitalSignature",
            element: <DigitalSignature />,
          },
          {
            path: "/SystemManage",
            element: <SystemManage />,
            children: [
              {
                element: <UserManage />,
                index: true,
              },
              {
                path: "MessageManage",
                element: <MessageManage />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/test",
    element: <Test />,
  },
];
