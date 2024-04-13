import React, { useEffect, useRef, useState } from "react";
import sadIcon from "./error-sad-icon.jpg";
console.log("sadIcon: ", sadIcon);

function secondsToDHMS(seconds: number) {
    seconds = Number(seconds); // Ensure seconds is a number
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return { days, hours, minutes, remainingSeconds };
}

interface IProps {
    timeToWaitInSecond: number;
    onDone: () => void;
}

const CountDown = ({ timeToWaitInSecond, onDone }: IProps) => {
    const [remainingSecond, setRemainingSecond] = useState(timeToWaitInSecond);
    const ref = useRef<{ interval: any }>({ interval: null });

    useEffect(() => {
        ref.current.interval = setInterval(() => {
            setRemainingSecond((prev) => {
                if (prev === 1) {
                    clearInterval(ref.current?.interval);
                    onDone();
                }

                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(ref.current?.interval);
    }, [timeToWaitInSecond]);

    const { days, hours, minutes, remainingSeconds } = secondsToDHMS(remainingSecond);

    return (
        <div style={{ display: "flex", alignItems: "center", flexDirection: "column", color: "grey" }}>
            <img style={{ margin: "auto" }} width={200} height={200} src={sadIcon} alt="error-icon" />
            <div style={{ textAlign: "center" }}>Oops! You have exceeded Github's request limit</div>

            <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ marginRight: 10 }}>Please try again in: </span>
                <b style={{ margin: "20px auto", textAlign: "center", display: "flex" }}>
                    {days !== 0 && <div>{days}:</div>}
                    {hours !== 0 && <div>{hours.toString().padStart(2, "0")}:</div>}
                    {minutes !== 0 && <div>{minutes.toString().padStart(2, "0")}:</div>}
                    {remainingSeconds !== 0 && <div>{remainingSeconds.toString().padStart(2, "0")}</div>}
                </b>
            </div>
        </div>
    );
};

export default CountDown;
