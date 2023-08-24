import AppRouter from './router';
import 'bootstrap/dist/css/bootstrap.css';
import Header from './shared/header';

import {ChakraProvider} from '@chakra-ui/react'

function App() {
    return (
        <>
            <Header/>
            <ChakraProvider>
                <AppRouter/>
            </ChakraProvider>
        </>
    );
}

export default App;
