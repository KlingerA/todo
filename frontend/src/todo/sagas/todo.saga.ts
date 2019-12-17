import axios, { AxiosResponse } from 'axios';
import { takeLatest, put, select } from '@redux-saga/core/effects';
import { Todo } from '../../shared/Todo';
import {
  loadTodosSuccessAction,
  LOAD_TODOS,
  SAVE_TODO,
  saveTodoAction,
  saveTodoSuccessAction,
  deleteTodoAction,
  DELETE_TODO,
  deleteTodoSuccessAction,
} from '../actions/todo.actions';
import { ActionType } from 'typesafe-actions';
import { getToken } from '../../login/selectors/login.selector';
import update from 'immutability-helper';

function* loadTodos() {
  const token = yield select(getToken);
  const { data: todos } = yield axios.get<Todo[]>(
    `${process.env.REACT_APP_SERVER}/todo`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const todosWithSubtasks = todos.map((todo: Todo) => {
    if (todo.subtasks) {
      return todo;
    } else {
      return update(todo, { subtasks: { $set: [] } });
    }
  });

  yield put(loadTodosSuccessAction(todosWithSubtasks));
}

function* save({ payload: todo }: ActionType<typeof saveTodoAction>) {
  const token = yield select(getToken);
  let response: AxiosResponse<Todo>;
  if (todo.id) {
    response = yield axios.put<Todo>(
      `${process.env.REACT_APP_SERVER}/todo/${todo.id}`,
      todo,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } else {
    response = yield axios.post<Todo>(
      `${process.env.REACT_APP_SERVER}/todo/`,
      todo,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
  yield put(saveTodoSuccessAction(response.data));
}

function* remove({ payload: todo }: ActionType<typeof deleteTodoAction>) {
  const token = yield select(getToken);
  yield axios.delete(`${process.env.REACT_APP_SERVER}/todo/${todo.id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  yield put(deleteTodoSuccessAction(todo));
}

export default function* todoSaga() {
  yield takeLatest(LOAD_TODOS, loadTodos);
  yield takeLatest(SAVE_TODO, save);
  yield takeLatest(DELETE_TODO, remove);
}
