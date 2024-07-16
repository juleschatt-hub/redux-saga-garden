import createSagaMiddleware from '@redux-saga/core';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import logger from 'redux-logger';


import { takeEvery, put } from 'redux-saga/effects';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';



const plantList = (state = [], action) => {
  switch (action.type) {
    case 'ADD_PLANT':
      return [ ...state, action.payload ]
    default:
      return state;
  }
};

function* fetchPlants() {
  try {
    const plantsResponse = yield axios.get('/api/plants');
    yield put({type: 'ADD_PLANT', payload: plantsResponse.data});
  }
  catch(error) {
    console.log('Error fetching plants: ', error);
  }
}

function* sendPlants(action) {
  try {
    const plantsResponse = yield axios({method: 'POST', url: '/api/plants', data: {name: action.payload}});
    yield put({type: 'FETCH_PLANTS'})
  }
  catch(error) {
    console.log('Error posting new plant', error)
  }
}

//ROOT SAGA IS LIKE A STORE FOR SAGAS
function* rootSaga() {
  // takeEvery is what is checking our action types
  // and deciding if a particular saga should run for that action type

  yield takeEvery('FETCH_PLANTS', fetchPlants);
  yield takeEvery('SEND_PLANTS', sendPlants);
}

// 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
// Note that the store is currently not
// configured to utilize redux-saga OR
// redux logger!

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  combineReducers( {plantList} ),
  applyMiddleware(sagaMiddleware, logger)
);

//saga boilerplate
sagaMiddleware.run(rootSaga);
// 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

export default store;
