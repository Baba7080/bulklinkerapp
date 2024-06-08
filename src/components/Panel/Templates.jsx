import React, { useEffect, useState } from 'react';
import {
    Box,
    Flex,
    Button,
    SimpleGrid,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Heading,
    Text,
    Image,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Select,
    Stack,
    Divider,
    useColorModeValue,
    ChakraProvider,
    VStack,
    HStack,
    Tag,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import PageHeader from './PageHeader';
import DI from '../../core/DependencyInjection';
import DynamicFormComponent from './DynamicFormComponent';


const TemplatePage = (props) => {
    const [templates, setTemplates] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [renderAPI, setRenderAPI] = useState(false)
    const [newTemplate, setNewTemplate] = useState({
        name: '',
        header: '',
        body: '',
        footer: '',
        imageUrl: '',
        buttonText: '',
        buttonUrl: ''
    });

    useEffect(() => {
        // Fetch accounts from the accounts API
        const fetchAccounts = async () => {
            props.di.GET("v1/whatsapp/business/getUser").then((e) => {
                console.log(e)
                if (e.success) {
                    setAccounts([...e.res])
                } else {
                    props.error(e.message)
                }
            })
        };


        fetchAccounts();
        // fetchTemplates();
    }, []);

    useEffect(() => {
        if (selectedAccount.length) {
            fetchTemplates()
        }
    }, [selectedAccount, renderAPI])

    // Fetch templates from the WhatsApp Cloud API
    const fetchTemplates = async () => {
        props.di.POST("v1/whatsapp/business/getUserTemplates", { id: selectedAccount }).then((e) => {
            console.log(e)
            if (e.success) {
                console.log(e.res)
                setTemplates([...e.res.data])
            } else {
                props.error(e.message)
            }
        })

    };

    const handleAccountChange = (e) => {
        setSelectedAccount(e.target.value);
    };

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    return (
        <ChakraProvider>
            <Box p={5}>
                <PageHeader name={"Templates"} subname={"Template"} handleOpen={handleOpen} isDisabled={selectedAccount.length ? false : true} />
                <Select placeholder="Select Account" onChange={handleAccountChange} mb={4}>
                    {accounts.map((account) => (
                        <option key={account.whatsapp_business_account_id} value={account.whatsapp_business_account_id}>
                            {account.name}
                        </option>
                    ))}
                </Select>
                <Divider />
                <SimpleGrid columns={[1, 2, 3]} spacing="40px">
                    {templates.map((template, index) => (
                        <Card key={index} boxShadow="xl" borderRadius="md" overflow="hidden"
                            maxW={'350px'}
                            w={'full'}
                        >
                            <CardHeader bg="gray.200" >
                                <HStack>
                                    <Heading size="sm">{template.name}</Heading>
                                </HStack>
                            </CardHeader>
                            <CardBody>
                                <VStack>
                                    {template.components.map((component, idx) => {
                                        if (component.type === 'HEADER') {
                                            return <Text fontWeight="bold" key={idx}>{component.text}</Text>;
                                        }
                                        if (component.type === 'BODY') {
                                            return <Text key={idx}>{component.text}</Text>;
                                        }
                                        if (component.type === 'FOOTER') {
                                            return <Text mt={2} color="gray.500" key={idx}>{component.text}</Text>;
                                        }
                                        if (component.type === 'BUTTONS') {
                                            return component.buttons.map((button, buttonIdx) => (
                                                <Button colorScheme='teal' variant='outline' key={buttonIdx}>{button.text}</Button>
                                            ));
                                        }
                                        return null;
                                    })}
                                </VStack>
                            </CardBody>
                            <CardFooter>
                                <Tag key={index} variant='solid' colorScheme={template.status === "APPROVED" ? "green" : template.status === "REJECTED" ? "red" : "yellow"}>
                                    {template.status}
                                </Tag>
                            </CardFooter>
                        </Card>
                    ))}
                </SimpleGrid>
            </Box>
            <DynamicFormComponent isOpen={isOpen} onClose={handleClose} setRenderAPI={setRenderAPI} renderAPI={renderAPI} id={selectedAccount} />
            {/* <Modal isOpen={isOpen} onClose={handleClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create New Template</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Stack spacing={3}>
                            <FormControl>
                                <FormLabel>Template Name</FormLabel>
                                <Input name="name" value={newTemplate.name} onChange={handleChange} />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Header</FormLabel>
                                <Input name="header" value={newTemplate.header} onChange={handleChange} />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Body</FormLabel>
                                <Textarea name="body" value={newTemplate.body} onChange={handleChange} />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Footer</FormLabel>
                                <Input name="footer" value={newTemplate.footer} onChange={handleChange} />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Image URL</FormLabel>
                                <Input name="imageUrl" value={newTemplate.imageUrl} onChange={handleChange} />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Button Text</FormLabel>
                                <Input name="buttonText" value={newTemplate.buttonText} onChange={handleChange} />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Button URL</FormLabel>
                                <Input name="buttonUrl" value={newTemplate.buttonUrl} onChange={handleChange} />
                            </FormControl>
                        </Stack>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="red" mr={3} onClick={handleCreateTemplate}>
                            Save
                        </Button>
                        <Button onClick={handleClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal> */}
        </ChakraProvider>
    );
};

export default DI(TemplatePage);



