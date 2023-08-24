import React, {useState} from 'react';
import {initializeApp} from 'firebase/app';
import 'firebase/auth';
import {firebaseConfig} from "../CloudConfig/getFirebaseConfig";
import {getAuth, sendPasswordResetEmail} from "firebase/auth";
import {Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay} from '@chakra-ui/react';

interface ResetPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({isOpen, onClose}) => {

    const [email, setEmail] = useState('');


    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const handleResetPassword = () => {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                console.log("Password Reset mail sent successfully");
            })
            .catch((error) => {
                console.log(`Error: ${error.message}`);
                alert(error.message);
            }).finally(() => onClose);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>Reset Password</ModalHeader>
                <ModalBody>
                    <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={handleResetPassword}>
                        Reset Password
                    </Button>
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ResetPasswordModal;
