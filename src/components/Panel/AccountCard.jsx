import React from 'react';
import { Box, Text, VStack, HStack, useColorModeValue, Icon } from '@chakra-ui/react';
import { FaUser, FaIdBadge, FaPhone, FaThLarge } from 'react-icons/fa';

const AccountCard = ({ account }) => {
    // Extract color values at the top
    const bgColor = useColorModeValue('white', 'gray.800');
    const boxShadow = '2xl';
    const blueColor = useColorModeValue('blue.500', 'blue.300');
    const tealColor = useColorModeValue('teal.500', 'teal.300');
    const purpleColor = useColorModeValue('purple.500', 'purple.300');
    const greenColor = useColorModeValue('green.500', 'green.300');
    const orangeColor = useColorModeValue('orange.500', 'orange.300');
    const grayColor = useColorModeValue('gray.600', 'gray.300');
    const grayTextColor = useColorModeValue('gray.500', 'gray.500');

    return (
        <Box
            maxW={{ base: '100%', sm: '350px' }}
            w={'full'}
            bg={bgColor}
            boxShadow={boxShadow}
            rounded={'lg'}
            p={{ base: 3, sm: 6 }}
            textAlign={'center'}
            mx={{ base: 2, sm: 'auto' }}>
            <VStack spacing={{ base: 2, sm: 4 }}>
                <HStack justifyContent={'center'} alignItems={'center'}>
                    <Icon as={FaUser} w={6} h={6} color={blueColor} />
                    <Text fontSize={{ base: 'lg', sm: 'xl', md: '2xl' }} fontWeight={600}>
                        {account.name}
                    </Text>
                </HStack>
                <Box textAlign={'left'} w={'full'}>
                    <VStack align={{ base: 'center', sm: 'start' }} spacing={{ base: 1, sm: 2 }}>
                        {[
                            { label: 'User ID:', icon: FaIdBadge, value: account.user_id, iconColor: tealColor },
                            { label: 'WhatsApp Business Account ID:', icon: FaThLarge, value: account.whatsapp_business_account_id, iconColor: purpleColor },
                            { label: 'Phone Number ID:', icon: FaPhone, value: account.phone_number_id, iconColor: greenColor },
                            { label: 'Message Template Namespace:', icon: FaThLarge, value: account.message_template_namespace, iconColor: orangeColor }
                        ].map((item, index) => (
                            <VStack key={index} align={'start'} spacing={0} w={'full'}>
                                <HStack w={'full'}>
                                    <Icon as={item.icon} w={4} h={4} color={item.iconColor} />
                                    <Text fontSize={{ base: 'sm', sm: 'md' }} fontWeight={600} flex={1}>
                                        {item.label}
                                    </Text>
                                </HStack>
                                <Text fontSize={{ base: 'xs', sm: 'sm' }} color={grayTextColor} ml={6}>
                                    {item.value}
                                </Text>
                            </VStack>
                        ))}
                    </VStack>
                </Box>
            </VStack>
        </Box>
    );
};

export default AccountCard;