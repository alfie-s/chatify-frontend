/* Chakra UI used as CSS framework for speed and accessibilty
 and app responsiveness to different screensizes */
import { ViewIcon } from "@chakra-ui/icons";
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
  IconButton,
  Text,
  Image,
} from "@chakra-ui/react";
// returns the profile modal which will display name, email and profile pic 
const ProfileModal = ({ user, children }) => {
/*  useDisclosure is a custom hook used to help handle common open, 
    close, or toggle scenarios for chakra ui components such as drawers or modals.
    - isOpen sets the cotrolled component to its visible state
    - onOpen is a Callback function to set a truthy value for the isOpen parameter.
    - onClose is a Callback function to set a falsy value for the isOpen parameter.*/
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
    {/* if child element is supplied, display child elements,
     if child element is not supplied display view icon */}
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}
      {/* modal for profile */}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader
            fontSize="25px"
            fontFamily="Poppins"
            display="flex"
            justifyContent="center"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
          {/* profile pic in modal */}
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user.pic}
              alt={user.name}
            />
            <Text
              fontSize={{ base: "15px", md: "20px" }}
              fontFamily="Poppins"
            >
              Email: {user.email}
            </Text>
          </ModalBody>
          <ModalFooter>
          {/* close modal button */}
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
