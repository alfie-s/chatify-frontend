import { Box } from "@chakra-ui/layout";
import { useState } from "react";
// Chatbox is the conversation window
import Chatbox from "../components/Chatbox";
// MyChats being left side component
import MyChats from "../components/MyChats";
// sidedrawer for user search
import SideDrawer from "../components/SideDrawer";
import { ChatState } from "../context/ChatProvider";

const Chatpage = () => {
  // set state - fetchagain to be supplied to chatbox 
  const [fetchAgain, setFetchAgain] = useState(false);
//   imported and desturctured from context provider
  const { user } = ChatState();

  return (
    <div style={{ width: "100%" }}>
        {/* if user in in app then render SideDrawer component */}
      {user && <SideDrawer />}
      <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
      {/* if user in in app render MyChats section */}
        {user && <MyChats fetchAgain={fetchAgain} />}
        {/* if user is in app render Chatbox */}
        {user && (
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chatpage;
