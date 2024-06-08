import { EmailIcon, LockIcon } from '@chakra-ui/icons';
import { Button, FormControl, FormLabel, Input, InputGroup, InputLeftElement, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import DI from '../../core/DependencyInjection';
import { useSetRecoilState } from 'recoil';
import { userDetailsState } from '../../app/atoms';
import { parseJwt } from '../../utils/jwt';

const Login = (props) => {
    const { isOpen, onClose, onSwitch, di } = props
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loader, setLoader] = useState(false);
    const setUserState = useSetRecoilState(userDetailsState)

    const handleSubmit = () => {
        console.log(email, password)
        if (!email.trim().length || !password.trim().length) {
            props.error("Fill all the required fields");
            return;
        }
        setLoader(true);
        di.GET("v1/core/user/login", { email, password }).then((e) => {
            if (e.success) {
                setUserState({ login: true })
                props.globalState.set("auth_token", e.tokens.access.token)
                let { userId } = parseJwt(e.tokens.access.token);
                di.PUSH("/panel/" + userId)
                props.success("Logged in successfully.")
            } else {
                props.error(e.message)
            }
            setLoader(false);
        })
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Login</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4} align="left">
                        <FormControl isRequired>
                            <FormLabel>Email</FormLabel>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none">
                                    <EmailIcon color="gray.300" />
                                </InputLeftElement>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                />
                            </InputGroup>
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Password</FormLabel>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none">
                                    <LockIcon color="gray.300" />
                                </InputLeftElement>
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                />
                            </InputGroup>
                        </FormControl>
                        <Text fontSize='small'>
                            Not a User? <Link onClick={onSwitch} color={"red"}>Sign Up</Link>
                        </Text>
                        <Button
                            width="full"
                            mt={4}
                            colorScheme="red"
                            onClick={handleSubmit}
                            _hover={{ bg: "red.500", transform: "scale(1.05)" }}
                            transition="0.3s"
                            isLoading={loader}
                        >
                            Login
                        </Button>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default DI(Login);
