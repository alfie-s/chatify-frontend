import { AddIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  Input,
  useToast,
  Box,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { ChatState } from "../context/ChatProvider";
import UserBadgeItem from "./userAvatar/UserBadgeItem";
import UserListItem from "./userAvatar/UserListItem";
// this returns the pop up modal for creating group chats
const GroupChatModal = () => {
  // custom hook to open and close modals and drawers from chalra ui
  const { isOpen, onOpen, onClose } = useDisclosure();
  // setting states
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  // importing from ChatState
  const { user, chats, setChats } = ChatState();

  const handleGroup = (userToAdd) => {
    // if selected users already have this
    if (selectedUsers.includes(userToAdd)) {
      // show the pop up
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };
  // search for users for 'add users'
  const handleSearch = async (query) => {
    setSearch(query);
    // if no query - return
    if (!query) {
      return;
    }
    try {
      // set state
      setLoading(true);
      // set JWT token as variable
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      // api call get request query
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      // test console log
      console.log(data);
      // set state
      setLoading(false);
      // set search result to the data
      setSearchResult(data);
    } catch (error) {
      // pop up warning
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleDelete = (delUser) => {
    // filter selected users if id is not equal to selected user id
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };
  // submit button function to create new group chat
  const handleSubmit = async () => {
    // if group chat name OR users is empty
    if (!groupChatName || !selectedUsers) {
      // show this warning
      toast({
        title: "Please fill all the feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      // set JWT token to variable
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      // api post request
      const { data } = await axios.post(
        `/api/chat/group`,
        {
          name: groupChatName,
          // stringify of selected users array
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      // set states adding to top of chats
      setChats([data, ...chats]);
      onClose();
      // pop up success
      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      // pop up warning
      toast({
        title: "Failed to Create the Chat!",
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <>
      {/* button will be rendered in as child element on MyChats */}
      <Button
            onClick={onOpen}
            display="flex"
            bg="#E8E8E8"
            fontSize={{ base: "12px", md: "12px", lg: "12px" }}
            fontFamily="Poppins"
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
          {/* group chat modal */}
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="20px"
            fontFamily="Poppins"
            d="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody d="flex" flexDir="column" alignItems="center">
          {/* form to set chat name */}
            <FormControl>
              <Input
                placeholder="Group Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            {/* form to add new users */}
            <FormControl>
              <Input
                placeholder="Add Users..."
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {/* render selected users */}
            <Box w="100%" d="flex" flexWrap="wrap">
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
            {/* render search users - top 4 results */}
            {loading ? (
              // <ChatLoading />
              <div>Loading...</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>
          <ModalFooter>
          {/* create chat button */}
            <Button onClick={handleSubmit} colorScheme="blue">
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
