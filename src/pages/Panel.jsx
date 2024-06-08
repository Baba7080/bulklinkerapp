import React, { useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import DI from '../core/DependencyInjection';
import { parseJwt } from '../utils/jwt';
import Layout from '../components/Panel/Layout';
import RouteComponent from '../components/Panel/RouteComponent';

const Panel = (props) => {
    useEffect(() => {
        let token = props.globalState.get("auth_token");
        if (props.user.get("login") === false) {
            props.globalState.remove("auth_token");
        } else if (!props.globalState.get("auth_token")) {
            props.user.set({ user_details: {}, login: false });
            props.di.PUSH("/auth")
        } else {
            let { userId, role, exp } = parseJwt(token);
            if (Date.now() > exp * 1000) {
                props.user.set({ user_details: {}, login: false });
                props.di.PUSH("/auth")
            } else {
                props.user.set({ user_details: { user_id: userId, role }, login: true });
            }
        }
    }, [])
    const handleLogout = () => {
        props.globalState.set("auth_token", "");
        props.user.set({ user_details: {}, login: false });
        props.di.PUSH("/auth")
    }
    return <Layout children={<>
        <Box flex="1" p="4">
            <Box p={4} minH="100vh">
                <RouteComponent />
            </Box>
        </Box>
    </>} handleLogout={handleLogout} />
};

export default DI(Panel);

