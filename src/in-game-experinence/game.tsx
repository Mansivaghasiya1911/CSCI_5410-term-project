import React, { useEffect, useRef, useState } from "react";
import "./game.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

interface Message {
  value: string;
  sender: any;
}

const Game = () => {
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const socketRef: any = useRef(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const game_id = localStorage.getItem("game_id");
  const team_id = localStorage.getItem("team_id");
  const [currentQuestion, setCurrentQuestion] = useState<any>({});
  const [countdown, setCountdown] = useState<any>(null);
  const [selectedAns, setIsSelected] = useState(-1);
  const [showHint, setshowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [scoreBoard, setScoreBoard] = useState<any>([]);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [showQuestion, setShowQuestion] = useState(true);
  const [lastQuestion, setLastQuestion] = useState<any>({});
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Connecting to WebSocket");
    socketRef.current = new WebSocket(
      "wss://h60a87zy53.execute-api.ca-central-1.amazonaws.com/Prod"
    );

    const socket = socketRef.current;
    // WebSocket connection code goes here

    // Event listener for successful connection
    socket.onopen = () => {
      console.log("WebSocket connection established");
      socketRef.current.send(
        JSON.stringify({
          action: "saveIdentity",
          data: {
            currentUser: currentUser,
            teamId : team_id,
            gameId: game_id,
          },
        })
      );
      socketRef.current.send(
        JSON.stringify({
          action: "getQuestion",
          data: {
            game_id: game_id,
            currentTime: new Date().getTime(),
          },
        })
      );
    };
    // Event listener for receiving messages
    socket.onmessage = (event: any) => {
      console.log(Math.random(), "Received message:", event.data);
      const eventData = JSON.parse(event.data);
      switch (eventData.action) {
        case "getmessage": {
          setMessages((prevMessages) => [...prevMessages, eventData.data]);
          break;
        }
        case "currentQuestion": {
          if (
            JSON.stringify(eventData.data.question) ===
            JSON.stringify(currentQuestion.question)
          ) {
            console.log("Same question received, ignoring");
            break;
          } else {
            setCurrentQuestion(eventData.data);
            setshowHint(false);
            setScoreBoard(eventData.data.score);
            setCountdown(Math.floor(eventData.data.remainingTime / 1000 + 1));
            break;
          }
        }
        case "gameNotStarted": {
          toast.error("Game not started yet", {
            className: "black-background",
          });
          break;
        }
        case "gameOver": {
          toast.error("Game Over");
          navigate("/leaderboard");
          break;
        }
        case "scoreSubmitted" : {
          if(eventData.data.user_id === currentUser.user_id) {
            toast.success("Answer Submitted");
          }
          break;
        }
        default:
          console.log("Received unknown action:", eventData);
          break;
      }
    };

    // Event listener for errors
    socket.onerror = (error: any) => {
      console.error("WebSocket error:", error);
    };

    // Event listener for closing connection
    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };
  }, []);

  useEffect(() => {
    let interval: any;
    if (countdown !== null) {
      interval = setInterval(() => {
        setCountdown((prevCountdown: any) => prevCountdown - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  useEffect(() => {
    if (countdown === 20 && !showQuestion) {
      setShowQuestion(true);
    }
    if (countdown === 0) {
      // // Timer ended, show an alert

      socketRef.current.send(
        JSON.stringify({
          action: "getQuestion",
          data: {
            game_id: game_id,
            currentTime: new Date().getTime(),
          },
        })
      );
      if (score === 0) {
        if (answerSubmitted) {
          toast.error("Incorrect Answer");
        } else {
          toast.error("Time Up");
        }
      } else {
        toast.success("Correct Answer + " + score + " points");
        setScore(0);
      }
      setshowHint(false);
      setIsSelected(-1);
      setCountdown(null); // Reset the countdown
      setAnswerSubmitted(false);
      setShowQuestion(false);
      setLastQuestion(currentQuestion);
    }
  }, [countdown]);

  // const handleStartTimer = (time: any) => {
  //   if (time === "") return;
  //   const durationInSeconds = parseInt(time, 10);
  //   if (isNaN(durationInSeconds) || durationInSeconds <= 0) return;
  // };

  const sendMessage = () => {
    if (message) {
      socketRef.current.send(
        JSON.stringify({
          action: "sendmessage",
          data: {
            value: message,
            sender: currentUser,
            team_id: team_id,
          },
        })
      );
      setMessage("");
    }
  };

  const handleDivClick = (i: number) => {
    if (i === selectedAns) setIsSelected(-1);
    else setIsSelected(i);
  };

  const handleAnswerSubmit = () => {
    setAnswerSubmitted(true);
    const correctAns = currentQuestion?.question?.correctAnswer;
    console.log(correctAns, selectedAns);
    if (selectedAns === correctAns) {
      const finalScore = countdown * 10 + 50 + (showHint ? 0 : 20);
      setScore(finalScore);
      socketRef.current.send(
        JSON.stringify({
          action: "submitAnswer",
          data: {
            game_id: game_id,
            team_id: team_id,
            user_id: currentUser.email,
            score: finalScore,
            startTime: currentQuestion.startTime,
          },
        })
      );
    }
  };

  const handleButtonClick = () => {
    setshowHint(true);
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <div className="container">
              <div className="row">
                <div className="col-md-12 mt-4">
                  <div className="h3">Score Board</div>
                </div>
                <div className="col-md-12">
                  {scoreBoard.map((score: any, index: number) => (
                    <div className="card mt-2" key={index}>
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="h1 p3 me-3">{index + 1}</div>
                          <div className="d-flex flex-column flex-fill">
                            <span>User id: {score.user_id}</span>
                            <span>Team id:{score.team_id}</span>
                          </div>
                          <div className="h5">{score.score}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-9">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <div className="col-md-12">
                    <div className="h2">
                      Time remaining: {countdown !== null && countdown <= 20 ? countdown : "N/A"}{" "}
                      Seconds
                    </div>
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="row mt-4 border rounded pb-3">
                    {showQuestion && (
                      <>
                        <div className="col-md-12 mt-2">
                          <p className="question">
                            Q{currentQuestion?.questionNumber}.{" "}
                            {currentQuestion?.question?.question}
                          </p>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <div
                              className={
                                selectedAns === 0
                                  ? "card cursor-pointer selected"
                                  : "card cursor-pointer"
                              }
                              onClick={() => handleDivClick(0)}
                            >
                              <div className="card-body">
                                <p className="answer m-0 ">
                                  A1. {currentQuestion?.question?.answers[0]}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-12 mt-1">
                            <div
                              className={
                                selectedAns === 1
                                  ? "card cursor-pointer selected"
                                  : "card cursor-pointer"
                              }
                              onClick={() => handleDivClick(1)}
                            >
                              <div className="card-body">
                                <p className="answer m-0 ">
                                  A2. {currentQuestion?.question?.answers[1]}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-12 mt-1">
                            <div
                              className={
                                selectedAns === 2
                                  ? "card cursor-pointer selected"
                                  : "card cursor-pointer"
                              }
                              onClick={() => handleDivClick(2)}
                            >
                              <div className="card-body">
                                <p className="answer m-0 ">
                                  A3. {currentQuestion?.question?.answers[2]}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-12 mt-1">
                            <div
                              className={
                                selectedAns === 3
                                  ? "card cursor-pointer selected"
                                  : "card cursor-pointer"
                              }
                              onClick={() => handleDivClick(3)}
                            >
                              <div className="card-body">
                                <p className="answer m-0 ">
                                  A4. {currentQuestion?.question?.answers[3]}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-12 mt-2">
                            <div className="d-flex justify-content-between w-100">
                              <button
                                className="btn btn-success"
                                onClick={handleButtonClick}
                              >
                                Show Hint
                              </button>
                              <button
                                className="btn btn-primary"
                                disabled={answerSubmitted}
                                onClick={handleAnswerSubmit}
                              >
                                Submit
                              </button>
                            </div>
                          </div>
                          <div className="col-md-12 mt-2">
                            {showHint && (
                              <div>
                                {" "}
                                Hint: {currentQuestion?.question?.hint}{" "}
                              </div>
                            )}
                          </div>
                        </div>{" "}
                      </>
                    )}
                    {!showQuestion && (
                      <>
                        <div className="col-md-12 mt-2">
                          <p className="question">
                            Q{lastQuestion?.questionNumber}.{" "}
                            {lastQuestion?.question?.question}
                          </p>
                        </div>
                        <div className="col-md-12 mt-2">
                          <div className="h4">
                            Correct Option Was :{" "}
                            {lastQuestion?.question?.correctAnswer + 1}
                          </div>
                          <div className="h5 mt-1">
                            {" "}
                            {
                              lastQuestion?.question?.answers[
                                lastQuestion?.question?.correctAnswer
                              ]
                            }
                          </div>
                          <div className="h5 mt-1">
                            {" "}
                            <b>Explanation : </b>
                            {lastQuestion?.question?.explanation}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="col-md-4 h-100 rounded">
                  <div className="row">
                    <div className="col-md-12 mt-4">
                      <div className="h3">Chat window</div>
                    </div>
                    <div className="messages">
                      {messages.map((message, index) => (
                        <div key={index}>
                          {message.sender.first_name} : {message.value}
                        </div>
                      ))}
                    </div>
                    <div className="input-send w-100">
                      <input
                        type="text"
                        className="form-control"
                        value={message}
                        placeholder="Type your message here"
                        onChange={(e) => setMessage(e.target.value)}
                      />
                      <button
                        className="btn btn-primary send-btn"
                        onClick={sendMessage}
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer autoClose={3000} />
    </>
  );
};

export default Game;
