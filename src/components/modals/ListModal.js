import { API, graphqlOperation } from 'aws-amplify';
import React, { useState } from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';
import { createList, updateList } from '../../graphql/mutations';
import { useS3 } from '../../hooks/useS3';
import UploadImage from '../HandleImages/UploadImage';

function ListModal({ state, dispatch }) {
  const [uploadToS3] = useS3();
  const [fileToUpload, setFileToUpload] = useState();

  async function saveList() {
    const imageKey = uploadToS3(fileToUpload);
    console.log('imagekey', imageKey);
    const { title, description } = state;
    const slug = title.replace(/\s/g, "");
    const result = await API.graphql(
      graphqlOperation(createList, { input: { title, description, imageKey, slug } })
    );    
    dispatch({ type: 'CLOSE_MODAL' });
    console.log('Save data with result: ', result);
  }

  async function changeList() {
    const { id, title, description } = state;
    const result = await API.graphql(
      graphqlOperation(updateList, { input: { id, title, description } })
    );
    dispatch({ type: 'CLOSE_MODAL' });
    console.log('Edit data with result: ', result);
  }

  function getSelectedFile(fileName) {
    setFileToUpload(fileName);
  }

  return (
    <Modal open={state.isModalOpen} dimmer='blurring'>
      <Modal.Header>
        {state.modalType === 'add' ? 'Create ' : 'Edit '}
        user
      </Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Input
            error={true ? false : { content: 'Please add a name to your list' }}
            label='User Email'
            placeholder='user@example.com'
            value={state.title}
            onChange={(e) =>
              dispatch({ type: 'TITLE_CHANGED', value: e.target.value })
            }
          ></Form.Input>
          <Form.TextArea
            value={state.description}
            onChange={(e) =>
              dispatch({ type: 'DESCRIPTION_CHANGED', value: e.target.value })
            }
            label='User Name'
            placeholder='Max Mustermann'
          ></Form.TextArea>
          <UploadImage getSelectedFile={getSelectedFile} />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button negative onClick={() => dispatch({ type: 'CLOSE_MODAL' })}>
          Cancel
        </Button>
        <Button
          positive
          onClick={state.modalType === 'add' ? saveList : changeList}
        >
          {state.modalType === 'add' ? 'Save ' : 'Update '}
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default ListModal;