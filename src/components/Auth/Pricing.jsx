import {
    Box,
    Container,
    SimpleGrid,
    Heading,
    Stack,
    Text,
    Button,
  } from '@chakra-ui/react';
  
  const pricingOptions = [
    {
      title: 'Free',
      price: '0',
      features: ['10 messages per day', 'Basic support'],
    },
    {
      title: 'Pro',
      price: '9.99',
      features: ['Unlimited messages', 'Advanced support', 'Message scheduling'],
    },
    {
      title: 'Enterprise',
      price: '29.99',
      features: ['Custom features', 'Priority support', 'Dedicated account manager'],
    },
  ];
  
  export default function Pricing() {
    return (
      <Container maxW={'7xl'} py={16} id="pricing">
        <Stack spacing={4} as={Box} textAlign={'center'}>
          <Heading fontSize={'3xl'}>Pricing Plans</Heading>
          <Text color={'gray.600'} fontSize={'xl'}>
            Choose the plan that best suits your needs.
          </Text>
        </Stack>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} mt={10}>
          {pricingOptions.map((option, index) => (
            <Box key={index} p={5} shadow={'md'} borderWidth={'1px'}>
              <Heading fontSize={'xl'}>{option.title}</Heading>
              <Text fontSize={'3xl'}>${option.price}/mo</Text>
              <Stack mt={4} spacing={2}>
                {option.features.map((feature, index) => (
                  <Text key={index}>{feature}</Text>
                ))}
              </Stack>
              <Button mt={4} colorScheme="red">Choose Plan</Button>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    );
  }
  