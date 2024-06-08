import React, { ReactNode } from 'react';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  CloseButton,
  Icon,
  VStack,
} from '@chakra-ui/react';
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
  FiLogOut,
  FiUserPlus,
  FiMessageCircle,
} from 'react-icons/fi';
import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import DI from '../../core/DependencyInjection';

const Links = ['Logout'];
const LinkItems = [
  { name: 'Accounts', icon: FiUserPlus },
  { name: 'Templates', icon: FiTrendingUp },
  { name: "Messaging", icon: FiMessageCircle }
  // { name: 'Explore', icon: FiCompass },
  // { name: 'Favourites', icon: FiStar },
  // { name: 'Settings', icon: FiSettings },
];

const NavLink = ({ children }) => {
  console.log(children)
  return <Link
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}

  >
    {children}
  </Link>
};

const SidebarContent = ({ onClose, handleLogout, props, ...rest }) => (
  <Box
    bg={useColorModeValue('white', 'gray.900')}
    boxShadow='base'
    borderRight="1px"
    borderRightColor={useColorModeValue('gray.200', 'gray.700')}
    w={{ base: 'full', md: 60 }}
    pos="fixed"
    h="full"
    display="flex"
    flexDirection="column"
    justifyContent="space-between"
    {...rest}>
    <Box>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Logo
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        // <NavItem key={link.name} icon={link.icon} props={props}>
        //   {link.name}
        // </NavItem>
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          bg={props.location.pathname.split("/")[props.location.pathname.split("/").length - 1] === link.name ? "red.100" : "transparent"}
          cursor="pointer"
          _hover={{
            bg: 'red.400',
            color: 'white',
          }}
          onClick={() => {
            console.log(props)
            props.di.PUSH(link.name)
          }}
        >
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={link.icon} />
          {link.name}
        </Flex>
      ))}
    </Box>
    <Flex
      align="center"
      p="4"
      mx="4"
      borderRadius="lg"
      role="group"
      cursor="pointer"
      _hover={{
        bg: 'red.400',
        color: 'white',
      }}
      onClick={handleLogout}
    >
      <Icon
        mr="4"
        fontSize="16"
        _groupHover={{
          color: 'white',
        }}
        as={FiLogOut} />
      Logout
    </Flex>
  </Box>
);

const NavItem = ({ icon, children, props, ...rest }) => (
  <Link
    onClick={() => {
      props.di.PUSH(children)
    }}
    href={""} style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
    <Flex
      align="center"
      p="4"
      mx="4"
      borderRadius="lg"
      role="group"
      cursor="pointer"
      _hover={{
        bg: 'red.400',
        color: 'white',
      }}
      {...rest}>
      {icon && (
        <Icon
          mr="4"
          fontSize="16"
          _groupHover={{
            color: 'white',
          }}
          as={icon}
        />
      )}
      {children}
    </Flex>
  </Link>
);

const MobileNav = ({ onOpen, ...rest }) => (
  <Flex
    ml={{ base: 0, md: 60 }}
    px={{ base: 4, md: 24 }}
    height="20"
    alignItems="center"
    bg={useColorModeValue('white', 'gray.900')}
    borderBottomWidth="1px"
    borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
    justifyContent="space-between"
    {...rest}>
    <IconButton
      variant="outline"
      onClick={onOpen}
      aria-label="open menu"
      icon={<FiMenu />}
    />
    <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
      Logo
    </Text>
    <IconButton
      variant="outline"
      aria-label="logout"
      icon={<FiLogOut />}
      onClick={() => { }}
    />
  </Flex>
);

function Layout(props) {
  const { children, handleLogout } = props
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg={useColorModeValue('whitesmoke', 'gray.900')}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
        props={props}
        handleLogout={handleLogout}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} props={props} handleLogout={handleLogout} />
        </DrawerContent>
      </Drawer>
      <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} props={props} />
      <Box ml={{ base: 0, md: 60 }} pt="10">
        {/* <Box pt={4} pb={4} px={4} overflowY="auto" height="calc(100vh - 64px)"> */}
        {children}

        {/* </Box> */}
        <Footer />
      </Box>
    </Box>
  );
}

const Footer = () => (
  <Box as="footer" py={4} textAlign="center" bg={useColorModeValue('gray.100', 'gray.900')}>
    <Text>© 2023 Your Company. All rights reserved.</Text>
  </Box>
);

export default DI(Layout);
