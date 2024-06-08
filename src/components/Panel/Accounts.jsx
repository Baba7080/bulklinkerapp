import React, { useEffect, useState } from 'react';
import {
    Box,
    SimpleGrid,
    Text,
    Button,
    Flex,
    useColorModeValue,
    VStack,
} from '@chakra-ui/react';
import WhatsAppSignupButton from '../../FacebookLoginButton';
import AccountCard from './AccountCard';
import DI from '../../core/DependencyInjection';



const Accounts = (props) => {
    const [accounts, setAccounts] = useState([]);
    const getUserAccounts = () => {
        props.di.GET("v1/whatsapp/business/getUser").then((e) => {
            console.log(e)
            if (e.success) {
                console.log(e.res)
                setAccounts([...e.res])
            } else {
                props.error(e.message)
            }
        })
    }
    useEffect(() => {
        getUserAccounts()
    }, [])
    return (
        <Box p={4}>
            <Flex justifyContent="space-between" alignItems="center" wrap={'wrap'} mb={4} position="sticky" top="0" zIndex="10">
                <Text fontSize="2xl" fontWeight="bold">
                    Connected Accounts
                </Text>
                <WhatsAppSignupButton appId={"1075467237089677"} configId={"3606872936202619"} />
            </Flex>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
                {accounts.map((account) => (
                    <AccountCard key={account.id} account={account} />
                ))}
            </SimpleGrid>
        </Box>
    );
};

export default DI(Accounts);
