import RootLayout from "../components/Layout/RootLayout.jsx";
import Login from "../components/Login/index.jsx";
import Error from "../components/ErrorPage/index.jsx";
import DashBoard from "../components/pages/DashBoard/index.jsx";
import SystemManage from "../components/pages/SystemManage/index.jsx";
import UserManage from "../components/pages/SystemManage/UserManage.jsx";
import Test from "../components/Test/index.jsx";
import InformationBoard from "../components/pages/InformationBoard/index.jsx";
import KeyManage from "../components/pages/KeyManage/index.jsx";
import AboutUs from "../components/pages/SystemManage/AboutUs.jsx";
import InformationBoardManage from "../components/pages/SystemManage/InformationBoardManage/index.jsx";

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
            path: "/KeyManage",
            element: <KeyManage />,
          },
          {
            path: "/InformationBoard",
            element: <InformationBoard />,
          },
          {
            path: "/SystemManage",
            element: <SystemManage />,
            children: [
              {
                element: <InformationBoardManage />,
                index: true,
              },
              {
                path: "UserManage",
                element: <UserManage />,
              },
              {
                path: "AboutUs",
                element: <AboutUs />,
              },
              // {
              //   path: "MessageManage",
              //   element: <MessageManage />,
              // },
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
