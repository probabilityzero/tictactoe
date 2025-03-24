import {
  Flex,
  Heading,
  IconButton,
  useColorMode,
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverCloseButton,
  PopoverArrow,
  Button,
  Avatar,
  Text,
  Switch,
  Box,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useToast,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon, HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import { Picker } from 'emoji-mart';

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [username, setUsername] = useState('');
  const [emoji, setEmoji] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [newEmoji, setNewEmoji] = useState(emoji);
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
  const { isOpen: isProfileOpen, onOpen: onProfileOpen, onClose: onProfileClose } = useDisclosure();
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const emojiPickerRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    const storedUsername = Cookies.get('username') || '';
    const storedEmoji = Cookies.get('emoji') || '😀';
    setUsername(storedUsername);
    setEmoji(storedEmoji);
    setNewEmoji(storedEmoji);

    if (!storedUsername) {
      setIsUsernameModalOpen(true);
    }
  }, []);

  const handleEmojiChange = (e) => {
    setNewEmoji(e.target.value);
  };

  const handleSaveEmoji = () => {
    setEmoji(newEmoji);
    Cookies.set('emoji', newEmoji);
    setIsEditing(false);
    setIsEmojiPickerOpen(false);
    toast({
      title: 'Emoji Updated',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleUsernameSubmit = (newUsername) => {
    setUsername(newUsername);
    Cookies.set('username', newUsername);
    setIsUsernameModalOpen(false);
    toast({
      title: 'Username Updated',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const toggleEmojiPicker = () => {
    setIsEmojiPickerOpen(!isEmojiPickerOpen);
  };

  const selectEmoji = (emojiObject) => {
    setNewEmoji(emojiObject.native);
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setIsEmojiPickerOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiPickerRef]);

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      padding="1rem"
      bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}
      color={colorMode === 'light' ? 'gray.700' : 'gray.100'}
    >
      <IconButton
        aria-label="Open Menu"
        size="md"
        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
        display={{ sm: 'block', md: 'none' }}
        onClick={isOpen ? onClose : onOpen}
      />
      <Heading size="lg">Tic-Tac-Toe</Heading>
      <Flex align="center">
        <Switch
          isChecked={colorMode === 'dark'}
          onChange={toggleColorMode}
          aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
        />
        <Popover isOpen={isProfileOpen} onClose={onProfileClose}>
          <PopoverTrigger>
            <IconButton
              aria-label="Profile"
              icon={<Avatar name={username} src={`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" font-size="32">${emoji}</svg>`} />}
              ml="1rem"
              onClick={onProfileOpen}
            />
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>Profile</PopoverHeader>
            <PopoverBody>
              <Flex align="center">
                <Text mr={2}>Emoji:</Text>
                <Box
                  onClick={toggleEmojiPicker}
                  style={{ cursor: 'pointer', fontSize: '1.5rem' }}
                >
                  {emoji}
                </Box>
                {isEmojiPickerOpen && (
                  <div ref={emojiPickerRef} style={{ position: 'absolute', zIndex: 2 }}>
                    <Picker onSelect={selectEmoji} />
                  </div>
                )}
              </Flex>
              <Text>Username: {username}</Text>
            </PopoverBody>
            <PopoverFooter>
              <Button size="sm" colorScheme="blue" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            </PopoverFooter>
          </PopoverContent>
        </Popover>
      </Flex>

      <UsernameModal
        isOpen={isUsernameModalOpen}
        onClose={() => setIsUsernameModalOpen(false)}
        onSubmit={handleUsernameSubmit}
      />
    </Flex>
  );
};

const UsernameModal = ({ isOpen, onClose, onSubmit }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = () => {
    onSubmit(username);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Enter Username</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Header;
