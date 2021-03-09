import './App.css';
import { useEffect, useReducer } from 'react';
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import awsConfig from './aws-exports';
import { AmplifyAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { getCoins, listDeletedUsers, listLists } from './graphql/queries';
import 'semantic-ui-css/semantic.min.css';
import MainHeader from './components/headers/MainHeader';
import Lists from './components/Lists/Lists';
import { Button, Container, Icon } from 'semantic-ui-react';
import { createDeletedUser, deleteList } from './graphql/mutations';
import {
  onCreateList,
  onDeleteList,
  onUpdateList,
} from './graphql/subscriptions';
import ListModal from './components/modals/ListModal';
import DeletedUserList from './components/DeletedUsers/DeletedUserList';
Amplify.configure(awsConfig);

const intialState = {
  id: '',
  title: '',
  description: '',
  lists: [],
  deletedUsers: [],
  isModalOpen: false,
  modalType: '',
};

function listReducer(state = intialState, action) {
  let newList;
  switch (action.type) {
    case 'DESCRIPTION_CHANGED':
      return { ...state, description: action.value };
    case 'TITLE_CHANGED':
      return { ...state, title: action.value };
    case 'UPDATE_LISTS':
      return { ...state, lists: [...action.value, ...state.lists] };
    case 'UPDATE_DELETED_USERS':
      return { ...state, deletedUsers: [...action.value, ...state.deletedUsers] };
    case 'OPEN_MODAL':
      return { ...state, isModalOpen: true, modalType: 'add' };
    case 'CLOSE_MODAL':
      return {
        ...state,
        isModalOpen: false,
        title: '',
        description: '',
        id: '',
      };
    case 'DELETE_LIST':
      console.log(action.value);
      deleteListById(action.value);
      return { ...state };
    case 'DELETE_LIST_RESULT':
      newList = state.lists.filter((item) => item.id !== action.value);
      return { ...state, lists: newList };
    case 'UPDATE_LIST_RESULT':
      const index = state.lists.findIndex(
        (item) => item.id === action.value.id
      );
      newList = [...state.lists];
      delete action.value.listItems;
      newList[index] = action.value;
      return { ...state, lists: newList };
    case 'EDIT_LIST': {
      const newValue = { ...action.value };
      delete newValue.children;
      delete newValue.listItems;
      delete newValue.dispatch;
      console.log(newValue);
      return {
        ...state,
        isModalOpen: true,
        modalType: 'edit',
        id: newValue.id,
        title: newValue.title,
        description: newValue.description,
      };
    }
    case 'DELETE_IDENTIY': {
      console.log('delete identity pressed: ', action.value);
      return { ...state};
    }
    case 'DELETE_BRAZE': {
      console.log('delete braze pressed: ', action.value);
      return { ...state};
    }
    case 'CRISP_DELETED': {
      console.log('crisp deleted pressed: ', action.value);
      // TODO updated the date
      return { ...state};
    }

    case 'REQUEST_COMPLETED': {
      console.log('process completed: ', action.value);
      // TODO updated the date
      return { ...state};
    }

    default:
      console.log('Default action for: ', action);
      return state;
  }
}
async function deleteListById({ id, title, description }) {
  const deletedList = await API.graphql(
    graphqlOperation(deleteList, { input: { id } })
  );
    
  const userEmail = title;  
  const userName = description
  const deletedUser = await API.graphql(graphqlOperation(createDeletedUser, { input: { userEmail, userName, requestedAt: new Date() }}))

  // trigger test lambda calling another API
  const response = await API.graphql(
    graphqlOperation(getCoins, { input: { limit: 10 } })
  );

  console.log('deleted', deletedList);
  console.log('created deleted user', deletedUser);
  console.log('got coins', response);
}

function Main() {
  const [state, dispatch] = useReducer(listReducer, intialState);

  async function fetchList() {
    const { data } = await API.graphql(graphqlOperation(listLists));
    dispatch({ type: 'UPDATE_LISTS', value: data.listLists.items });
  }

  async function fetchDeletedUsers() {    
    const { data } = await API.graphql(graphqlOperation(listDeletedUsers));
    console.log('fetched deleted users with data: ', data);
    dispatch({ type: 'UPDATE_DELETED_USERS', value: data.listDeletedUsers.items });
  }

  useEffect(() => {
    fetchList();
    fetchDeletedUsers();
  }, []);

  useEffect(() => {
    const createListSub = API.graphql(graphqlOperation(onCreateList)).subscribe(
      {
        next: ({ _, value }) => {
          console.log('onCreateList called');
          dispatch({ type: 'UPDATE_LISTS', value: [value.data.onCreateList] });
        },
      }
    );
    const updateListSub = API.graphql(graphqlOperation(onUpdateList)).subscribe(
      {
        next: ({ _, value }) => {
          console.log('onUpdateList called', value);
          dispatch({
            type: 'UPDATE_LIST_RESULT',
            value: value.data.onUpdateList,
          });
        },
      }
    );
    const deleteListSub = API.graphql(graphqlOperation(onDeleteList)).subscribe(
      {
        next: ({ _, value }) => {
          console.log('onDeleteList called');
          dispatch({
            type: 'DELETE_LIST_RESULT',
            value: value.data.onDeleteList.id,
          });
        },
      }
    );
    return () => {
      createListSub.unsubscribe();
      deleteListSub.unsubscribe();
      updateListSub.unsubscribe();
    };
  }, []);

  return (
    <AmplifyAuthenticator>
      <Container style={{ height: '100vh' }}>
        <AmplifySignOut />
        <Button
          className='floatingButton'
          onClick={() => dispatch({ type: 'OPEN_MODAL' })}
        >
          <Icon name='plus' className='floatingButton_icon' />
        </Button>
        <div className='App'>
          <MainHeader />
          
          <Lists lists={state.lists} dispatch={dispatch} />
          <DeletedUserList deletedUsers={state.deletedUsers}/>
        </div>
      </Container>
      <ListModal state={state} dispatch={dispatch} />
    </AmplifyAuthenticator>
  );
}

export default Main;