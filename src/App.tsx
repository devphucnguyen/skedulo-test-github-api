import { useDebounce } from "@uidotdev/usehooks";
import { Input, Spin } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";
import CountDown from "./component/CountDown";
import ListUsers from "./component/ListUser";
import emptyIcon from "./component/empty.png";
import { IGitHubUser } from "./model";

const { Search } = Input;

interface IParams {
    q: string;
    page?: number;
    per_page?: number;
}

const getTimeToWait = () => {
    const resetInSeconds = localStorage.getItem("resetInSeconds");
    if (!resetInSeconds) return;

    const nowInSeconds = Math.round(new Date().valueOf() / 1000);
    const _timeToWait = parseInt(resetInSeconds) - nowInSeconds;

    if (_timeToWait > 0) {
        return _timeToWait;
    }
};

function App() {
    const [searchTerm, setSearchTerm] = useState("");
    const debounceSearchTerm = useDebounce(searchTerm, 300);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<IGitHubUser[]>([]);
    const [timeToWait, setTimeToWait] = useState(getTimeToWait() || 0);
    const [noResult, setNoResult] = useState(false);

    useEffect(() => {
        if (!debounceSearchTerm || debounceSearchTerm.length < 3) {
            setUsers([]);
            return;
        }

        fetchGitHubUser({ q: debounceSearchTerm, per_page: 100 });
    }, [debounceSearchTerm]);

    const fetchGitHubUser = async (params: IParams) => {
        setLoading(true);

        await axios
            .get("https://api.github.com/search/users", { params })
            .then((res) => {
                if (res.data?.items) {
                    setUsers(res.data?.items);
                    if (res.data?.items?.length === 0) {
                        setNoResult(true);
                    }
                }
            })
            .catch((err) => {
                const resetInSeconds = err.response.headers.get("x-ratelimit-reset");
                localStorage.setItem("resetInSeconds", resetInSeconds);

                const nowInSeconds = Math.round(new Date().valueOf() / 1000);
                setTimeToWait(resetInSeconds - nowInSeconds);
                setSearchTerm("");
                setUsers([]);

                return err;
            });

        setLoading(false);
    };

    return (
        <div className="app">
            <h2>Searching for GitHub user</h2>
            <Search
                className="search-input"
                placeholder="Please enter at least 3 characters"
                disabled={timeToWait != 0}
                size="large"
                value={searchTerm}
                onChange={(e) => {
                    setNoResult(false);
                    setSearchTerm(e.target.value);
                }}
            />

            {timeToWait !== 0 ? (
                <CountDown
                    timeToWaitInSecond={timeToWait}
                    onDone={() => {
                        setTimeToWait(0);
                    }}
                />
            ) : (
                <div style={{ position: "relative" }}>
                    {loading && (
                        <div style={{ position: "absolute", zIndex: 10, top: 50, left: "50%", transform: "translate(-50%, 0)" }}>
                            <Spin tip="Loading" />
                        </div>
                    )}
                    {noResult ? (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <img height={150} src={emptyIcon} alt="emptyIcon" />
                            <div>Sorry! Seems like no matches were found</div>
                        </div>
                    ) : (
                        <ListUsers users={users} loading={loading} />
                    )}
                </div>
            )}
        </div>
    );
}

export default App;
