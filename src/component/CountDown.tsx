import React, { useEffect, useRef, useState } from "react";

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
        <div>
            <div>Oops! You have exceeded Github's request limit. Please try again in:</div>
            <div style={{ margin: "20px auto", textAlign: "center", display: "flex" }}>
                {days !== 0 && <div>{days}:</div>}
                {hours !== 0 && <div>{hours.toString().padStart(2, "0")}:</div>}
                {minutes !== 0 && <div>{minutes.toString().padStart(2, "0")}:</div>}
                {remainingSeconds !== 0 && <div>{remainingSeconds.toString().padStart(2, "0")} seconds</div>}
            </div>
        </div>
    );
};

export default CountDown;
