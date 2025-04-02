import React from 'react';
import {
  Box,
  Button,
  Heading,
  Text,
  Card,
  useColorModeValue,
  Stack,
} from '@chakra-ui/react';
import { Icon as MdiIcon } from '@mdi/react';

interface EmptyStateProps {
  icon?: string; // MDI path string
  heading?: string;
  message?: string;
  buttonText?: string;
  buttonAction?: () => void;
  buttonIcon?: string; // MDI path string
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  heading = 'Žádný obsah',
  message = 'Začněte s přidáváním nových položek.',
  buttonText = 'Vytvořit novou položku',
  buttonAction = () => {},
  buttonIcon,
}) => {
  const iconColor = useColorModeValue('#A0AEC0', '#718096');
  const headingColor = useColorModeValue('gray.700', 'gray.200');
  const messageColor = useColorModeValue('gray.600', 'gray.400');
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <Card bg={cardBg} boxShadow="lg" borderRadius="xl" p={10}>
      <Stack spacing={6} align="center" textAlign="center">
        {icon && (
          <MdiIcon path={icon} size={2} color={iconColor} />
        )}

        <Heading size="lg" color={headingColor}>
          {heading}
        </Heading>

        <Text fontSize="md" color={messageColor} maxW="lg">
          {message}
        </Text>

        <Button
          size="lg"
        colorScheme="teal" 
          leftIcon={
            buttonIcon ? <MdiIcon path={buttonIcon} size={1} color="white" /> : undefined
          }
          onClick={buttonAction}
        >
          {buttonText}
        </Button>
      </Stack>
    </Card>
  );
};

export default EmptyState;
