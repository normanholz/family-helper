import './App.css';
import { useEffect, useState, useReducer } from 'react'
import Amplify, {API, graphqlOperation} from 'aws-amplify';
import awsConfig from './aws-exports';
import { AmplifyAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listLists } from './graphql/queries';
import { createList } from './graphql/mutations';
import { onCreateList } from './graphql/subscriptions'
import MainHeader from './components/headers/MainHeader';
import 'semantic-ui-css/semantic.min.css';
import Lists from './components/List/Lists';
import { Container, Button, Icon, Modal, Form } from 'semantic-ui-react'

Amplify.configure(awsConfig);

const initialState = {
  title: '',
  description: '',
  isModalOpen: false,
}

function listReducer(state = initialState, action) {
  switch (action.type) {
    case 'DESCRIPTION_CHANGED':
      return {...state, description: action.value}
    case 'TITLE_CHANGED':
      return {...state, title: action.value}
    case 'OPEN_MODAL':
      return {...state, isModalOpen: true}
    case 'CLOSE_MODAL':
      return {...state, isModalOpen: false, title: '', description: ''}
    default:
      console.log('Default action for', action)
      return state;
  }
}


function App() {

  const [state, dispatch] = useReducer(listReducer, initialState)

  const [lists, setLists] = useState([]);
  const [newList, setNewList] = useState('');

  async function fetchList() {
    const { data } = await API.graphql(graphqlOperation(listLists));
    setLists(data.listLists.items);
    console.log(data);
  }
  
  useEffect(() => {
    fetchList();
  }, []);

    useEffect(() => {
    if (newList !== '') {      
      setLists([newList, ...lists])
    }
  }, [newList])

  function addToList({ data }) {
    setNewList(data.onCreateList);    
  }

  useEffect(() => {
    let subscription = API.graphql(graphqlOperation(onCreateList))
    .subscribe(
      {next: ({provider, value}) => {
      console.log('[DEBUG]', provider, value)
      addToList(value);
    }  
  });
  return () => subscription.unsubscribe();
  }, [])

  async function saveList() {
    const { title, description} = state;
    const result = await API.graphql(graphqlOperation(createList, {input: {title, description}}));
    dispatch({type: 'CLOSE_MODAL'});
    console.log('Save data with result:', result);
  }

  return (
    <AmplifyAuthenticator>            
      <Container style={{height: '100vh'}}>
      <AmplifySignOut/>
      <Button className='floatingButton' onClick={() => dispatch({type: 'OPEN_MODAL'})}><Icon name='plus' className="floatingButton_icon"/></Button>
      <div className="App">
        <MainHeader/>        
        <Lists lists={lists}/>
      </div>
      </Container>
      <Modal open={state.isModalOpen} dimmer='blurring'>
        <Modal.Header>
          Create your list
        </Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Input             
            error={true ? false : {content: 'Please add a title to your list'}}
            label='Title' placeholder='My pretty List' value={state.title}
            onChange={(e)=> dispatch({type: 'TITLE_CHANGED', value: e.target.value})}            
            />            
            <Form.TextArea label='Description' placeholder='Things that my pretty list is about' value={state.description}            
            onChange={(e)=> dispatch({type: 'DESCRIPTION_CHANGED', value: e.target.value})}      
            ></Form.TextArea>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={() => dispatch({type: 'CLOSE_MODAL'})}>Cancel</Button>
          <Button positive onClick={saveList}>Save</Button>
        </Modal.Actions>
      </Modal>
    </AmplifyAuthenticator>
  );
}

export default App;
