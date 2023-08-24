import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ChakraProvider } from "@chakra-ui/react";
import Kommunicate from "@kommunicate/kommunicate-chatbot-plugin";

Kommunicate.init("6cc61b66203b8085147ad5c4b6be383", {
  automaticChatOpenOnNavigation: true,
  popupWidget: true,
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  // <React.StrictMode>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  // {/* </React.StrictMode> */}
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
