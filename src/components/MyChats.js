import { Box, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./GroupChatModal";
import { ChatState } from "../context/ChatProvider";
// this returns the My Chats section
const MyChats = ({ fetchAgain }) => {
  // set local state
  const [loggedUser, setLoggedUser] = useState();
  // import these from context
  const { 
    selectedChat, 
    setSelectedChat, 
    user, 
    chats, 
    setChats
   } = ChatState();
  //  for pop up modals
  const toast = useToast();
  //  fetch chats for user
  const fetchChats = async () => {
    try {
      // set JWT as variable
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      // api call to fetch all chats for the user
      const { data } = await axios.get("/api/chat", config);
      // set state
      setChats(data);
      // pop up warning
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    // import user from local storage
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    // fetch chats
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <Box
      // chats side box
      // display none for smaller screens
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      {/* header of the chats */}
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Oleo Script"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal />
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
      {/* if there is something inside the chats array, display chats or display loading */}
        {chats ? (
          <Stack overflowY="scroll" className="myChatStack">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#63B3ED" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                {/* if chat is not a group chat use senders name otherwise 
                display chat name if group chat */}
                  {!chat.isGroupChat
                      ? chat.users[1].name
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
