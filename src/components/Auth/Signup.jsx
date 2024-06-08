import { EmailIcon, LockIcon } from '@chakra-ui/icons';
import { Button, FormControl, FormLabel, Input, InputGroup, InputLeftElement, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import DI from '../../core/DependencyInjection';

const Signup = (props) => {
    const { isOpen, onClose, onSwitch, di } = props
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [loader, setLoader] = useState(false);

    const handleSubmit = () => {
        if (!email.trim().length || !password.trim().length || !confirmPassword.trim().length || !name.trim().length || !username.trim().length) {
            props.error("Fill all the required fields");
            return;
        }
        setLoader(true)
        di.POST("v1/core/user/register", { name, email, password, username }).then((e) => {
            if (e.success) {
                props.success("SignUp successfully.")
            } else {
                props.error(e.message)
            }
            setLoader(false);
        })

    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Signup</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4} align="left">
                        <FormControl isRequired>
                            <FormLabel>Name</FormLabel>
                            <InputGroup>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                />
                            </InputGroup>
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Username</FormLabel>
                            <InputGroup>
                                <Input
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                />
                            </InputGroup>
                        </FormControl>
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
                                    isInvalid={password !== confirmPassword}
                                    errorBorderColor='crimson'
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                />
                            </InputGroup>
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Confirm Password</FormLabel>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none">
                                    <LockIcon color="gray.300" />
                                </InputLeftElement>
                                <Input
                                    isInvalid={password !== confirmPassword}
                                    errorBorderColor='crimson'
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Enter your password"
                                />
                            </InputGroup>
                        </FormControl>
                        <Text fontSize='small'>
                            Already a User? <Link onClick={onSwitch} color={"red"}>Login</Link>
                        </Text>
                        <Button
                            isLoading={loader}
                            width="full"
                            mt={4}
                            colorScheme="red"
                            onClick={handleSubmit}
                            _hover={{ bg: "red.500", transform: "scale(1.05)" }}
                            transition="0.3s"
                        >
                            Signup
                        </Button>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default DI(Signup);
