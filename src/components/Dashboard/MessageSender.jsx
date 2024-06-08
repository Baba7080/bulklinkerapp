import React, { useEffect, useState } from 'react';
import {
    Box,
    FormControl,
    FormLabel,
    Input,
    Button,
    VStack,
    Select,
    Text,
    Heading,
    Card,
    CardHeader,
    CardBody,
    Skeleton,
} from '@chakra-ui/react';
import DI from '../../core/DependencyInjection';

// Sample templates to select from
const templates = [
    {
        name: 'seasonal_promotion_text_only',
        language: 'en',
        category: 'MARKETING',
        components: [
            {
                type: 'HEADER',
                format: 'TEXT',
                text: 'Our {{1}} is on!',
                example: { header_text: ['Summer Sale'] }
            },
            {
                type: 'BODY',
                text: 'Shop now through {{1}} and use code {{2}} to get {{3}} off of all merchandise.',
                example: { body_text: [['the end of August', '25OFF', '25%']] }
            },
            {
                type: 'FOOTER',
                text: 'Use the buttons below to manage your marketing subscriptions'
            },
            {
                type: 'BUTTONS',
                buttons: [
                    { type: 'QUICK_REPLY', text: 'Unsubscribe from Promos' },
                    { type: 'QUICK_REPLY', text: 'Unsubscribe from All' }
                ]
            }
        ]
    },
    // Add more templates as needed
];

// Function to extract placeholders
const extractPlaceholders = (text) => {
    const regex = /\{\{(\d+)\}\}/g;
    const matches = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
        matches.push(match[1]);
    }
    return matches;
};

const replacePlaceholders = (text, values) => {
    return text.replace(/\{\{(\d+)\}\}/g, (_, index) => values[index] || `{{${index}}}`);
};

// Function to generate message payload
const generateMessagePayload = (template, values) => {
    const messagePayload = {
        messaging_product: 'whatsapp',
        to: '',
        type: 'template',
        template: {
            name: template.name,
            language: {
                code: template.language,
            },
            components: [],
        },
    };
    
    template.components.forEach((component) => {
        if (component.type === 'HEADER' || component.type === 'BODY') {
            const sectionValues = values[component.type.toLowerCase()] || {};
            const parameters = extractPlaceholders(component.text).map((placeholder) => ({
                type: 'text',
                text: sectionValues[placeholder],
            }));

            messagePayload.template.components.push({
                type: component.type.toLowerCase(),
                parameters,
            });
        } else if (component.type === 'BUTTONS') {
            // let idx = 0;
            component.buttons.forEach((button,idx) => {
                messagePayload.template.components.push({
                    type: 'button',
                    sub_type: 'quick_reply',
                    index:idx,
                    parameters: [{
                        type: 'text',
                        text: button.text,
                    }],
                });

            });
        }
    });

    return messagePayload;
};

const MessageSenderComponent = ({ template, onTemplateChange }) => {
    const [headerValues, setHeaderValues] = useState({});
    const [bodyValues, setBodyValues] = useState({});

    const handleChange = (section, placeholder, event) => {
        const { value } = event.target;
        let newValues;

        if (section === 'header') {
            newValues = { ...headerValues, [placeholder]: value };
            setHeaderValues(newValues);
        } else {
            newValues = { ...bodyValues, [placeholder]: value };
            setBodyValues(newValues);
        }

        const allValues = {
            header: section === 'header' ? newValues : headerValues,
            body: section === 'body' ? newValues : bodyValues,
        };

        onTemplateChange(allValues);
    };

    return (
        <Box p={5} flex="1">
            {template.components.map((component, componentIndex) => (
                component.type === 'HEADER' && (
                    <Box key={componentIndex} mb={4}>
                        <Text fontWeight="bold">Header</Text>
                        {extractPlaceholders(component.text).map((placeholder, index) => (
                            <FormControl key={index} mb={2}>
                                <FormLabel>{`Value for {{${placeholder}}}`}</FormLabel>
                                <Input
                                    placeholder={`Enter value for {{${placeholder}}}`}
                                    value={headerValues[placeholder] || ''}
                                    onChange={(e) => handleChange('header', placeholder, e)}
                                />
                            </FormControl>
                        ))}
                    </Box>
                )
            ))}
            {template.components.map((component, componentIndex) => (
                component.type === 'BODY' && (
                    <Box key={componentIndex} mb={4}>
                        <Text fontWeight="bold">Body</Text>
                        {extractPlaceholders(component.text).map((placeholder, index) => (
                            <FormControl key={index} mb={2}>
                                <FormLabel>{`Value for {{${placeholder}}}`}</FormLabel>
                                <Input
                                    placeholder={`Enter value for {{${placeholder}}}`}
                                    value={bodyValues[placeholder] || ''}
                                    onChange={(e) => handleChange('body', placeholder, e)}
                                />
                            </FormControl>
                        ))}
                    </Box>
                )
            ))}
        </Box>
    );
};

