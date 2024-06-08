import React, { useState } from 'react';
import {
    Box,
    Button,
    Input,
    Select,
    Textarea,
    VStack,
    HStack,
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    useDisclosure,
    FormControl,
    FormLabel,
    IconButton,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import DI from '../../core/DependencyInjection';

const samplePayloads = [
    {
        name: 'Sample 1',
        language: 'en',
        category: 'Marketing',
        header: { type: 'IMAGE', url: 'https://example.com/image.jpg' },
        body: { text: 'This is a sample body text {{1}}.' },
        footer: { text: 'Sample footer' },
        buttons: [{
            "type": "PHONE_NUMBER",
            "text": "Call Us",
            "phone_number": "+123456789"
        },
        {
            "type": "QUICK_REPLY",
            "text": "fgfh"
        },
        {
            "type": "URL",
            "text": "dgdfg",
            "url": "fgfhfh"
        }],
    },
    {
        name: 'Sample 2',
        language: 'fr',
        category: 'Receipt',
        header: { type: 'TEXT', text: 'Sample Header' },
        body: { text: 'Ceci est un texte d\'exemple {{2}}.' },
        footer: { text: 'Exemple de pied de page' },
        buttons: [
            { type: 'PHONE_NUMBER', text: 'Call Us', phone_number: '+123456789' },
        ],
    },
];

const DynamicFormComponent = (props) => {
    const [formData, setFormData] = useState({
        name: '',
        language: '',
        category: '',
        header: null,
        body: null,
        footer: null,
        buttons: [],
    });
    const [loader, setLoader] = useState(false)

    const handleInputChange = (section, event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [section]: {
                ...prevData[section],
                [name]: value,
            },
        }));
    };

    const handleAddButton = () => {
        setFormData((prevData) => ({
            ...prevData,
            buttons: [...prevData.buttons, { type: '', text: '', url: '', phone_number: '' }],
        }));
    };

    const handleButtonChange = (index, field, value) => {
        const newButtons = [...formData.buttons];
        newButtons[index][field] = value;
        setFormData((prevData) => ({
            ...prevData,
            buttons: newButtons,
        }));
    };

    const handleRemoveButton = (index) => {
        setFormData((prevData) => ({
            ...prevData,
            buttons: prevData.buttons.filter((_, i) => i !== index),
        }));
    };

    const handleSectionChange = (section, event) => {
        const { value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [section]: { type: value },
        }));
    };

    const handlePayloadSelection = (index) => {
        const selectedPayload = samplePayloads[index];
        console.log(selectedPayload)
        if (selectedPayload) {
            setFormData({
                name: { name: selectedPayload?.name ?? "" },
                language: { language: selectedPayload?.language ?? "" },
                category: { category: selectedPayload?.category ?? "" },
                header: selectedPayload.header,
                body: selectedPayload.body,
                footer: selectedPayload.footer,
                buttons: selectedPayload.buttons,
            });
        } else {
            setFormData({
                name: '',
                language: '',
                category: '',
                header: null,
                body: null,
                footer: null,
                buttons: [],
            })
        }
    };

    const handleSubmit = () => {
        const generatedPayload = generatePayload(formData);
        setLoader(true)
        props.di.POST("v1/whatsapp/business/saveUserTemplates", { id: props.id, payload: generatedPayload }).then((e) => {
            console.log(e)
            if (e.success) {
                console.log(e.res)
                // setTemplates([...e.res.data])
                props.setRenderAPI(!props.renderAPI)
                props.onClose()
            } else {
                props.error(e.message)
            }
            setLoader(false)
        })

    };

    const generatePayload = (data) => {
        // console.log(data, "test")
        const payload = {
            name: data.name.name,
            language: data.language.language,
            category: data.category.category,
            components: [],
        };

        if (data.header) {
            if (data.header.type === 'IMAGE') {
                payload.components.push({
                    type: 'HEADER',
                    format: 'IMAGE',
                    example: {
                        header_handle: [data.header.url],
                    },
                });
            } else if (data.header.type === 'TEXT') {
                payload.components.push({
                    type: 'HEADER',
                    format: 'TEXT',
                    text: data.header.text,
                    example: {
                        header_text: [data.header.text],
                    },
                });
            }
        }

        if (data.body) {
            payload.components.push({
                type: 'BODY',
                text: data.body.text,
                example: {
                    body_text: [[...extractDynamicValues(data.body.text)]],
                },
            });
        }

        if (data.footer) {
            payload.components.push({
                type: 'FOOTER',
                text: data.footer.text,
            });
        }

        if (data.buttons.length > 0) {
            const buttonComponents = data.buttons.map((button) => {
                if (button.type === 'PHONE_NUMBER') {
                    return {
                        type: 'PHONE_NUMBER',
                        text: button.text,
                        phone_number: button.phone_number,
                    };
                } else if (button.type === 'URL') {
                    return {
                        type: 'URL',
                        text: button.text,
                        url: button.url,
                    };
                } else if (button.type === 'QUICK_REPLY') {
                    return {
                        type: 'QUICK_REPLY',
                        text: button.text,
                    };
                } else if (button.type === 'CATALOG') {
                    return {
                        type: 'CATALOG',
                        text: button.text,
                    };
                }
                return null;
            });

            payload.components.push({
                type: 'BUTTONS',
                buttons: buttonComponents,
            });
        }

        return payload;
    };

    const extractDynamicValues = (text) => {
        const regex = /\{\{(\d+)\}\}/g;
        const matches = [];
        let match;
        while ((match = regex.exec(text)) !== null) {
            matches.push(match[1]);
        }
        return matches;
    };

    const renderPreview = () => {
        const { name, language, category, header, body, footer, buttons } = formData;
        console.log(formData)
        return (
            <Box mt={4} p={4} borderWidth="1px" borderRadius="md">
                {name && <Text fontWeight="bold">{name.name}</Text>}
                {language && <Text>Language: {language.language}</Text>}
                {category && <Text>Category: {category.category}</Text>}
                {header && header.type === 'IMAGE' && <Text>Header Image: {header.url}</Text>}
                {header && header.type === 'TEXT' && <Text>Header Text: {header.text}</Text>}
                {body && body.text && <Text mt={2}>{body.text}</Text>}
                {footer && footer.text && <Text mt={2}>{footer.text}</Text>}
                {buttons.length > 0 && (
                    <Box mt={4}>
                        <Text>Buttons:</Text>
                        {buttons.map((button, index) => (
                            <Text key={index} mt={2}>
                                {button.type === 'PHONE_NUMBER' && `Call Button: ${button.text} (${button.phone_number})`}
                                {button.type === 'URL' && `URL Button: ${button.text} (${button.url})`}
                                {button.type === 'QUICK_REPLY' && `Quick Reply: ${button.text}`}
                                {button.type === 'CATALOG' && `Catalog Button: ${button.text}`}
                            </Text>
                        ))}
                    </Box>
                )}
            </Box>
        );
    };

    return (
        <Box p={5}>
            <Modal isOpen={props.isOpen} onClose={props.onClose} size={"xl"} scrollBehavior={"inside"}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create WhatsApp Template</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl mb={4}>
                            <FormLabel>Choose a Sample Payload</FormLabel>
                            <Select placeholder="Select Payload" onChange={(e) => handlePayloadSelection(e.target.value)}>
                                {samplePayloads.map((payload, index) => (
                                    <option key={index} value={index}>{payload.name}</option>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl mb={4}>
                            <FormLabel>Template Name</FormLabel>
                            <Input name="name" value={formData.name.name} onChange={(e) => handleInputChange('name', e)} />
                        </FormControl>

                        <FormControl mb={4}>
                            <FormLabel>Language</FormLabel>
                            <Input name="language" value={formData.language.language} onChange={(e) => handleInputChange('language', e)} />
                        </FormControl>

                        <FormControl mb={4}>
                            <FormLabel>Category</FormLabel>
                            <Input name="category" value={formData.category.category} onChange={(e) => handleInputChange('category', e)} />
                        </FormControl>

                        <Box mb={4}>
                            <Text fontWeight="bold">Header</Text>
                            <Select placeholder="Select header type" value={formData.header?.type || ''} onChange={(e) => handleSectionChange('header', e)}>
                                <option value="IMAGE">Image</option>
                                <option value="TEXT">Text</option>
                            </Select>
                            {formData.header && formData.header.type === 'IMAGE' && (
                                <FormControl mt={2}>
                                    <FormLabel>Header Image URL</FormLabel>
                                    <Input name="url" value={formData.header.url || ''} onChange={(e) => handleInputChange('header', e)} />
                                </FormControl>
                            )}
                            {formData.header && formData.header.type === 'TEXT' && (
                                <FormControl mt={2}>
                                    <FormLabel>Header Text</FormLabel>
                                    <Input name="text" value={formData.header.text || ''} onChange={(e) => handleInputChange('header', e)} />
                                </FormControl>
                            )}
                        </Box>

                        <Box mb={4}>
                            <Text fontWeight="bold">Body</Text>
                            <Textarea name="text" value={formData.body?.text || ''} onChange={(e) => handleInputChange('body', e)} />
                        </Box>

                        <Box mb={4}>
                            <Text fontWeight="bold">Footer</Text>
                            <Input name="text" value={formData.footer?.text || ''} onChange={(e) => handleInputChange('footer', e)} />
                        </Box>

                        <Box mb={4}>
                            <Text fontWeight="bold">Buttons</Text>
                            {formData.buttons.map((button, index) => (
                                <HStack key={index} spacing={2} mb={2}>
                                    <Select placeholder="Button type" value={button.type} onChange={(e) => handleButtonChange(index, 'type', e.target.value)}>
                                        <option value="PHONE_NUMBER">Phone Number</option>
                                        <option value="URL">URL</option>
                                        <option value="QUICK_REPLY">Quick Reply</option>
                                        <option value="CATALOG">Catalog</option>
                                    </Select>
                                    <Input placeholder="Text" value={button.text} onChange={(e) => handleButtonChange(index, 'text', e.target.value)} />
                                    {button.type === 'URL' && (
                                        <Input placeholder="URL" value={button.url} onChange={(e) => handleButtonChange(index, 'url', e.target.value)} />
                                    )}
                                    {button.type === 'PHONE_NUMBER' && (
                                        <Input placeholder="Phone Number" value={button.phone_number} onChange={(e) => handleButtonChange(index, 'phone_number', e.target.value)} />
                                    )}
                                    <IconButton aria-label="Remove button" icon={<DeleteIcon />} onClick={() => handleRemoveButton(index)} />
                                </HStack>
                            ))}
                            <Button leftIcon={<AddIcon />} onClick={handleAddButton}>
                                Add Button
                            </Button>
                        </Box>

                        {renderPreview()}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="red" onClick={handleSubmit} isLoading={loader}>
                            Generate Template
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default DI(DynamicFormComponent);