import React, {useEffect, useRef, useState} from 'react';
import {initializeApp} from 'firebase/app';
import {createUserWithEmailAndPassword, getAuth, sendEmailVerification, User} from 'firebase/auth';
import {useLocation, useNavigate} from 'react-router-dom';
import {firebaseConfig} from "../CloudConfig/getFirebaseConfig";
import {Box, Button, FormControl, FormLabel, Heading, Input, Select,} from '@chakra-ui/react';
import {signUpWithGoogle} from "./service/signInAndSignUpusingGoogleAccount";
import {fetchData, postData, putData} from "./service/RestCall";
import {signInWithFacebook} from "./service/signInAndSignUpusingFacebook";
import {ImageUpload} from "./service/imageUplaodToGCPBuckets";

const Signup = () => {

        const PUT_storeUserToDynamoDB: string = 'https://csxvr7woxf.execute-api.us-east-1.amazonaws.com/prod';
        const POST_KhushiSNSNotificationURL = 'https://r7h6msp1f2.execute-api.us-east-1.amazonaws.com/1/sendSubscriptions';
        const GET_getQuestionsFromDynamo = 'https://30quej290j.execute-api.us-east-1.amazonaws.com/prod';


        const emailRef = useRef<HTMLInputElement | null>(null);
        const passwordRef = useRef<HTMLInputElement | null>(null);
        const firstnameRef = useRef<HTMLInputElement | null>(null);
        const lastnameRef = useRef<HTMLInputElement | null>(null);
        const fileRef = useRef<HTMLInputElement | null>(null);
        const q1Ref = useRef<HTMLSelectElement | null>(null);
        const a1Ref = useRef<HTMLInputElement | null>(null);
        const q2Ref = useRef<HTMLSelectElement | null>(null);
        const a2Ref = useRef<HTMLInputElement | null>(null);
        const q3Ref = useRef<HTMLSelectElement | null>(null);
        const a3Ref = useRef<HTMLInputElement | null>(null);
        const [image_url, setimage] = useState('');

        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);


        const navigate = useNavigate();

        const [questionsFromDynamoDB, setQuestions] = useState<string[]>([]);

        const location = useLocation();

        const isSignUpUsingSocial: string = new URLSearchParams(location.search).get('social_account');

        useEffect(() => {
            fetchData(GET_getQuestionsFromDynamo).then((data) => {
                data = JSON.parse(data['body']);
                setQuestions(data);
            });
        }, []);


        const sendSNSNotificationOnUserRegistration = async (email: string) => {
            const payload = {"email": email};
            console.log(payload);
            postData(POST_KhushiSNSNotificationURL, payload).then((res) => {
                console.log(res.statusCode, res.body);
            });
        }

        const handleSignup = async (e: { preventDefault: () => void; }) => {
            e.preventDefault();

            const userCredential = await createUserWithEmailAndPassword(auth, emailRef.current.value, passwordRef.current.value);

            console.log(userCredential);


            const user = userCredential.user;
            console.log(user);
            ImageUpload(fileRef.current.files[0], user.uid).then((url) => {
                setimage(url);
                console.log(url);
            });
            const user_email = emailRef.current.value;
            const payload = {
                firebase_user_id: user.uid,
                first_name: firstnameRef.current.value,
                last_name: lastnameRef.current.value,
                question1: q1Ref.current.value,
                answer1: a1Ref.current.value,
                question2: q2Ref.current.value,
                answer2: a2Ref.current.value,
                question3: q3Ref.current.value,
                answer3: a3Ref.current.value,
                email: emailRef.current.value,
                image: image_url
            };
            putData(PUT_storeUserToDynamoDB, payload).then((isDataUpdated) => {
                console.log(isDataUpdated);
                sendEmailVerification(user)
                    .then(() => {
                        console.log('Email verification email sent');
                        sendSNSNotificationOnUserRegistration(user_email);
                    })
                    .catch((error) => {
                        console.error('Error sending verification email:', error);
                    }).finally(() => {
                    navigate('/')
                });

            })
        }


        const handleFacebookSignUp = async () => {
            const user = await signInWithFacebook();
            console.log('Logged in user:', user);
            await storeToDynamo(user);
            navigate('/')
        }


        const storeToDynamo = async (user: User) => {
            console.log("storeToDynamo", user);
            const image_url = await ImageUpload(fileRef.current.files[0], user.uid);
            const userToSave = {
                firebase_user_id: user.uid,
                first_name: user.displayName.split(" ")[0].trim(),
                last_name: user.displayName.split(" ")[1].trim(),
                question1: q1Ref.current.value,
                answer1: a1Ref.current.value,
                question2: q2Ref.current.value,
                answer2: a2Ref.current.value,
                question3: q3Ref.current.value,
                answer3: a3Ref.current.value,
                email: user.email,
                image: image_url
            };
            putData(PUT_storeUserToDynamoDB, userToSave).then((isUserSaved) => {
                if (isUserSaved) {
                    console.log("Login Success with Social Media account: Google ");
                    sendSNSNotificationOnUserRegistration(user.email);
                } else {
                    console.error("Google login success but user info not saved in dynamodb")
                }
            });
        }

        const handleGoogleSignUp = async () => {
            const user = await signUpWithGoogle();
            console.log(user);
            await storeToDynamo(user);
            navigate('/')
        };


        return (
            <>
                <Box maxW="md" mx="auto" p="4">
                    <Heading mb="4">Sign Up</Heading>
                    <form onSubmit={handleSignup}>
                        {!isSignUpUsingSocial && <FormControl mb="4">
                            <FormLabel>Email:</FormLabel>
                            <Input
                                type="email"
                                // value={email}
                                ref={emailRef}
                                // onChange={(e) => setEmail(e.target.value)}
                                variant="outline"
                                size="md"
                            />
                        </FormControl>
                        }
                        {!isSignUpUsingSocial &&
                            <FormControl mb="4">
                                <FormLabel>Password:</FormLabel>
                                <Input
                                    type="password"
                                    variant="outline"
                                    size="md"
                                    ref={passwordRef}
                                />
                            </FormControl>
                        }
                        {!isSignUpUsingSocial &&
                            <FormControl mb="4">
                                <FormLabel>First Name:</FormLabel>
                                <Input
                                    type="text"
                                    ref={firstnameRef}
                                    variant="outline"
                                    size="md"
                                />
                            </FormControl>
                        }
                        {!isSignUpUsingSocial &&
                            <FormControl mb="4">
                                <FormLabel>Last Name:</FormLabel>
                                <Input
                                    type="text"
                                    ref={lastnameRef}
                                    variant="outline"
                                    size="md"
                                />
                            </FormControl>
                        }
                        <FormControl mb="4">
                            <FormLabel>Upload Profile Picture:</FormLabel>
                            <Input type="file" ref={fileRef}/>
                        </FormControl>
                        <FormControl mb="4">
                            <FormLabel>Question 1:</FormLabel>
                            <Select
                                ref={q1Ref}
                                variant="outline"
                                size="md"
                            >
                                {questionsFromDynamoDB.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl mb="4">
                            <FormLabel>Answer 1:</FormLabel>
                            <Input
                                type="text"
                                ref={a1Ref}
                                variant="outline"
                                size="md"
                            />
                        </FormControl>
                        <FormControl mb="4">
                            <FormLabel>Question 2:</FormLabel>
                            <Select
                                ref={q2Ref}
                                variant="outline"
                                size="md"
                            >
                                {questionsFromDynamoDB.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </Select>

                        </FormControl>
                        <FormControl mb="4">
                            <FormLabel>Answer 2:</FormLabel>
                            <Input
                                type="text"
                                ref={a2Ref}
                                variant="outline"
                                size="md"
                            />
                        </FormControl>
                        <FormControl mb="4">
                            <FormLabel>Question 3:</FormLabel>
                            <Select
                                ref={q3Ref}
                                variant="outline"
                                size="md"
                            >
                                {questionsFromDynamoDB.map((option, index) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </Select>

                        </FormControl>
                        <FormControl mb="4">
                            <FormLabel>Answer 3:</FormLabel>
                            <Input
                                type="text"
                                ref={a3Ref}
                                variant="outline"
                                size="md"
                            />
                        </FormControl>
                        {!isSignUpUsingSocial &&
                            <Button type="submit" colorScheme="blue" mr="4">
                                Sign Up
                            </Button>
                        }
                        {isSignUpUsingSocial === 'google' &&
                            <Button colorScheme="blue" onClick={handleGoogleSignUp}>
                                Sign up using Google
                            </Button>
                        }
                        {isSignUpUsingSocial === 'facebook' &&
                            <Button colorScheme="blue" onClick={handleFacebookSignUp}>
                                Sign up using Facebook
                            </Button>
                        }
                    </form>
                </Box>

            </>
        );
    }
;

export default Signup;