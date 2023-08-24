import { useState } from "react";
import "./leaderboard.css";
import "react-toastify/dist/ReactToastify.css";


const Leaderboard = () => {
  const [iframeSrc, setIframeSrc] = useState(
    "https://ca-central-1.quicksight.aws.amazon.com/sn/embed/share/accounts/627830518910/dashboards/c2ecec32-3e07-472c-987a-ba711ae47c78?directory_alias=msojitra"
  );

  const handleButtonClick = (newSrc: any) => {
    setIframeSrc(newSrc);
  };

  return (
    <>
      <div className="container">
        <div className="row mt-2">
          <div className="d-flex align-items-center">
            <button
              className="btn btn-primary mx-1"
              onClick={() =>
                handleButtonClick(
                  "https://ca-central-1.quicksight.aws.amazon.com/sn/embed/share/accounts/627830518910/dashboards/c2ecec32-3e07-472c-987a-ba711ae47c78?directory_alias=msojitra#p.LastNDays=1"
                )
              }
            >
              Daily
            </button>{" "}
            |
            <button
              className="btn btn-primary mx-1"
              onClick={() =>
                handleButtonClick(
                  "https://ca-central-1.quicksight.aws.amazon.com/sn/embed/share/accounts/627830518910/dashboards/c2ecec32-3e07-472c-987a-ba711ae47c78?directory_alias=msojitra#p.LastNDays=7"
                )
              }
            >
              Weekly
            </button>{" "}
            |
            <button
              className="btn btn-primary mx-1"
              onClick={() =>
                handleButtonClick(
                  "https://ca-central-1.quicksight.aws.amazon.com/sn/embed/share/accounts/627830518910/dashboards/c2ecec32-3e07-472c-987a-ba711ae47c78?directory_alias=msojitra#p.LastNDays=30"
                )
              }
            >
              Monthly
            </button>{" "}
            |
            <button
              className="btn btn-primary mx-1"
              onClick={() =>
                handleButtonClick(
                  "https://ca-central-1.quicksight.aws.amazon.com/sn/embed/share/accounts/627830518910/dashboards/c2ecec32-3e07-472c-987a-ba711ae47c78?directory_alias=msojitra"
                )
              }
            >
              All-Time
            </button>
          </div>
          <div className="col-md-12">
            <iframe width="1200" height="720" src={iframeSrc}></iframe>
          </div>
        </div>
      </div>
    </>
  );
};

export default Leaderboard;
