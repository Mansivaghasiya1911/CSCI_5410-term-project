import React, { useState, useEffect } from "react";
import "firebase/auth";
import { Button, Modal, Select, Space, Card } from "antd";
import { useNavigate } from "react-router-dom";
import "./acceptInvite.css";

interface User {
  email: string;
  last_name: string;
  first_name: string;
}

interface Team {
  declined: boolean;
  email: string;
  inviteId: string;
  status: boolean;
  teamCreater: boolean;
  teamName: string;
  teamId: string;
}

const { Option } = Select;

const Dashboard = () => {
  // localStorage.setItem("loggedInEmail", "sharshil1299@gmail.com");
  // localStorage.setItem("loggedInName", "Harshil Shah");
  let isPartOfTeam = false;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teamName, setTeamName] = useState(null);
  // const [teamName, setTeamName] = useState("The jugglers");
  const [users, setUsers] = useState<User[]>([]);
  const [subscribedUsers, setSubsribedUsers] = useState<string[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [myTeams, setMyTeams] = useState<Team[]>([]);
  const [loggedInuser, setLoggedInuser] = useState(null);
  const hasTeamsCreatedByUser = myTeams.some((team) => team.teamCreater);

  const navigate = useNavigate();

  const generateTeamName = async () => {
    try {
      const response = await fetch(
        "https://r7h6msp1f2.execute-api.us-east-1.amazonaws.com/1/testName",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: "Generate me a unique one word team name",
          }),
        }
      );
      const res = await response.json();
      setTeamName(res.body);
      if (res) {
        setIsModalOpen(true);
      }
    } catch (e) {}
  };

  const getSubscribedUsers = async () => {
    try {
      const response = await fetch(
        "https://r7h6msp1f2.execute-api.us-east-1.amazonaws.com/1/getUsers",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const res = await response.json();
      console.log(res);
      setSubsribedUsers(res);
      getYourTeams();
    } catch (e) {}
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
      getSubscribedUsers();
    } catch (e) {}
  };

  const sendInvite = async () => {
    // const senderName = localStorage.getItem("loggedInName");
    const senderName = loggedInuser?.first_name + loggedInuser?.last_name;
    console.log(senderName);
    const senderEmail = loggedInuser?.email;
    const response = await fetch(
      "https://r7h6msp1f2.execute-api.us-east-1.amazonaws.com/1/sendInvite",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teamName: teamName,
          email: selectedUsers,
          fromName: senderName,
          fromEmail: senderEmail,
        }),
      }
    );
    const res = await response.json();
    console.log(res);
    getAllUsers();
  };

  const getYourTeams = async () => {
    const loggedInEmail = JSON.parse(localStorage.getItem("user")).email;

    const response = await fetch(
      "https://r7h6msp1f2.execute-api.us-east-1.amazonaws.com/1/getYourTeams",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loggedInEmail,
        }),
      }
    );
    const res = await response.json();
    console.log(res.body);
    setMyTeams(res.body);
  };

  const showModal = () => {
    filterUsersByEmail();
    generateTeamName();
  };

  const handleOk = () => {
    setIsModalOpen(false);
    sendInvite();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleChange = (value: string[]) => {
    console.log(`selected ${value}`);
    setSelectedUsers(value);
  };

  const filterUsersByEmail = () => {
    console.log(users);
    console.log(subscribedUsers);
    const filteredUsers = users.filter((user) =>
      subscribedUsers.includes(user.email)
    );
    console.log(filteredUsers);
    setFilteredUsers(filteredUsers);
  };

  const handleTeamNavigate = (teamId) => {
    navigate(`/team/${teamId}`);
  };

  useEffect(() => {
    setLoggedInuser(JSON.parse(localStorage.getItem("user")));
    getAllUsers();
  }, []);

  return (
    <div className="newClass">
      <Button type="primary" className="create-team" onClick={showModal}>
        Create Team
      </Button>
      <Modal
        title={"Team Name: " + teamName}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Invite"
        okButtonProps={{ style: { backgroundColor: "red", color: "white" } }}
      >
        Lets add some participants
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          placeholder="select one country"
          onChange={handleChange}
          optionLabelProp="label"
        >
          {filteredUsers.map((user, index) => (
            <Option value={user.email} label={user.first_name}>
              <Space>
                {user.first_name} {user.last_name}
                <span role="img" aria-label="China">
                  {user.email}
                </span>
              </Space>
            </Option>
          ))}
        </Select>
        <br />
        <br />
      </Modal>
      <div className="column-container">
        <div className="columns">
          <div className="heading-wrapper">
            <span className="heading-text">Your Teams:</span>
          </div>
          <div className="layout-padding">
            {myTeams.map((team, index) => (
              <>
                {" "}
                <div
                  key={index}
                  onClick={() => handleTeamNavigate(team.teamId)}
                >
                  {team.teamCreater && (
                    <Card style={{ width: 300 }} className="card-container">
                      <div
                        key={index}
                        onClick={() => handleTeamNavigate(team.teamId)}
                      >
                        {team.teamName}
                      </div>
                    </Card>
                  )}
                </div>
              </>
            ))}
            {!hasTeamsCreatedByUser && (
              <div>You haven't created any teams yet!</div>
            )}
          </div>
        </div>
        <div className="columns">
          <div className="heading-wrapper">
            <span className="heading-text">Your Participation:</span>
          </div>
          <div>
            {myTeams.map((team, index) => {
              if (!team.teamCreater && team.status && !team.declined) {
                isPartOfTeam = true;
                return (
                  <Card style={{ width: 300 }} className="card-container">
                    <div
                      key={index}
                      onClick={() => handleTeamNavigate(team.teamId)}
                    >
                      {team.teamName}
                    </div>
                  </Card>
                );
              } else {
                return null;
              }
            })}
            {!isPartOfTeam && (
              <div>
                You are not a part of any other team create by other yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
