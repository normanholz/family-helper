
import React from 'react';
import { Item, Icon } from 'semantic-ui-react';

function DeletedUser(props) {
  const { id, userEmail, userName, requestedAt, deletedIdentityAt, deletedCrispAt, deletedBrazeAt, completedRequestAt } = props;
  return (
    <Item>
      <Item.Content>
        <Item.Header>
          {`Deleted User: ${userEmail}`}
          </Item.Header>
          <Item.Extra>        
          {`Username: ${userName}`}
          <Icon name='delete calendar' />
          {new Date(requestedAt).toDateString()}
          <Icon name='user delete' />
          {new Date(deletedIdentityAt).toDateString()}
          <Icon name='adversal' />
          {new Date(deletedBrazeAt).toDateString()}
          <Icon name='chat' />
          {new Date(deletedCrispAt).toDateString()}
          <Icon name='check' />
          {new Date(completedRequestAt).toDateString()}          
        </Item.Extra>
      </Item.Content>
    </Item>
  );
}

export default DeletedUser;