import React from 'react';

const UserList = ({ users }) => {
  return (
    <ul className="space-y-3">
      {users.map((user, i) => (
        <li
          key={i}
          className="bg-dark p-3 rounded flex items-center gap-3 shadow"
        >
          <div className="bg-primary w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
            {user[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-white">{user}</p>
            <span className="text-xs text-green-400">online ●</span>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default UserList;
