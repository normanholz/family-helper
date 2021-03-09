
import React from 'react';
import { Item, Icon, Table } from 'semantic-ui-react';

function DeletedUser(props) {
  const { id, userEmail, userName, requestedAt, deletedIdentityAt, deletedCrispAt, deletedBrazeAt, completedRequestAt } = props;
  return (
    
        <Table>
            <Table.Header>
                <Table.HeaderCell><Icon name='envelope' />Email</Table.HeaderCell>
                <Table.HeaderCell><Icon name='address card' />UserName</Table.HeaderCell>
                <Table.HeaderCell><Icon name='delete calendar' />Requested</Table.HeaderCell>
                <Table.HeaderCell><Icon name='user delete' />Identity</Table.HeaderCell>
                <Table.HeaderCell><Icon name='adversal' />Braze</Table.HeaderCell>
                <Table.HeaderCell><Icon name='chat' />Crisp</Table.HeaderCell>
                <Table.HeaderCell><Icon name='check' />Completed</Table.HeaderCell>
            </Table.Header>
            <Table.Body>
                <Table.Row>
                    <Table.Cell>{userEmail}</Table.Cell>
                    <Table.Cell>{userName}</Table.Cell>
                    <Table.Cell>{new Date(requestedAt).toLocaleTimeString()}</Table.Cell>
                    <Table.Cell>{new Date(deletedIdentityAt).toLocaleTimeString()}</Table.Cell>
                    <Table.Cell>{new Date(deletedBrazeAt).toLocaleTimeString()}</Table.Cell>
                    <Table.Cell>{new Date(deletedCrispAt).toLocaleTimeString()}</Table.Cell>
                    <Table.Cell>{new Date(completedRequestAt).toLocaleTimeString()}</Table.Cell>                    
                </Table.Row>
            </Table.Body>
        </Table>      
  );
}

export default DeletedUser;