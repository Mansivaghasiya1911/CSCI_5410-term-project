import React, {useState} from 'react';
import 'firebase/auth';
import {initializeApp} from 'firebase/app';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import {Box, Button, FormControl, FormLabel, Heading, Input, Text} from '@chakra-ui/react';
import {Link as RouterLink} from 'react-router-dom';
import {firebaseConfig} from "../CloudConfig/getFirebaseConfig";
import {signUpWithGoogle} from "./service/signInAndSignUpusingGoogleAccount";
import {QuestionModal} from "./SecurityQuestionModal";
import {postData} from "./service/RestCall";
import {signInWithFacebook} from "./service/signInAndSignUpusingFacebook";
import ResetPasswordModal from "./ResetPasswordModal";


const POST_fetchQuesFirstNameLastNameByUserID: string = 'https://v8vwn4gos0.execute-api.us-east-1.amazonaws.com/prod';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const [questions, setQuestions] = useState([]);

    const [loggedInUserId, setLoggedInUserId] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFPModalOpen, setIsFPModalOpen] = useState(false);

    const handleLogin = (e: {
        preventDefault: () => void;
    }) => {
        e.preventDefault();
        console.log(e);
        signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                console.log(userCredential.user);
                if (userCredential.user.emailVerified) {
                    const payload = {"user_id": userCredential.user.uid};
                    const userFromDynamo = await postData(POST_fetchQuesFirstNameLastNameByUserID, payload);
                    console.log(userFromDynamo);
                    const ques = [userFromDynamo.question1, userFromDynamo.question2, userFromDynamo.question3];
                    setQuestions(ques);
                    setLoggedInUserId(userCredential.user.uid);
                    setIsModalOpen(true);
                } else {
                    alert('Verify your mail. You must have receive a mail with a subject: Verify your email for serverless 5410');
                }
            })
            .catch((error) => {
                console.log(email);
                console.log(password);
                console.log(error);
                alert(error);
            });
    };

    const handleModalToggle = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleGoogleLogin = async () => {
        const user = await signUpWithGoogle();
        console.log(user);
        const payload = {"user_id": user.uid};
        const userFromDynamo = await postData(POST_fetchQuesFirstNameLastNameByUserID, payload);
        console.log(userFromDynamo);
        if (userFromDynamo === undefined) {
            alert('Sign Up using Google first');
        } else {
            const ques = [userFromDynamo.question1, userFromDynamo.question2, userFromDynamo.question3];
            setQuestions(ques);
            setLoggedInUserId(user.uid);
            setIsModalOpen(true);
        }
    };

    const handleFacebookLogin = async () => {
        const user = await signInWithFacebook();
        console.log(user);
        const payload = {"user_id": user.uid};
        const userFromDynamo = await postData(POST_fetchQuesFirstNameLastNameByUserID, payload);
        console.log(userFromDynamo);
        if (userFromDynamo === undefined) {
            alert('Sign Up using Facebook first');
        } else {
            const ques = [userFromDynamo.question1, userFromDynamo.question2, userFromDynamo.question3];
            setQuestions(ques);
            setLoggedInUserId(user.uid);
            setIsModalOpen(true);
        }
    };


    return (
        <>
            <Box maxW="md" m="auto" p="4">
                <Heading size="lg" textAlign="center" mb="6">
                    Login
                </Heading>
                <FormControl id="email" mb="4">
                    <FormLabel>Email</FormLabel>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </FormControl>
                <FormControl id="password" mb="2">
                    <FormLabel>Password</FormLabel>
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </FormControl>
                <Box display="flex" justifyContent="flex-end" mb="4">
                    <Text>
                        <Button onClick={() => setIsFPModalOpen(true)}>Forgot Password?</Button>
                    </Text>
                </Box>

                <Button colorScheme="blue" onClick={handleLogin} width="100%" mt="2" mb="4">
                    Login
                </Button>
                <Button colorScheme="blue" onClick={handleGoogleLogin} width="100%" mb="4">
                    Log in using Google
                </Button>
                <Button colorScheme="blue" onClick={handleFacebookLogin} width="100%" mb="8">
                    Log in using Facebook
                </Button>

                <Button as={RouterLink} to="/signup" colorScheme="red" width="100%" mb="4">
                    Sign Up
                </Button>

                <Button as={RouterLink} to="/signup?social_account=google" colorScheme="red" width="100%" mb="4">
                    Sign Up using Google
                </Button>

                <Button as={RouterLink} to="/signup?social_account=facebook" colorScheme="red" width="100%">
                    Sign Up using Facebook
                </Button>
            </Box>
            <QuestionModal
                isModalOpen={isModalOpen}
                handleModalToggle={handleModalToggle}
                questions={questions}
                loggedInUserId={loggedInUserId}
            />
            <ResetPasswordModal
                isOpen={isFPModalOpen}
                onClose={() => setIsFPModalOpen(false)}/>
        </>
    );
};

export default Login;