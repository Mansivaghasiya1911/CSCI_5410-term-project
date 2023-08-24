import React from 'react';
import { Box, Select, Button } from '@chakra-ui/react';

interface GameFilterProps {
  timeFrames: string[];
  categories: string[];
  participants: number[];
  onFilter: (timeFrame: string, category: string, participants: number) => void;
}

const GameFilter: React.FC<GameFilterProps> = ({ timeFrames, categories, participants, onFilter }) => {
  const [selectedTimeFrame, setSelectedTimeFrame] = React.useState<string>('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('');
  const [selectedParticipants, setSelectedParticipants] = React.useState<number>(0);

  const handleFilter = () => {
    onFilter(selectedTimeFrame, selectedCategory, selectedParticipants);
  };

  return (
    <Box>
      <Select
        placeholder="Select Time Frame"
        value={selectedTimeFrame}
        onChange={(e) => setSelectedTimeFrame(e.target.value)}
      >
        {timeFrames.map((timeFrame) => (
          <option key={timeFrame} value={timeFrame}>
            {timeFrame}
          </option>
        ))}
      </Select>
      <Select
        placeholder="Select Category"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </Select>
      <Select
        placeholder="Select Participants"
        value={selectedParticipants.toString()}
        onChange={(e) => setSelectedParticipants(parseInt(e.target.value))}
      >
        {participants.map((participant) => (
          <option key={participant} value={participant}>
            {participant}
          </option>
        ))}
      </Select>
      <Button onClick={handleFilter}>Filter</Button>
    </Box>
  );
};

export default GameFilter;