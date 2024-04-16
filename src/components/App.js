import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './login/Login';
import UserManagement from './userManagement/UserManagement';
import ProtectedRoute from './protectedRoute/ProtectedRoute';
import AdminRegistration from './adminRegistration/AdminRegistration';
import UserSearchResults from './searchResult/UserSearchResult';
import PublicRoute from './protectedRoute/PublicRoute';
import CourseManagement from './courseManagement/CourseManagement';
import CourseForm from './courseManagement/courseForm/AddNewCourseForm';

const routes = [
  { path: '/', element: <Login />, protected: false },
  { path: '/UserManagement', element: <UserManagement />, protected: true },
  { path: '/AdminRegistration', element: <AdminRegistration />, protected: true },
  { path: '/UserManagement/search-results', element: <UserSearchResults />, protected: true },
  { path: '/CourseManagement', element: <CourseManagement />, protected: true },
  { path: '/CourseManagement/CourseInput', element: <CourseForm />, protected: true },
  { path: '/CourseManagement/EditCourse/:courseId', element: <CourseForm isEditMode={true} />, protected: true },
  { path: '/TransactionOversight', element: <UserManagement />, protected: true },
  { path: '/AnalyticsandReporting', element: <UserManagement />, protected: true },
];


function App() {
  return (
      <Routes>
        {routes.map((route) => {
          const { path, element, protected: isProtected } = route;
          if (!isProtected) {
            return  <Route key={path} path={path} element={<PublicRoute>{element}</PublicRoute>} />;
          } 

          return (
            <Route
              key={path}
              path={path}
              element={isProtected ? <ProtectedRoute>{element}</ProtectedRoute> : element}
            />
          );
        })}
      </Routes>
  )
}

export default App;
