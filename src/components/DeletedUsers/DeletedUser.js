
import React from 'react';
import { Item } from 'semantic-ui-react';

function DeletedUser(props) {
  const { id, userEmail, userName, requestedAt, deletedIdentityAt, deletedCrispAt, completedRequestAt } = props;
  return (
    <Item>
      <Item.Content>
        <Item.Header>
          {`Deleted User: ${userEmail} ${id}`}
          </Item.Header>
          <Item.Extra>        
          {`Username: ${userName}`}
          {new Date(requestedAt).toDateString()}
          {new Date(deletedIdentityAt).toDateString()}
          {new Date(deletedCrispAt).toDateString()}
          {new Date(completedRequestAt).toDateString()}
        </Item.Extra>
      </Item.Content>
    </Item>
  );
}

export default DeletedUser;