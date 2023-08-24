import { useState } from "react";
import "../App.css";
import {
  Button,
  Card,
  CardHeader,
  Flex,
  HStack,
  Heading,
  Input,
  Spinner,
  Tag,
} from "@chakra-ui/react";
import axios from "axios";

function App() {
  const [question, setQuestion] = useState("");
  const [tags, setTags] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const handleInputChage = (event: any) => {
    setQuestion(event.target.value);
  };

  const handleGenerateTags = async () => {
    setLoading(true);
    setTags([]);
    axios
      .post(
        "https://tfmew56qbukv67hc2gyss7f7aq0kfytc.lambda-url.us-east-1.on.aws/",
        { question }
      )
      .then(({ data }) => {
        setTags(data);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <Flex
        style={{ height: "100vh" }}
        justifyContent="center"
        alignItems="center"
      >
        <Card align="center" minW="lg" p="2" height="fit-content">
          <CardHeader>
            <Heading size="lg">Question Taging </Heading>
          </CardHeader>
          <Input
            placeholder="Please Enter the question.."
            name="question"
            value={question}
            onChange={handleInputChage}
          />
          {loading ? (
            <Spinner mt="2" />
          ) : (
            <Button colorScheme="blue" mt="2" onClick={handleGenerateTags}>
              Generate Tags
            </Button>
          )}
          {tags.length > 0 && (
            <>
              <Heading size="sm" mt="2" style={{ textAlign: "left" }}>
                Tags generated
              </Heading>
              <HStack spacing={4} marginTop="3">
                {tags.map((tag: any, index: number) => (
                  <Tag size="lg" key={index} variant="solid" colorScheme="cyan">
                    {tag}
                  </Tag>
                ))}
              </HStack>
            </>
          )}
        </Card>
      </Flex>
    </div>
  );
}

export default App;
