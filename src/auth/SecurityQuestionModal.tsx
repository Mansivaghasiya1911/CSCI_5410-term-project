import {
    Box,
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text
} from "@chakra-ui/react";
import React, {useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";
import {postData} from "./service/RestCall";

const POST_check_security_question_dynamo: string = 'https://j8kaa89tm2.execute-api.us-east-1.amazonaws.com/prod';

export const QuestionModal = ({isModalOpen, handleModalToggle, questions, loggedInUserId}) => {
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
    useEffect(() => {
        if (isModalOpen) {
            inputRefs.current = Array.from({length: questions.length}, (_, index) => inputRefs.current[index] || null);
        }
    }, [isModalOpen, questions]);

    const navigate = useNavigate();

    function doLogin() {

        const payload = {
            "user_id": loggedInUserId,
            "a1": inputRefs['current'][0].value,
            "a2": inputRefs['current'][1].value,
            "a3": inputRefs['current'][2].value
        };

        console.log("payload", payload);

        postData(POST_check_security_question_dynamo, payload).then((data) => {
            if (data) {
                data = data['user_info']
                console.log(data);
                localStorage.setItem('user', JSON.stringify({
                    user_id: data.user_id,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    email: data.email,
                    image_url: data.image
                }));
                navigate('/dashboard');
            } else {
                console.error("2 factor auth failed");
            }
        });
    }

    return (
        <>
            <Modal isOpen={isModalOpen} onClose={handleModalToggle}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Security Questions</ModalHeader>
                    <ModalBody>
                        {questions.map((question: string, index: number) => (
                            <Box key={index} mb="6">
                                <Text fontSize="m" fontWeight="bold">
                                    {question}
                                </Text>
                                <Input
                                    type="text"
                                    variant="outline"
                                    size="md"
                                    ref={(el) => (inputRefs.current[index] = el)} // Set the ref based on the index
                                />
                            </Box>
                        ))}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" onClick={() => {
                            doLogin();
                        }}>
                            Submit
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );

}
