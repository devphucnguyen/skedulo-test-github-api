import { useDebounce } from "@uidotdev/usehooks";
import { Input } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";
import CountDown from "./component/CountDown";
import ListUsers from "./component/ListUser";
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
                if (res.data?.items && res?.data?.total_count) {
                    setUsers(res.data?.items);
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
            <h2>Searching for github user...</h2>
            <Search
                className="search-input"
                placeholder="Searching for github user..."
                disabled={timeToWait != 0}
                size="large"
                loading={loading}
                value={searchTerm}
                onChange={(e) => {
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
                <ListUsers users={users} />
            )}
        </div>
    );
}

export default App;
