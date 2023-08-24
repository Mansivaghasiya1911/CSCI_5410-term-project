import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import "./acceptInvite.css";
import { useParams } from "react-router-dom";

const AcceptInvite = () => {
  const { teamName, sender, subscribee, uuid } = useParams();
  const navigate = useNavigate();

  const acceptInvite = async () => {
    const response = await fetch(
      "https://r7h6msp1f2.execute-api.us-east-1.amazonaws.com/1/inviteResponse",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uuid: uuid,
          response: true,
        }),
      }
    );
    const res = await response.json();
    console.log(res);
    navigate("/accepted");
  };

  const rejectInvite = async () => {
    const response = await fetch(
      "https://r7h6msp1f2.execute-api.us-east-1.amazonaws.com/1/inviteResponse",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uuid: uuid,
          response: false,
        }),
      }
    );
    const res = await response.json();
    console.log(res);
    navigate("/rejected");
  };
  const handleAccept = () => {
    acceptInvite();
  };

  const handleDecline = () => {
    rejectInvite();
  };

  return (
    <>
      <div className="center-container">
        Hi!!
        <br />
        User: {subscribee}
        <br />
        You received Invitation to Team {teamName}
        <br />
        This invitation is send by {sender}
        <br />
        <Button type="primary" onClick={handleAccept}>
          Accept
        </Button>
        <Button type="primary" onClick={handleDecline}>
          Decline
        </Button>
      </div>
    </>
  );
};

export default AcceptInvite;
