import {
    Container,
    Heading,
    Stack,
    Text,
    SimpleGrid,
    Box,
    Icon,
  } from '@chakra-ui/react';
  import { CheckIcon } from '@chakra-ui/icons';
  
  const features = [
    {
      title: 'Bulk Messaging',
      description: 'Send messages to multiple contacts simultaneously.',
      icon: CheckIcon,
    },
    {
      title: 'Scheduled Messages',
      description: 'Schedule messages to be sent at a later time.',
      icon: CheckIcon,
    },
    {
      title: 'Message Templates',
      description: 'Create and reuse message templates.',
      icon: CheckIcon,
    },
    {
      title: 'Analytics',
      description: 'Track message delivery and responses.',
      icon: CheckIcon,
    },
  ];
  
  export default function Features() {
    return (
      <Container maxW={'7xl'} py={16} id="features">
        <Stack spacing={4} as={Box} textAlign={'center'}>
          <Heading fontSize={'3xl'}>Our Features</Heading>
          <Text color={'gray.600'} fontSize={'xl'}>
            Discover the powerful features that make our app the best choice for bulk messaging.
          </Text>
        </Stack>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10} mt={10}>
          {features.map((feature, index) => (
            <Box key={index} textAlign={'center'} p={5} shadow={'md'} borderWidth={'1px'}>
              <Icon as={feature.icon} w={10} h={10} color={'red.400'} />
              <Heading fontSize={'xl'} mt={4}>{feature.title}</Heading>
              <Text mt={4}>{feature.description}</Text>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    );
  }
  