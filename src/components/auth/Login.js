import { FormControl, FormLabel, Input, InputGroup, VStack, InputRightElement, Button, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
// returns the login component
const Login = () => {
    // setting states
    // password show/hide button
    const [show, setShow] = useState(false);
    // input email
    const [email, setEmail] = useState();
    // input password
    const [password, setPassword] = useState();
    // loading for profile image onclick
    const [loading, setLoading] = useState(false);
    // useToast for warning pop ups from chakra UI
    const toast = useToast();
    // navigate for use after log in to get user to chats
    const navigate = useNavigate();
    // handleclick function for passoword show/hide button
    // change the value of show
    const handleClick = () => setShow(!show);
    // handle submit button
    const submitHandler = async () => {
        setLoading(true);
        // if email or password doesn't exist
        // show pop up warning
        if (!email || !password) {
          toast({
            title: "Please Fill all the Fields",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setLoading(false);
          return;
        }
        try {
          const config = {
            headers: {
              "Content-type": "application/json",
            },
          };
        //make request to /login
          const { data } = await axios.post(
            "/api/user/login",
            { email, password },
            config
          );
    
        //if login successfull show this pop up
          toast({
            title: "Login Successful",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          localStorage.setItem("userInfo", JSON.stringify(data));
          setLoading(false);
        //navigate user to /chats
          navigate("/chats");
        //   or show this pop up if there is an error
        } catch (error) {
          toast({
            title: "Error Occured!",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setLoading(false);
        }
      };

    return ( 
        <VStack spacing='5px'>
            {/* login with email and password input fields */}
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder='Enter Your Email'
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        //if show is true show the password if not show it as dots 
                        type={show ? 'text' : 'password'}
                        placeholder='Enter Your Password'
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                <InputRightElement width='4.5rem'>
                    {/* password visibility functionality */}
                    <Button h ='1.75rem' size='sm' onClick={handleClick}>
                        {show ? 'hide' : 'show'}
                    </Button>
                </InputRightElement>
                </InputGroup>
            </FormControl>
            {/* Login button */}
            <Button colorScheme='green' width='100%' style={{ marginTop: 15 }} onClick={submitHandler} isLoading={loading}>
                Login
            </Button>
        </VStack>
     );
}
 
export default Login;