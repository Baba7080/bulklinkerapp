import React from 'react';
import {
    Box,
    Flex,
    HStack,
    Button,
    IconButton,
    Stack,
    useDisclosure,
    useColorModeValue,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { Link as ScrollLink } from 'react-scroll';


const Links = ['home', 'features', 'pricing'];

const NavLink = ({ children }) => (
    <ScrollLink
        to={children}
        smooth={true}
        duration={500}
        spy={true}
        exact="true"
        offset={-60}  // Adjust the offset to match the height of your navbar
    >
        <Box
            px={2}
            py={1}
            rounded={'md'}
            cursor="pointer"
            _hover={{
                textDecoration: 'none',
                bg: useColorModeValue('gray.200', 'gray.700'),
            }}
        >
            {children.charAt(0).toUpperCase() + children.slice(1)}
        </Box>
    </ScrollLink>
);

function Navbar({ toggleLogin, toggleSignup }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4} pos="fixed" w="full" zIndex={1}>
            <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                <IconButton
                    size={'md'}
                    icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                    aria-label={'Open Menu'}
                    display={{ md: 'none' }}
                    onClick={isOpen ? onClose : onOpen}
                />
                <HStack spacing={8} alignItems={'center'}>
                    <Box>Logo</Box>
                    <HStack
                        as={'nav'}
                        spacing={4}
                        display={{ base: 'none', md: 'flex' }}
                    >
                        {Links.map((link) => (
                            <NavLink key={link}>{link}</NavLink>
                        ))}
                    </HStack>
                </HStack>
                <Flex alignItems={'center'}>
                    <Button mr={4} onClick={toggleLogin}>Login</Button>
                    <Button colorScheme="red" onClick={toggleSignup}>Sign Up</Button>
                </Flex>
            </Flex>

            {isOpen ? (
                <Box pb={4} display={{ md: 'none' }}>
                    <Stack as={'nav'} spacing={4}>
                        {Links.map((link) => (
                            <NavLink key={link}>{link}</NavLink>
                        ))}
                    </Stack>
                </Box>
            ) : null}
        </Box>
    );
}
export default Navbar