import React from "react";
import {Box, Text} from "@chakra-ui/react";

export interface GameData {
    win: number;
    loss: number;
    "total points earned": number;
    "games played": number;
}

interface GameStatsProps {
    data: GameData;
}

const GameStats: React.FC<GameStatsProps> = ({data}) => {
    const {win, loss, "total points earned": totalPoints, "games played": gamesPlayed} = data;

    const winLossRatio = loss === 0 ? win : win / loss;

    return (
        <Box p={4} borderWidth="1px" borderRadius="md">
            <Text fontSize="lg" fontWeight="bold">
                Game Stats
            </Text>
            <Text>
                Win/Loss Ratio: {winLossRatio.toFixed(2)}
            </Text>
            <Text>Total Points Earned: {totalPoints}</Text>
            <Text>Games Played: {gamesPlayed}</Text>
            <Text>Win: {win}</Text>
            <Text>Loss: {loss}</Text>

        </Box>
    );
};

export default GameStats;
