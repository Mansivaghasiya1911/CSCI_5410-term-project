import React, {useEffect} from 'react';
import Kommunicate from '@kommunicate/kommunicate-chatbot-plugin';

function ChatComponent() {
    useEffect(() => {
        Kommunicate.init('6cc61b66203b8085147ad5c4b6be383', {
            automaticChatOpenOnNavigation: true, popupWidget: true,
        });
    }, []);

    return (<></>);
}

export default ChatComponent;
