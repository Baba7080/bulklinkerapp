import React, { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom';
import Accounts from './Accounts';
import Template from './Templates';
import Messages from '../Dashboard/Messages';
const RouteComponent = () => {
    return (
        <Routes>
            {
                Object.values(components).map((it, index) => {
                    return <React.Fragment key={'routes_' + index}>{it}</React.Fragment>
                })
            }
        </Routes>

    )
}

const components = {
    home: <Route
        path="/"
        element={
            <Suspense fallback={<></>}>
                {/* <User /> */}
                <Accounts />
            </Suspense>
        } />,
    homea: <Route
        path="/Accounts"
        element={
            <Suspense fallback={<></>}>
                {/* <User /> */}
                <Accounts />
            </Suspense>
        } />,
    Templates: <Route
        path="/Templates"
        element={
            <Suspense fallback={<></>}>
                {/* <User /> */}
                <Template />
            </Suspense>
        } />,
    Messaging: <Route
        path="/Messaging"
        element={
            <Suspense fallback={<></>}>
                {/* <User /> */}
                <Messages />
            </Suspense>
        } />,


    // noPageFound: <Route
    //     path='*'
    //     element={
    //         <Suspense fallback={<></>}>
    //             <NoPageFound />
    //         </Suspense>
    //     }
    // />
}


export default RouteComponent