import { Tooltip, Avatar} from "@chakra-ui/react";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../context/ChatProvider";
// this returns the info for the chatbox window
// including messages and sender info
const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <div className="scrollChatCont" style={{ overflowX: "hidden", overflowY: "auto" }}>
      {/* if there is a message and something inside the message map them */}
        {messages &&
          messages.map((m, i) => (
            <div style={{ display: "flex" }} key={m._id}>
            {/* using the chat logic exports to work out sender and last message */}
              {(isSameSender(messages, m, i, user._id) ||
                isLastMessage(messages, i, user._id)) && (
                <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                  <span>
                    <Avatar
                      mt="7px"
                      mr={1}
                      size="sm"
                      cursor="pointer"
                      name={m.sender.name}
                      src={m.sender.pic}
                    />
                  </span>
                </Tooltip>
              )}
              <span
                style={{
                  color: "#FFFFFF",
                  backgroundColor: `${
                    m.sender._id === user._id ? "#086F83" : "#2F855A"
                  }`,
                  marginLeft: isSameSenderMargin(messages, m, i, user._id),
                  marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                }}
              >
                {m.content}
              </span>
            </div>
          ))}
          </div>
  );
};

export default ScrollableChat;
