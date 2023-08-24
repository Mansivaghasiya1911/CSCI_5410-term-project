import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {Avatar, Box, Button, Flex, Table, Tbody, Td, Text, Th, Thead, Tr,} from "@chakra-ui/react";
import GameStats, {GameData} from "./GameStates";
import {deleteData, fetchData} from "./service/RestCall";

interface ScoreData {
    startTime: number;
    user_id: string;
    category: string;
    score: number;
    team_id: string;
    status: string;
    id: string;
    game_id: string;
}

interface leader {
    user_id: string;
    value: number;
}

const initialLeaderState: leader = {
    user_id: "user_1",
    value: 0,
};

interface team_data {
    team_id: string;
    team_name: string;
    invite_id: string;
}

const Dashboard = () => {
    const [gameData, setGameData] = useState<GameData | null>(null);
    const [imageUrl, setImageUrl] = useState("");
    const [teamAffiliations, setTeamAffiliations] = useState<team_data[]>([]);
    const [loggedUser, setLoggedUser] = useState(
        JSON.parse(localStorage.getItem("user"))
    );

    const [topScorer, setTopScore] = useState<leader>(initialLeaderState);
    const [topWinLoss, setTopWinLoss] = useState<leader>(initialLeaderState);
    const [topWin, setTopWin] = useState<leader>(initialLeaderState);
    const [topLoss, setTopLoss] = useState<leader>(initialLeaderState);

    const DELETE_khushideletefromteam: string =
        "https://r7h6msp1f2.execute-api.us-east-1.amazonaws.com/1/removeUserFromTeam";
    const GET_khushiTeamsByUserID: string =
        "https://r7h6msp1f2.execute-api.us-east-1.amazonaws.com/1/getTeamsByUserEmail";

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("user")));
        console.log(loggedUser);
        setImageUrl(loggedUser.image_url);

        const GET_mohituserdata =
            "https://jypdhmskqa.execute-api.ca-central-1.amazonaws.com/Prod/getScore?userId=" + loggedUser.email;

        fetchData(GET_mohituserdata).then((res) => {
            console.log(res);
            calculateWinLossAndTotalScore(res);
        });

        let GET_mohituserdata2 =
            "https://jypdhmskqa.execute-api.ca-central-1.amazonaws.com/Prod/getScore";
        try {
            fetchData(GET_mohituserdata2).then((res) => {
                console.log(res);
                const uniqueUserIds = Array.from(new Set(res.map((item: any) => item.user_id)));
                if (uniqueUserIds) {
                    uniqueUserIds.forEach((id) => {
                        const filteredData = res.filter((item: any) => uniqueUserIds.includes(item.user_id));
                        getAchievements(filteredData);
                    });
                } else {
                    console.warn("No users from Mohit's database");
                }
            });
        } catch (error) {
            console.log(error);
            console.warn("try enabling CORS");
        }

        getTeamsByUserId();
    }, []);

    const getTeamsByUserId = () => {
        fetchData(GET_khushiTeamsByUserID + "?user_email=" + loggedUser.email).then(
            (res) => {
                console.log("res from khushi", res);
                const isUniqueTeamId = (
                    team: team_data,
                    index: number,
                    arr: team_data[]
                ) => {
                    const teamIdsSet = new Set(arr.map((item) => item.team_id));
                    return teamIdsSet.has(team.team_id);
                };

                const uniqueTeamData = res.data.filter(isUniqueTeamId);
                console.log(uniqueTeamData);

                setTeamAffiliations(uniqueTeamData);
            }
        );
    };

    const getAchievements = (scores: ScoreData[]) => {
        let winCount = 0;
        let lossCount = 0;
        let totalScore = 0;
        let cu_user_id: string = "";
        scores.forEach((score) => {
            if (score.status === "win") {
                winCount++;
            } else {
                lossCount++;
            }

            totalScore += score.score;
            cu_user_id = score.user_id;
        });
        if (topWin.value < winCount) {
            setTopWin({user_id: cu_user_id, value: winCount});
        }
        if (topLoss.value > lossCount) {
            setTopLoss({user_id: cu_user_id, value: lossCount});
        }
        if (topWinLoss.value < winCount / lossCount) {
            setTopWinLoss({user_id: cu_user_id, value: winCount / lossCount});
        }
        if (topScorer.value < totalScore) {
            setTopScore({user_id: cu_user_id, value: totalScore});
        }
        return {winCount, lossCount, totalScore};
    };

    const handleButtonClick = (team_id: string) => {
        const payload = {
            user_id: loggedUser.email,
            team_id: team_id,
        };
        deleteData(DELETE_khushideletefromteam, payload).then((res) => {
            console.log(res);
            getTeamsByUserId();
        });
    };

    const calculateWinLossAndTotalScore = (scores: ScoreData[]) => {
        let winCount = 0;
        let lossCount = 0;
        let totalScore = 0;
        let totalGames = 0;

        scores.forEach((score) => {
            if (score.status === "win") {
                winCount++;
            } else {
                lossCount++;
            }

            totalScore += score.score;
            totalGames += 1;
        });

        setGameData({
            win: winCount,
            loss: lossCount,
            "total points earned": totalScore,
            "games played": totalGames,
        });

        return {winCount, lossCount, totalScore};
    };

    return (
        <>
            Logged in {loggedUser.email}
            <br/>
            Hi {loggedUser.first_name} {loggedUser.last_name}
            <Box textAlign="left" mt={2} mb={2}>
                <Avatar size="md" src={imageUrl}/>
            </Box>
            <div>
                <Link to="/edituser">
                    <Button colorScheme="blue">Update Profile</Button>
                </Link>
                <Link to="/teamDashboard">
                    <Button colorScheme="blue">Team Dashboard</Button>
                </Link>
            </div>
            <div>
                {gameData ? <GameStats data={gameData}/> : <p>Loading data...</p>}
            </div>
            <Text fontSize="lg" fontWeight="bold">
                Team Affiliations
            </Text>
            {Array.from(teamAffiliations).map((team: team_data) => (
                <Flex align="left">
                    <p>{team.team_name}</p> &nbsp;&nbsp;&nbsp;
                    <Button onClick={() => handleButtonClick(team.team_id)} mb={2}>
                        Leave Team
                    </Button>
                </Flex>
            ))}
            <Text fontSize="lg" fontWeight="bold" mt={3}>
                Top Achievers
            </Text>
            <Table variant="striped" colorScheme="teal" mb={4}>
                <Thead>
                    <Tr>
                        <Th></Th>
                        <Th>User ID</Th>
                        <Th>Achievement</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr>
                        <Th>Lowest Loss</Th>
                        <Td>{topLoss.user_id}</Td>
                        <Td>{topLoss.value}</Td>
                    </Tr>
                    <Tr>
                        <Th>Highest Win</Th>
                        <Td>{topWin.user_id}</Td>
                        <Td>{topWin.value}</Td>
                    </Tr>
                    <Tr>
                        <Th> Highest Win/Loss</Th>
                        <Td>{topWinLoss.user_id}</Td>
                        <Td>{topWinLoss.value}</Td>
                    </Tr>
                    <Tr>
                        <Th>Top Scorer</Th>
                        <Td>{topScorer.user_id}</Td>
                        <Td>{topScorer.value}</Td>
                    </Tr>
                </Tbody>
            </Table>
        </>
    );
};

export default Dashboard;
