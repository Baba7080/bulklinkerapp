import { AddIcon } from '@chakra-ui/icons'
import { Button, Flex, Text } from '@chakra-ui/react'
import React from 'react'

const PageHeader = ({ name, subname, handleOpen, isDisabled }) => {
    return (
        <Flex justify="space-between" align="center" wrap={'wrap'} mb={5} position="sticky" top="0" zIndex="10" >
            <Text fontSize="2xl" fontWeight="bold">
                {name}
            </Text>
            <Button leftIcon={<AddIcon />} colorScheme="red"
                variant="solid" onClick={handleOpen}
                isDisabled={isDisabled}
            >
                Add New {subname}
            </Button>
        </Flex>

    )
}

export default PageHeader