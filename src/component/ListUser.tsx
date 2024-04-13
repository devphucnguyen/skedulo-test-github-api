import React from "react";
import { IGitHubUser } from "../model";
import { List } from "antd";

interface IProps {
    users: IGitHubUser[];
}

const ListUsers = ({ users }: IProps) => {
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
                                <div>{item.type}</div>
                                <div>{item.score}</div>
                            </>
                        }
                    />
                </List.Item>
            )}
        />
    );
};

export default React.memo(ListUsers);