const MessageSender = (props) => {
    const [csvFileName, setCsvFileName] = useState();
    const [templateName, setTemplateName] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [templateValues, setTemplateValues] = useState({ header: {}, body: {} });
    const [accounts, setAccounts] = useState([]);
    const [phoneId, setPhoneId] = useState("");
    const [account, setAccount] = useState("");
    const [accountsLoader, setAccountsLoader] = useState(false);
    const [templates, setTemplates] = useState([])

    const handleTemplateSelect = (template) => {
        const selectedTemplateData = templates.find(t => t.name === template);
        setTemplateName(template);
        setSelectedTemplate(selectedTemplateData);
    };
    const handleAccountSelect = (account) => {
        console.log(account)
        const accountTmp = accounts.find(t => t.whatsapp_business_account_id === account);
        setPhoneId(accountTmp.phone_number_id)
        setAccount(account)
        // setSelectedTemplate(selectedTemplateData);
    };
    const handleTemplateChange = (values) => {
        setTemplateValues(values);
    };

    const filledTemplateText = (text, section) => {
        return replacePlaceholders(text, templateValues[section.toLowerCase()]);
    };
    const fetchAccounts = async () => {
        setAccountsLoader(true)
        props.di.GET("v1/whatsapp/business/getUser").then((e) => {
            // console.log(e)
            if (e.success) {
                setAccounts([...e.res])
            } else {
                props.error(e.message)
            }
            setAccountsLoader(false)
        })
    };

    const handleSubmit = () => {

        const payload = generateMessagePayload(selectedTemplate, templateValues);
        console.log('Generated Message Payload:', JSON.stringify(payload, null, 2));
        // Send the payload to an API or another service if needed
        props.di.POST("v1/whatsapp/business/sendMessages", { id: phoneId, csv: csvFileName, payload }).then((e) => {
            console.log(e)
        })
    };
    useEffect(() => {
        if (account.length) {
            fetchTemplates()
        }
    }, [account])

    // Fetch templates from the WhatsApp Cloud API
    const fetchTemplates = async () => {
        props.di.POST("v1/whatsapp/business/getUserTemplates", { id: account }).then((e) => {
            // console.log(e)
            if (e.success) {
                // console.log(e.res)
                setTemplates([...e.res.data])
            } else {
                props.error(e.message)
            }
        })

    };
    useEffect(() => {
        fetchAccounts();
    }, []);

    return (
        <Box borderWidth="1px" borderRadius="lg" p={5}>
            <VStack spacing={4}>
                <FormControl id="csvFileName" isRequired>
                    <FormLabel>CSV File Name</FormLabel>
                    {!props.csvLoading ? <Select placeholder="Select CSV file" value={csvFileName} onChange={(e) => setCsvFileName(e.target.value)} >

                        {
                            props.uploadedCSVs.map((item) => <option value={item}>{item}</option>)
                        }
                        {/* <option value="file2.csv">File 2</option> */}
                        {/* Add more options as required */}
                    </Select> : <Skeleton><div></div></Skeleton>}
                </FormControl>
                <FormControl id="accountName" isRequired>
                    <FormLabel>Account Name</FormLabel>
                    {!accountsLoader ? <Select placeholder="Select account" value={account} onChange={(e) => handleAccountSelect(e.target.value)}>
                        {accounts.map((template, index) => (
                            <option key={index} value={template.whatsapp_business_account_id}>{template.name}</option>
                        ))}
                    </Select> : <Skeleton><div></div></Skeleton>}
                </FormControl>
                {account.length ? <FormControl id="templateName" isRequired>
                    <FormLabel>Template Name</FormLabel>
                    <Select placeholder="Select template" value={templateName} onChange={(e) => handleTemplateSelect(e.target.value)}>
                        {templates.filter(x => x.status === "APPROVED").map((template, index) => (
                            <option key={index} value={template.name}>{template.name}</option>
                        ))}
                    </Select>
                </FormControl> : null}

                <Box display="flex" width="100%" mt={4}>
                    {selectedTemplate && (
                        <>
                            <Card
                                boxShadow="xl"
                                borderRadius="md"
                                overflow="hidden"
                                maxW="300px"
                                w="full"
                                mr={4}
                            >
                                <CardHeader bg="gray.200">
                                    <Heading size="sm">{selectedTemplate.name}</Heading>
                                </CardHeader>
                                <CardBody>
                                    <VStack>
                                        {selectedTemplate.components.map((component, idx) => {
                                            if (component.type === 'HEADER') {
                                                return <Text fontWeight="bold" key={idx}>{filledTemplateText(component.text, 'HEADER')}</Text>;
                                            }
                                            if (component.type === 'BODY') {
                                                return <Text key={idx}>{filledTemplateText(component.text, 'BODY')}</Text>;
                                            }
                                            if (component.type === 'FOOTER') {
                                                return <Text mt={2} color="gray.500" key={idx}>{component.text}</Text>;
                                            }
                                            if (component.type === 'BUTTONS') {
                                                return component.buttons.map((button, buttonIdx) => (
                                                    <Button colorScheme="teal" variant="outline" key={buttonIdx}>{button.text}</Button>
                                                ));
                                            }
                                            return null;
                                        })}
                                    </VStack>
                                </CardBody>
                            </Card>
                            <MessageSenderComponent template={selectedTemplate} onTemplateChange={handleTemplateChange} />
                        </>
                    )}
                </Box>

                <Button colorScheme="red" onClick={handleSubmit}>Send Message</Button>
            </VStack>
        </Box>
    );
};

export default DI(MessageSender)