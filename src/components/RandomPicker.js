import { useCallback, useEffect, useState, useRef } from "react";
import "../styles.css";

// const TEAM = [
//   "Grant",
//   "Harshit",
//   "Jasmine",
//   "Naji",
//   "Rui",
//   "Thrasher",
// ];
const TEAM = [
  "Andrew",
  "Anuja",
  "Chris",
  "Grant",
  "John",
  "Sumit",
  "Nikitha",
  "Brian",
  "Pauline",
  "Seonyoung"
];

/**
 * 
 <video
        src="https://i.imgur.com/kqLfP3d.mp4"
        autoPlay="true"
        loop
        alt="chuck brown"
      />
 */
const StartPrompt = (props) => (
  <h1>
    <span className="icon" role="img" aria-label=" ">
      🔔
    </span>{" "}
    Stand up time!
  </h1>
);
const EndPrompt = (props) => (
  <h1>
    <span className="icon" role="img" aria-label=" ">
      🏁
    </span>{" "}
    Parking Lot!
  </h1>
);

const TeamMember = ({ handleOnClick, handleOnRemove, name }) => {
  const handleClick = useCallback(() => {
    handleOnClick(name);
  }, [handleOnClick, name]);

  const handleRemove = useCallback(() => {
    handleOnRemove(name);
  }, [handleOnRemove, name]);
  return (
    <span>
      <button onClick={handleClick} type="button">
        {name}
      </button>
      <button type="button" onClick={handleRemove}>
        (X)
      </button>
    </span>
  );
};

const TeamList = ({
  team = [],
  onClickPerson = () => {},
  onClickRemovePerson = () => {}
}) => {
  return (
    <div className="team-list">
      {team.map((name) => (
        <TeamMember
          handleOnClick={onClickPerson}
          handleOnRemove={onClickRemovePerson}
          name={name}
        />
      ))}
    </div>
  );
};

const Timer = ({ durationSeconds = 120, onStart, onEnd }) => {
  const [remaining, setRemaining] = useState(durationSeconds);
  const startTime = useRef(null);
  const timeoutRef = useRef(null);
  const [running, setRunning] = useState(false);

  const reset = useCallback(() => {
    setRunning(false);
    setRemaining(durationSeconds);
    startTime.current = null;
    clearInterval(timeoutRef.current);
  }, [setRunning, setRemaining, startTime, durationSeconds]);

  const handleClick = useCallback(
    (e) => {
      if (!running) {
        setRunning(true);
        startTime.current = new Date().getTime();
      } else {
        setRunning(false);
      }
    },
    [setRunning, running]
  );

  useEffect(() => {
    if (running) {
      timeoutRef.current = setInterval(() => {
        const now = new Date().getTime();
        const delta = (now - startTime.current) / 1000;

        const next = durationSeconds - delta;

        if (next <= 0.5) {
          clearInterval(timeoutRef.current);
          return setRemaining(0);
        }
        setRemaining(durationSeconds - delta);
      }, 16);
    }
    return () => {
      clearInterval(timeoutRef.current);
    };
  }, [running, durationSeconds, setRemaining, timeoutRef]);

  let remMins = Math.floor(remaining / 60);
  let remSecs = Math.round(remaining % 60);

  if (remSecs >= 60) {
    remSecs = 59;
  }

  if (remSecs < 10) {
    remSecs = `0${remSecs}`;
  }

  const rootClass = `timer ${running ? "running" : "stopped"}`;

  return (
    <div className={rootClass}>
      <h2 onClick={handleClick}>
        <span className="mins">{remMins}</span>
        <span className="divider">:</span>
        <span className="seconds">{remSecs}</span>
      </h2>
      <strong className="reset" onClick={reset}>
        ↺
      </strong>
    </div>
  );
};

const RandomPicker = () => {
  const [person, setPerson] = useState(null);
  const [remainingTeam, setRemainingTeam] = useState(TEAM);
  const remainingLength = remainingTeam.length;
  const [parkingLotEnabled, setParkingLotEnabled] = useState(true);
  const [isParkingLot, setIsParkingLot] = useState(false);

  // myArray.splice (myArray.indexOf('c')
  const reset = useCallback(() => {
    setRemainingTeam(TEAM);
    setPerson(null);
    setIsParkingLot(false);
  }, [setRemainingTeam]);

  const pickPerson = useCallback(
    (person) => {
      setPerson(person);
      return setRemainingTeam(remainingTeam.filter((v) => v !== person));
    },
    [setPerson, remainingTeam, setRemainingTeam]
  );

  const removePerson = useCallback(
    (person) => {
      return setRemainingTeam(remainingTeam.filter((v) => v !== person));
    },
    [remainingTeam, setRemainingTeam]
  );

  const pickRandomPerson = useCallback(() => {
    if (remainingLength) {
      const randomIndex = Math.floor(remainingLength * Math.random());
      const nextPerson = remainingTeam[randomIndex];
      setPerson(nextPerson);
      return setRemainingTeam(
        remainingTeam.filter((v, i) => i !== randomIndex)
      );
    }
  }, [setRemainingTeam, remainingTeam, remainingLength]);

  // ⚙
  const enterParkingLot = useCallback(() => {
    setIsParkingLot(true);
  }, [setIsParkingLot]);

  let display = <StartPrompt />;
  if (person) {
    display = <h1>{person}</h1>;
  }

  let nextButtonPrompt = "Next Random Person";
  let nextClickHandler = pickRandomPerson;
  if (!remainingLength) {
    if (parkingLotEnabled) {
      if (isParkingLot) {
        display = <EndPrompt />;
        nextClickHandler = reset;
        nextButtonPrompt = "Reset";
      } else {
        nextClickHandler = enterParkingLot;
        nextButtonPrompt = "Enter Parking Lot";
      }
    }
  }

  return (
    <div className="RandomPicker">
      <div className="remaining-team">
        <TeamList
          team={remainingTeam}
          onClickPerson={pickPerson}
          onClickRemovePerson={removePerson}
        />
      </div>
      <div className="actions">
        <button className="button-next-random" onClick={nextClickHandler}>
          {nextButtonPrompt}
        </button>
        {/* <Timer /> */}
      </div>
      <div className="main-display" onClick={nextClickHandler}>
        {display}
      </div>
      <div className="reset">
        <button className="button-reset" onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default RandomPicker;
