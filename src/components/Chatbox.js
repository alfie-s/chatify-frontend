import { Box } from "@chakra-ui/react";
import SingleChat from "./SingleChat";
import { ChatState } from "../context/ChatProvider";
// tihs returns the chat box window, where the user will see their conversations
const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  // import from context provider
  const { selectedChat } = ChatState();

  return (
    <Box
    // adding responsive display props
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Chatbox;
