import { Flex, Text, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { QuestionOutlineIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { useState } from 'react';

const Footer = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <Flex
      as="footer"
      align="center"
      justify="space-around"
      padding="1rem"
      bg="gray.200"
      color="gray.600"
      position="fixed"
      bottom="0"
      left="0"
      width="100%"
    >
      <IconButton
        aria-label="Help"
        icon={<QuestionOutlineIcon />}
        size="sm"
        onClick={() => setIsHelpOpen(true)}
      />
      <Text fontSize="sm">Help</Text>
      <IconButton
        aria-label="More Games"
        icon={<ExternalLinkIcon />}
        size="sm"
        onClick={() => window.open(process.env.NEXT_PUBLIC_GAMES_URL, '_blank')}
      />
      <Text fontSize="sm">More Games</Text>

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </Flex>
  );
};

const HelpModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Help</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          This is a Tic-Tac-Toe game. Click on a square to place your mark.
          The goal is to get three in a row.
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default Footer;
