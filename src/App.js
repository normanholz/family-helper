import './App.css';
import { useEffect, useState } from 'react'
import Amplify, {API, graphqlOperation} from 'aws-amplify';
import awsConfig from './aws-exports';
import { AmplifyAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listLists } from './graphql/queries'
import MainHeader from './components/headers/MainHeader';
import 'semantic-ui-css/semantic.min.css';
import Lists from './components/List/Lists';
import { Container, Button, Icon, Modal } from 'semantic-ui-react'

Amplify.configure(awsConfig);

function App() {
  const [lists, setLists] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  async function fetchList() {
    const {data} = await API.graphql(graphqlOperation(listLists));
    setLists(data.listLists.items);
    console.log(data);
  }
  
  useEffect(() => {
    fetchList();
  }, []);

  function toggleModal(shouldOpen) {
      setIsModalOpen(shouldOpen);
  }

  return (
    <AmplifyAuthenticator>            
      <Container style={{height: '100vh'}}>
      <AmplifySignOut/>
      <Button className='floatingButton' onClick={() => toggleModal(true)}><Icon name='plus' className="floatingButton_icon"/></Button>
      <div className="App">
        <MainHeader/>        
        <Lists lists={lists}/>
      </div>
      </Container>
      <Modal open={isModalOpen} dimmer='blurring'>
        <Modal.Header>
          Create your list
        </Modal.Header>
        <Modal.Content>Form to be added later</Modal.Content>
        <Modal.Actions>
          <Button negative onClick={() => toggleModal(false)}>Cancel</Button>
          <Button positive onClick={() => toggleModal(false)}>Save</Button>
        </Modal.Actions>
      </Modal>
    </AmplifyAuthenticator>
  );
}

export default App;
