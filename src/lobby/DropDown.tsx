// MyComponent.tsx

import React, { useState, useEffect, useMemo } from "react";
import { Box, Button, Flex, Heading, Select } from "@chakra-ui/react";
import GameFilter from "./GameFilter";
import axios from "axios";
import { debug } from "console";
import TriviaTable from "./GameView";
import { useNavigate } from "react-router-dom";

interface GameData {
  game_name: string;
  difficulty_level: string;
  time_frame: string;
  description: string;
  category: string;
  participants: number;
  game_id: string;
}

const difficultyLevels = [
  "Easy",
  "Medium",
  "Hard",
  "Beginner",
  "Intermediate",
  "Advanced",
  "Novice",
  "Expert",
  "Simple",
  "Challenging",
];
const categories = [
  "General Knowledge",
  "History",
  "Science",
  "Geography",
  "Literature",
  "Movies",
  "Music",
  "Sports",
];
const timeFrames = ["30", "60", "90", "120"];

const MyComponent: React.FC = () => {
  const navigate = useNavigate();
  const [responseData, setResponseData] = useState<any>(null);
  const [items, setItems] = useState<any>([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedTimeFrame, setSelectedTimeFrame] = useState("");

  const handleCategoryChange = (event: any) => {
    setSelectedCategory(event.target.value);
  };

  const handleDifficultyChange = (event: any) => {
    setSelectedDifficulty(event.target.value);
  };

  const handleTimeFrameChange = (event: any) => {
    setSelectedTimeFrame(event.target.value);
  };

  const handleFilter = () => {
    console.log(selectedCategory, selectedDifficulty, selectedTimeFrame);
  };

  const filteredItems = useMemo(() => {
    let dataItems = [...items];
    if (selectedCategory) {
      dataItems = dataItems.filter(
        (item) => item.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    if (selectedDifficulty) {
      dataItems = dataItems.filter(
        (item) =>
          item.difficulty_level.toLowerCase() ===
          selectedDifficulty.toLowerCase()
      );
    }
    if (selectedTimeFrame) {
      dataItems = dataItems.filter(
        (item) => item.time_frame === selectedTimeFrame
      );
    }
    return dataItems;
  }, [selectedCategory, selectedDifficulty, selectedTimeFrame, items]);

  console.log(filteredItems);

  useEffect(() => {
    axios
      .post(
        "https://wekfkkwfwo5uj3n63ww7jk2baa0fixnf.lambda-url.us-east-1.on.aws/"
      )
      .then((response) => {
        setResponseData(JSON.stringify(response.data.all_data));
        setItems(response.data.all_data.Items);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <Box p={4}>
      <Heading size="md" mb={2}>
        Trivia Game Filters
      </Heading>
      <Flex alignItems="center" mb={2}>
        <Box mr={4}>
          <label>
            Category:
            <Select value={selectedCategory} onChange={handleCategoryChange}>
              <option value="">All</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </label>
        </Box>

        <Box mr={4}>
          <label>
            Difficulty Level:
            <Select
              value={selectedDifficulty}
              onChange={handleDifficultyChange}
            >
              <option value="">All</option>
              {difficultyLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </Select>
          </label>
        </Box>

        <Box>
          <label>
            Time Frame:
            <Select value={selectedTimeFrame} onChange={handleTimeFrameChange}>
              <option value="">All</option>
              {timeFrames.map((frame) => (
                <option key={frame} value={frame}>
                  {frame}
                </option>
              ))}
            </Select>
          </label>
        </Box>
      </Flex>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={() => navigate("/tagQuestion")}>
          Suggest Questions
        </Button>
      </Box>
      <div>
        <TriviaTable items={filteredItems} />
      </div>
    </Box>
  );
};

export default MyComponent;
