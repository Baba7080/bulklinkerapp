import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    List,
    ListItem,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    HStack
} from '@chakra-ui/react';
import PageHeader from '../Panel/PageHeader';
import DI from '../../core/DependencyInjection';
import { getURL } from '../../core/Services/API';
import MessageSender from './MessageSender';

const Messages = (props) => {
    const [file, setFile] = useState(null);
    const [uploadedCSVs, setUploadedCSVs] = useState([]);
    const [csvLoading, setCsvLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false);
    const toast = useToast();

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    useEffect(() => {
        getCSVs();
        // fetchAccounts();
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUploadCSV = async () => {
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch(getURL() + '/v1/whatsapp/business/uploadCSV', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    toast({
                        title: 'CSV uploaded',
                        description: "Your CSV file has been uploaded successfully.",
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                    });
                    getCSVs(); // Refresh list of uploaded CSVs
                } else {
                    const data = await response.json();
                    throw new Error(data.message || 'Failed to upload');
                }
            } catch (error) {
                toast({
                    title: 'Upload error',
                    description: error.message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }

            setFile(null);
            handleClose();
        } else {
            toast({
                title: 'No file selected',
                description: "Please select a CSV file to upload.",
                status: 'warning',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const getCSVs = async () => {
        try {
            setCsvLoading(true)
            const response = await props.di.POST("v1/whatsapp/business/getCSV").then((response) => {
                if (response.success) {
                    setUploadedCSVs(response.files);
                }
                // else {
                //     throw new Error(response.message);
                // }
                setCsvLoading(false)
            })

        } catch (error) {
            toast({
                title: 'Error fetching CSVs',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Box p={5}>
            <PageHeader name={"Messaging"} subname={"/ Manage CSVs"} handleOpen={handleOpen} csvLoading={csvLoading} />
            <VStack spacing={8} align="stretch" p={5}>
                {/* Message Sender Form */}
                <MessageSender uploadedCSVs={uploadedCSVs} />
            </VStack>

            {/* Modal for uploading CSV */}
            <Modal isOpen={isOpen} onClose={handleClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add New CSV</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack>
                            {/* Import CSV Section */}
                            <Box borderWidth="1px" borderRadius="lg" p={5}>
                                <FormControl id="csvFile">
                                    <FormLabel>Import CSV</FormLabel>
                                    <HStack>
                                        <Input
                                            p={1}
                                            type="file"
                                            accept=".csv"
                                            onChange={handleFileChange}
                                            variant="outline"
                                        />
                                    </HStack>
                                </FormControl>
                            </Box>
                            {/* List of Uploaded CSVs */}
                            <Box borderWidth="1px" borderRadius="lg" w="100%" p={5}>
                                <FormLabel>Uploaded CSV Files:</FormLabel>
                                <List spacing={2}>
                                    {uploadedCSVs.map((csv, index) => (
                                        <ListItem key={index} borderBottom="1px" borderColor="gray.200" p={2}>
                                            {csv}
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleUploadCSV}>
                            Upload
                        </Button>
                        <Button variant="ghost" onClick={handleClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}

export default DI(Messages);