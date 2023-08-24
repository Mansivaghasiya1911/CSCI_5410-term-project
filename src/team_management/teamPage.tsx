import React, { useState, useEffect } from "react";
import "./acceptInvite.css";
import { useParams } from "react-router-dom";
import { Button, message, Popconfirm } from "antd";
import LeaderBoard from "./leaderboard";
import { useNavigate } from "react-router-dom";

const TeamPage = () => {
  const { teamId } = useParams();
  const [teamName, setTeamName] = useState(null);
  const [teamMembers, setTeamMembers] = useState<TeamData[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [creater, setCreater] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [updatedSecondArray, setUpdatedSecondArray] = useState([]);
  const [createrAllDetails, setCreaterAllDetails] = useState([]);
  const loggedInEmail = JSON.parse(localStorage.getItem("user")).email;
  console.log(loggedInEmail);
  const navigate = useNavigate();

  interface TeamData {
    inviteId: string;
    teamName: string;
    status: boolean;
    teamCreater: boolean;
    email?: string;
    teamId?: string;
    first_name?: string;
    last_name?: string;
    isAdmin?: boolean;
  }

  interface User {
    email: string;
    last_name: string;
    first_name: string;
  }

  const getTeamDetails = async () => {
    const loggedInEmail = JSON.parse(localStorage.getItem("user")).email;

    const response = await fetch(
      "https://r7h6msp1f2.execute-api.us-east-1.amazonaws.com/1/getTeamMembers",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teamId: teamId,
        }),
      }
    );
    const res = await response.json();
    console.log(res.body);
    const teamCreatorEntry = res.body.find(
      (entry) => entry.teamCreater === true
    );
    const adminEntry = res.body.find((entry) => entry.isAdmin === true);
    setCreater(teamCreatorEntry?.email);
    setCreaterAllDetails(teamCreatorEntry);
    setAdmin(adminEntry?.email);
    setTeamName(res.body.length > 0 ? res.body[0].teamName : "");
    setTeamMembers(res.body);
    getAllUsers();
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

  const promoteUser = async (additionalArg) => {
    try {
      const response = await fetch(
        "https://r7h6msp1f2.execute-api.us-east-1.amazonaws.com/1/promoteUser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inviteId: additionalArg,
          }),
        }
      );
      const res = await response.json();
      console.log(res.body);
      getTeamDetails();
    } catch (e) {}
  };

  const deleteRemoveUser = async (additionalArg) => {
    try {
      const response = await fetch(
        "https://r7h6msp1f2.execute-api.us-east-1.amazonaws.com/1/leaveremoveTeam",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inviteId: additionalArg,
          }),
        }
      );
      const res = await response.json();
      console.log(res.body);
      getTeamDetails();
    } catch (e) {}
  };
  const confirm = (e: React.MouseEvent<HTMLElement>, additionalArg) => {
    console.log(e);
    console.log(additionalArg);
    message.success("Player Removed");
    deleteRemoveUser(additionalArg);
  };

  const confirmPromote = (e: React.MouseEvent<HTMLElement>, additionalArg) => {
    console.log(e);
    console.log(additionalArg);
    message.success("Player Promoted");
    promoteUser(additionalArg);
  };

  const cancel = (e: React.MouseEvent<HTMLElement>) => {
    console.log(e);
  };

  const handleNavigation = () => {
    navigate("/exploreGame");
  };

  const handleLeaderboardNavigation = () => {
    navigate("/leaderboard");
  };

  useEffect(() => {
    localStorage.setItem("team_id", "");
    localStorage.setItem("team_id", teamId);
    getTeamDetails();
  }, []);

  useEffect(() => {
    if (users.length > 0 && teamMembers.length > 0) {
      const emailToNameMap = {};
      users.map((obj) => {
        emailToNameMap[obj.email] = {
          firstName: obj.first_name,
          lastName: obj.last_name,
        };
      });

      const updatedArray = teamMembers.map((obj) => ({
        ...obj,
        ...(emailToNameMap[obj.email] || {}),
      }));

      setUpdatedSecondArray(updatedArray);
    }
  }, [users, teamMembers]);

  return (
    <div className="newClass">
      <div className="name-header">
        <div className="team-info">
          <h2>{teamName}</h2>
        </div>
      </div>
      <div className="team-members">
        <div className="column">
          <div className="team-leader">
            <p>Team Leader:</p>
            {updatedSecondArray
              .filter((entry) => entry.teamCreater)
              .map((entry, index) => (
                <p key={index}>
                  {entry.firstName} {entry.lastName}
                </p>
              ))}
          </div>
        </div>
        <div className="column">
          <div className="team-members-list">
            <p className="member-header">Team Members:</p>
            <div>
              {updatedSecondArray
                .filter((entry) => !entry.teamCreater)
                .map((entry, index) => (
                  <p key={index}>
                    {entry.firstName} {entry.lastName} {entry.email}
                    <br />
                    {creater === loggedInEmail ? (
                      <>
                        <Popconfirm
                          title="Remove the user"
                          description="Are you sure to remove the user from this team?"
                          onConfirm={(e) => confirm(e, entry.inviteId)}
                          onCancel={cancel}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button danger>Remove</Button>
                        </Popconfirm>
                        {!entry.isAdmin ? (
                          <Popconfirm
                            title="Promote the team member"
                            description="Are you sure to promote the user to admin?"
                            onConfirm={(e) => confirmPromote(e, entry.inviteId)}
                            onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                          >
                            <Button danger>Promote to Admin</Button>
                          </Popconfirm>
                        ) : (
                          <Button>Admin</Button>
                        )}
                      </>
                    ) : (
                      <div>
                        {admin === loggedInEmail ? (
                          <div>
                            {admin !== entry.email && (
                              <Popconfirm
                                title="Remove the user"
                                description="Are you sure to remove the user from this team?"
                                onConfirm={(e) => confirm(e, entry.inviteId)}
                                onCancel={cancel}
                                okText="Yes"
                                cancelText="No"
                              >
                                <Button danger>Remove</Button>
                              </Popconfirm>
                            )}

                            {admin === entry.email && (
                              <div>
                                <Popconfirm
                                  title="Leave Game"
                                  description="Are you sure you want to leave?"
                                  onConfirm={(e) => confirm(e, entry.inviteId)}
                                  onCancel={cancel}
                                  okText="Yes"
                                  cancelText="No"
                                >
                                  <Button danger>Leave team</Button>
                                </Popconfirm>
                                <Button>You are admin</Button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div>
                            {!entry.isAdmin &&
                              !entry.teamCreater &&
                              loggedInEmail === entry.email && (
                                <Popconfirm
                                  title="Leave Game"
                                  description="Are you sure you want to leave?"
                                  onConfirm={(e) => confirm(e, entry.inviteId)}
                                  onCancel={cancel}
                                  okText="Yes"
                                  cancelText="No"
                                >
                                  <Button danger>Leave team</Button>
                                </Popconfirm>
                              )}
                          </div>
                        )}
                      </div>
                    )}
                    <br />
                  </p>
                ))}
            </div>
          </div>
        </div>
      </div>
      <div className="team-members" style={{ marginLeft: "-70px" }}>
        <div className="buttons">
          <LeaderBoard />
          <Button type="primary" onClick={handleNavigation}>
            Explore Games
          </Button>
          <Button type="primary" onClick={handleLeaderboardNavigation}>
            Leaderboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
