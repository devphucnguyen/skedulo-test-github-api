import React from "react";
import { IGitHubUser } from "../model";
import { List } from "antd";

interface IProps {
    users: IGitHubUser[];
}

const ListUsers = ({ users }: IProps) => {
    if (users.length === 0) return <></>;

    return (
        <List
            itemLayout="horizontal"
            dataSource={users}
            renderItem={(item, index) => (
                <List.Item>
                    <List.Item.Meta
                        avatar={<img className="avatar" src={item.avatar_url} loading="lazy" />}
                        title={item.login}
                        description={
                            <>
                                <div>
                                    <b>Type: </b>
                                    <span>{item.type}</span>
                                </div>
                                <div>
                                    <b>Score: </b>
                                    <span>{item.score}</span>
                                </div>
                            </>
                        }
                    />
                </List.Item>
            )}
        />
    );
};

export default React.memo(ListUsers);
