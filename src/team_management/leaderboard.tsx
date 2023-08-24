import React, { useState, useEffect } from "react";
import "firebase/auth";
import { Button, Modal } from "antd";

const Leaderboard = () => {
  const teamId = localStorage.getItem("team_id");
  const [scoreData, setScoreData] = useState(null);
  const [gamesPlayed, setGamesPlayed] = useState(null);
  const [allScoreData, setAllScoreData] = useState(null);
  const [userTotals, setUserTotals] = useState(null);
  const [users, setUsers] = useState(null);

  // const teamId = "team_5";
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setUserTotals(getDataByEachUser());
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getAllUsers = async () => {
    try {
      const response = await fetch(
        "https://akabqf470a.execute-api.us-east-1.amazonaws.com/prod",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const res = await response.json();
      console.log(res.body);
      setUsers(res.body);
    } catch (e) {}
  };

  const getDataByEachUser = () => {
    const userEntries = {};
    scoreData?.forEach((item) => {
      const { user_id } = item;
      userEntries[user_id] = (userEntries[user_id] || 0) + 1;
    });
    console.log(userEntries);
    return userEntries;
  };

  const getTeamGameData = async () => {
    try {
      const response = await fetch(
        `https://jypdhmskqa.execute-api.ca-central-1.amazonaws.com/Prod/getScore?teamId=${teamId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const res = await response.json();
      console.log("scoreData", res);
      const groupedData = res.reduce((acc, item) => {
        const { game_id, score } = item;
        if (!acc[game_id]) {
          acc[game_id] = { totalScore: 0, items: [] };
        }
        acc[game_id].totalScore += score;
        acc[game_id].items.push(item);
        return acc;
      }, {});

      setAllScoreData(groupedData);
      setScoreData(res);
      setGamesPlayed(res.length);
    } catch (e) {
      console.log(e);
    }
  };

  const emailToUserData = {};
  if (users) {
    users.forEach((user) => {
      emailToUserData[user.email] = user;
    });
  }

  const newUsers = Array.from(
    new Set(scoreData?.map((entry) => entry.user_id))
  );

  function countEntries(data, user_id, status) {
    let count = 0;
    for (const entry of data) {
      if (entry.user_id === user_id && entry.status === status) {
        count++;
      }
    }
    return count;
  }

  const UserStats = ({ data, users, userData }) => {
    const emailToNameMapping = {};
    userData.forEach((user) => {
      emailToNameMapping[user.email] = `${user.first_name} ${user.last_name}`;
    });

    return (
      <div>
        {users.map((user) => {
          const wins = countEntries(data, user, "win");
          const losses = countEntries(data, user, "loss");
          const ratio = wins / (wins + losses);

          return (
            <div key={user}>
              {/* <h5>User Stats for {user}</h5> */}
              <h6>User Stats for {emailToNameMapping[user]}</h6>
              <p>Name: {emailToNameMapping[user]}</p>
              <p>Total Wins: {wins}</p>
              <p>Total Losses: {losses}</p>
              <p>Win-Loss Ratio: {ratio.toFixed(2)}</p>
            </div>
          );
        })}
      </div>
    );
  };

  useEffect(() => {
    getTeamGameData();
    getAllUsers();
  }, [userTotals]);

  return (
    <>
      <Button type="primary" onClick={showModal}>
        View Leaderboard
      </Button>

      <Modal
        title="Leaderboard"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Total games played by the team: {gamesPlayed}</p>
        <p>Games played by individual users:</p>
        {userTotals && Object.keys(userTotals).length > 0 ? (
          <ul>
            {Object.keys(userTotals).map((email) => (
              <li key={email}>
                {emailToUserData[email] ? (
                  <React.Fragment>
                    {emailToUserData[email].first_name}{" "}
                    {emailToUserData[email].last_name}
                  </React.Fragment>
                ) : (
                  "Unknown User"
                )}{" "}
                : {userTotals[email]}
              </li>
            ))}
          </ul>
        ) : (
          <p>No user entries found.</p>
        )}
        <p>Win/Loss Ratio</p>
        <div>
          <UserStats data={scoreData} users={newUsers} userData={users} />
        </div>
        {allScoreData &&
          Object.entries(allScoreData).map(([id, e]) => (
            <div key={id}>
              <h6>{id}</h6>
              <p>Total Score: {e["totalScore"]}</p>
            </div>
          ))}
      </Modal>
    </>
  );
};

export default Leaderboard;
