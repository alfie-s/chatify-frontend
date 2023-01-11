/* Chakra UI used as CSS framework for speed and accessibilty
 and app responsiveness to different screensizes */
import { Container, Box, Text, Tabs, Tab, TabList, TabPanel, TabPanels } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import Login from '../components/auth/Login';
import Signup from '../components/auth/Signup';
const Homepage = () => {

    const navigate = useNavigate();

    useEffect(() => {
        // get info from local storage
      const user = JSON.parse(localStorage.getItem("userInfo"));
        // if user is logged in navigate too chats
      if (user) navigate("/chats");
    //   dependencies
    }, [navigate]);

    return ( 
        <Container maxW='xl' centerContent>
            <Box display='flex' justifyContent='center' p={3} bg={'white'} w="100%" m="40px 0 15px 0" borderRadius="lg" borderWidth="1px">
                <Text fontSize='4xl' fontFamily='Poppins' color='black' className='appTitleHome'>
                    Chattify
                </Text>
            </Box>
            <Box bg='white' w='100%' p={4} borderRadius='lg' borderWidth='1px' color='black'>
                <Tabs variant='soft-rounded' colorScheme='green'>
                    <TabList mb='1em'>
                        <Tab width='50%'>Login</Tab>
                        <Tab width='50%'>Sign Up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login/>
                        </TabPanel>
                        <TabPanel>
                            <Signup/>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
     );
}
 
export default Homepage;