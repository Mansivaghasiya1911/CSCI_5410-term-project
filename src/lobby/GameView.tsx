import React, { useState } from "react";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@chakra-ui/react";

const TriviaTable: React.FC<any> = ({ items }) => {
  const [loading, setLoading] = useState(false);

  const naviagte = useNavigate();

  const handleClick = (item) => {
    const user = JSON.parse(localStorage.getItem("user"));

    localStorage.setItem(
      "user",
      JSON.stringify({ ...user, game_id: item.game_id })
    );

    localStorage.setItem("game_id", item.game_id);

    const payload = { user_id: user.first_name, game_id: item.game_id };

    if (user) {
      setLoading(true);
      axios
        .post(
          "https://2wvawigrqxe5jgwad57evqhtxu0fwbpe.lambda-url.us-east-1.on.aws/",
          payload
        )
        .then(({ data }) => {
          if (data.success) {
            naviagte("/lobby");
          }
        })
        .catch((error) => {
          alert("API FAILED");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.log("No data found in local storage.");
    }
  };

  return (
    <div>
      {loading ? (
        <Flex
          justifyContent="center"
          alignItems="center"
          style={{ height: "80vh" }}
        >
          <Spinner />
        </Flex>
      ) : (
        <>
          <Heading size="md" mb={4}></Heading>
          <Flex flexWrap="wrap">
            {items?.map((item: any, key: any): any => (
              <Box
                key={key}
                p={4}
                borderWidth="1px"
                borderRadius="md"
                m={2}
                minWidth="300px"
                width="100%"
              >
                <Heading size="md" mb={2}>
                  {item.game_name}
                </Heading>
                <Text mb={2}>{item.description}</Text>
                <Text mb={2}>
                  <b>Difficulty :</b> {item.difficulty_level}
                </Text>
                <Text mb={2}>
                  <b>Time Frame :</b> {item.time_frame}
                </Text>
                <Text mt={2}>
                  <b>Category :</b> {item.category}
                </Text>
                <Text mt={2}>
                  <b>Participants :</b> {item.participants}
                </Text>
                <Text mt={2}>
                  <b>Game ID :</b> {item.game_id}
                </Text>
                <Button
                  mt={4}
                  colorScheme="blue"
                  onClick={() => handleClick(item)}
                >
                  Join
                </Button>
              </Box>
            ))}
          </Flex>
        </>
      )}
    </div>
  );
};

export default TriviaTable;
