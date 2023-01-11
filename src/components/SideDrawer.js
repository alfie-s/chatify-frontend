import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import ProfileModal from "./ProfileModal";
import { getSender } from "../config/ChatLogics";
import UserListItem from "./userAvatar/UserListItem";
import { ChatState } from "../context/ChatProvider";
/* Chakra UI used as CSS framework for speed and accessibilty
 and app responsiveness to different screensizes */
import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Tooltip, useToast, Text, useDisclosure } from "@chakra-ui/react";
// icons for notifications and user menu dropdowns
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons"
// notification counter
import { MDBBadge } from 'mdb-react-ui-kit';

function SideDrawer() {
    // set states for search, results and loading
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  // set multiple states
  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();
  // used for pop up warnings
  const toast = useToast();
  // custom hook for chakra UI components such as drawers and modals
  const { isOpen, onOpen, onClose } = useDisclosure();
  // custom hook to navigate users usually after a log out or log in
  const navigate = useNavigate();
  // logout user by removing localstorage userinfo and navigating them back to the '/' page
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };
  // search user function for SideDrawer
  const handleSearch = async () => {
    // if nothing in the search, show pop up warning
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    // make the api call to search for the user entered into search
    try {
      // change loading state
      setLoading(true);
      // set variable as jwt token
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      // set data as search result using config as auth
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      // change loading state
      setLoading(false);
      // set to data
      setSearchResult(data);
      // pop up warning
    } catch (error) {
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

  const accessChat = async (userId) => {
    // test console log
    console.log(userId);
    try {
      // change loading state
      setLoadingChat(true);
      // set variable as jwt token
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      // set data using config as auth
      const { data } = await axios.post(`/api/chat`, { userId }, config);
      // if it finds the chat in the list update it
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      // set to data
      setSelectedChat(data);
      // change loading state
      setLoadingChat(false);
      // close 
      onClose();
    } catch (error) {
      // pop up warning
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
      {/* tooltip and button with icon inside for searching for users */}
        <Tooltip label="Start a conversation" hasArrow placement="bottom-end">
          <span>
            <Button variant="ghost" onClick={onOpen}>
              <i className="fas fa-search"></i>
              <Text display={{ base: "none", md: "flex" }} px={4}>
                Search User
              </Text>
            </Button>
          </span>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Oleo Script">
          Chattify
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
          {/* notificaton bell and badge */}
              <MDBBadge color="danger" notification pill>{notification.length}</MDBBadge>
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
            {/* profile menu */}
          </Menu>
          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
            {/* modal for profile modal and the child elements*/}
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>{" "}
              </ProfileModal>
              <MenuDivider />
              {/* log out the user */}
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      {/* search user drawer in the nav */}
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {/* if loading is true display ChatLoading component, if not loading render search result */}
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {/* loading animation */}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
