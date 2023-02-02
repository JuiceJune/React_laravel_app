import {createBrowserRouter} from "react-router-dom";
import Login from "./views/auth/Login.jsx";
import Signup from "./views/auth/Signup.jsx";
import Users from "./views/users/Users.jsx";
import NotFound from "./views/NotFound";
import DefaultLayout from "./components/defaultLayout.jsx";
import GuestLayout from "./components/GuestLayout.jsx";
import Dashboard from "./views/dashboard/Dashboard.jsx";
import UserForm from "./views/users/UserForm.jsx";
import Calendar from "./views/calendar/Calendar.jsx";

const router = createBrowserRouter([
    {
      path: '/',
      element: <DefaultLayout/>,
      children: [
          {
              path: '/',
              element: <Calendar />
          },
          {
              path: '/dashboard',
              element: <Dashboard />
          },
          {
              path: '/calendar',
              element: <Calendar />
          },
          {
              path: '/users',
              element: <Users />
          },
          {
              path: '/users/new',
              element: <UserForm key="userCreate" />
          },
          {
              path: '/users/:id',
              element: <UserForm key="userUpdate" />
          }
      ]
    },
    {
      path: '/',
      element: <GuestLayout/>,
      children: [
          {
              path: '/login',
              element: <Login />
          },
          {
              path: '/signup',
              element: <Signup />
          },
      ]
    },
    {
        path: '*',
        element: <NotFound />
    }
])

export default router;
