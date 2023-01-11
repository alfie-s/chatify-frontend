import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// custom context component which returns the provider of the context created
const ChatContext = createContext();
const ChatProvider = ({ children }) => {
    // setting states
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    // fetch local storage of userinfo
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    // setstate
    setUser(userInfo);
    // if no user info in local storage then navigate user to '/'
    if (!userInfo) navigate("/");
    // dependencies
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
