import { Todo } from '../../shared/Todo';
import {
  LOAD_TODOS_SUCCESS,
  SAVE_TODO_SUCCESS,
  DELETE_TODO_SUCCESS,
  SEARCH,
  loadTodosSuccessAction,
  saveTodoSuccessAction,
  deleteTodoSuccessAction,
  searchAction,
} from '../actions/todo.actions';
import update from 'immutability-helper';
import {
  CREATE_SUBTASK_SUCCESS,
  DELETE_SUBTASK,
  UPDATE_SUBTASK_SUCCESS,
  createSubtaskSuccessAction,
  updateSubtaskSuccessAction,
  deleteSubtaskAction,
} from '../actions/subtask.actions';
import db from '../../db/db';
import { ActionType } from 'typesafe-actions';

export interface State {
  todos: Todo[];
  search: string;
}

const initialState: State = {
  todos: [],
  search: '',
};

export default function(
  state: State = initialState,
  action: ActionType<
    | typeof loadTodosSuccessAction
    | typeof saveTodoSuccessAction
    | typeof deleteTodoSuccessAction
    | typeof createSubtaskSuccessAction
    | typeof updateSubtaskSuccessAction
    | typeof deleteSubtaskAction
    | typeof searchAction
  >
): State {
  switch (action.type) {
    case LOAD_TODOS_SUCCESS:
      if (navigator.onLine) {
        db.table('todo').clear();
        db.table('todo').bulkAdd(action.payload);
      }
      return update(state, { todos: { $set: action.payload } });
    case SAVE_TODO_SUCCESS:
      const index = state.todos.findIndex(
        todo => todo.id === action.payload.id
      );
      if (index > -1) {
        return update(state, { todos: { [index]: { $set: action.payload } } });
      } else {
        return update(state, { todos: { $push: [action.payload] } });
      }
    case DELETE_TODO_SUCCESS:
      const deleteIndex = state.todos.findIndex(
        todo => todo.id === action.payload.id
      );
      return update(state, { todos: { $splice: [[deleteIndex, 1]] } });
    case SEARCH:
      return update(state, { search: { $set: action.payload } });
    case CREATE_SUBTASK_SUCCESS:
      const todoId = action.payload.todo.id
        ? action.payload.todo.id
        : action.payload.todo;
      const todoIndex = state.todos.findIndex(todo => todo.id === todoId);
      const subtask = update(action.payload, {
        todo: { $set: action.payload.todo.id as any },
      });
      return update(state, {
        todos: { [todoIndex]: { subtasks: { $push: [subtask] } } },
      });
    case UPDATE_SUBTASK_SUCCESS:
      const todoIndex3 = state.todos.findIndex(
        todo => todo.id === (action.payload.todo as any)
      );
      const subtaskIndex2 = state.todos[todoIndex3].subtasks!.findIndex(
        subtask => subtask.id === action.payload.id
      );
      return update(state, {
        todos: {
          [todoIndex3]: {
            subtasks: { [subtaskIndex2]: { $set: action.payload } },
          },
        },
      });
    case DELETE_SUBTASK:
      const todoId2 = action.payload.todo.id
        ? action.payload.todo.id
        : action.payload.todo;
      const todoIndex2 = state.todos.findIndex(todo => todo.id === todoId2);
      const subtaskIndex = state.todos[todoIndex2].subtasks!.findIndex(
        subtask => subtask.id === action.payload.id
      );
      return update(state, {
        todos: { [todoIndex2]: { subtasks: { $splice: [[subtaskIndex, 1]] } } },
      });
    default:
      return state;
  }
}
