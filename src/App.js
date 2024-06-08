import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Panel from './pages/Panel';
import Auth from './pages/Auth';
const App = () => {
  return (
    <React.Fragment>
      <Routes> {/* Use Routes instead of Switch */}
        <Route
          path="/auth"
          element={
            <Suspense fallback={<></>}>
              <Auth />
            </Suspense>
          }>
          <Route path="*" element={<>NO Page Found 2</>} />
        </Route>
        <Route
          path="/panel/:uid/*"
          element={
            <Suspense fallback={<></>}>
              <Panel />
            </Suspense>
          }>
          <Route path="*" element={<>NO Page Found 2</>} />
        </Route>
        <Route path="/" element={<Auth />} />
        <Route path="*" element={<Navigate to={'/auth'} />} />
      </Routes>
      {/* <Footer /> */}
    </React.Fragment>
  );
};

export default (App);
