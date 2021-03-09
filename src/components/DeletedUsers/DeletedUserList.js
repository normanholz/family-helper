import React from 'react';
import { Item } from 'semantic-ui-react';
import DeletedUser from '../DeletedUsers/DeletedUser';

function DeletedUserList({ deletedUsers }) {
  return (
    <div>
      <Item.Group>
        {deletedUsers.map((user) => (
          <DeletedUser key={user.id} {...user}>
            {user.title}
          </DeletedUser>
        ))}
      </Item.Group>
    </div>
  );
}

export default DeletedUserList;