/* Chakra UI used as CSS framework for speed and accessibilty
 and app responsiveness to different screensizes */
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom'

const Signup = () => {
    // setting states
    // password show/hide button
    const [show, setShow] = useState(false);
    // confirm password show/hide button
    const [showConPass, setShowConPass] = useState(false);
    // input name
    const [name, setName] = useState();
    // input email
    const [email, setEmail] = useState();
    // input password
    const [password, setPassword] = useState();
    // input confirm password
    const [confirmPassword, setConfirmPassword] = useState();
    // profile picture
    const [pic, setPic] = useState();
    // when picture file is uploading
    const [picLoading, setPicLoading] = useState(false);
    // for pop up boxes
    const toast = useToast();
    // allows access to react routers history object
    const navigate = useNavigate();
    // handleclick function for passoword show/hide button
    // change the value of show
    const handlePassClick = () => setShow(!show);
    const handleConPassClick = () => setShowConPass(!showConPass);
    // handle image file upload details for profile pic
    // using cloudinary to upload images for use in the app
    // https://cloudinary.com/
    const postDetails = (pics) => {
        // change state of picLoading
        setPicLoading(true);
        // if picture file undefined
        if (pics === undefined) {
            // pop up warning
          toast({
            title: "Please Select an Image!",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        //   return if pics is defined
          return;
        }
        // test
        console.log(pics);
        // if the images are image files
        if (pics.type === "image/jpeg" || pics.type === "image/png") {
          const data = new FormData();
          data.append("file", pics);
            //  name of upload preset from cloudinary
          data.append("upload_preset", "chat-app");
            // cloudname from cloudinary
          data.append("cloud_name", "dflusl1r3");
            //  post the image and data to the cloudinary api
          fetch("https://api.cloudinary.com/v1_1/dflusl1r3/image/upload", {
            method: "post",
            body: data,
          })
            .then((res) => res.json())
            .then((data) => {
              setPic(data.url.toString());
            // test console log
              console.log(data.url.toString());
              setPicLoading(false);
            })
            .catch((err) => {
              console.log(err);
              setPicLoading(false);
            });
        } else {
            // pop up warning message
          toast({
            title: "Please Select an Image!",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setPicLoading(false);
          return;
        }
      };

    // handle submit button for signup
    const submitHandler = async () => {
        setPicLoading(true);
        // if not these values then show warning popup
        if (!name || !email || !password || !confirmPassword) {
            toast({
                title: "please fill in all fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setPicLoading(false)
            return;
        }
        // if password input does not match confirm password input
        // show pop up warning
        if (password !== confirmPassword) {
            toast({
              title: "Passwords Do Not Match",
              status: "warning",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            return;
          }
        // test console log
          console.log(name, email, password, pic);
          try {
            const config = {
              headers: {
                "Content-type": "application/json",
              },
            };
            // api request
            const { data } = await axios.post(
              "/api/user",
              {
                name,
                email,
                password,
                pic,
              },
              config
            );
            console.log(data);
            // registration success pop up
            toast({
              title: "Registration Successful",
              status: "success",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            // 
            localStorage.setItem("userInfo", JSON.stringify(data));
            setPicLoading(false);
            // if user logged in push to chats page
            // using navigate from react router dom
            navigate("/chats");
          } catch (error) {
            // pop up error message
            toast({
              title: "Error Occured!",
              description: error.response.data.message,
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            setPicLoading(false);
          }
    };

    return ( 
        <VStack spacing='5px'>
        {/* signup form with name, email password input fields */}
        <FormControl id='firstName' isRequired>
            <FormLabel>Name</FormLabel>
            <Input
                placeholder='Enter Your Name'
                onChange={(e) => setName(e.target.value)}
            />
        </FormControl>
        <FormControl id='email' isRequired>
            <FormLabel>Email</FormLabel>
            <Input
                placeholder='Enter Your Email'
                onChange={(e) => setEmail(e.target.value)}
                id='signupEmail'
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
                    id='signupPassword'
                />
            <InputRightElement width='4.5rem'>
                {/* password visibility functionality */}
                <Button h ='1.75rem' size='sm' onClick={handlePassClick}>
                    {show ? 'hide' : 'show'}
                </Button>
            </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id='confirmPassword' isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
                <Input
                    //if show is true show the password if not show it as dots 
                    type={showConPass ? 'text' : 'password'}
                    placeholder='Confirm Password'
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            <InputRightElement width='4.5rem'>
                {/* password visibility functionality */}
                <Button h ='1.75rem' size='sm' onClick={handleConPassClick}>
                    {showConPass ? 'hide' : 'show'}
                </Button>
            </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id='pic'>
            <FormLabel>Upload Your Picture</FormLabel>
            <Input
                type='file'
                p={1.5}
                accept='image/*'
                onChange={(e)=> postDetails(e.target.files[0])}
                />
        </FormControl>
        <Button colorScheme='green' width='100%' style={{ marginTop: 15 }} onClick={submitHandler} isLoading={picLoading}>
            Sign Up
        </Button>
        </VStack>
     );
}
 
export default Signup;