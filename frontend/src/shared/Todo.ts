import moment from 'moment';
import { List } from './List';
import { User } from './User';

export interface Todo {
  id: number;
  title: string;
  done: boolean;
  starred: boolean;
  createdAt?: string;
  updatedAt?: string;
  due?: Date | null;
  list?: List;
  sharedWith: User[];
}

export interface InputTypeTodo {
  id?: number;
  title: string;
  done: boolean;
  starred: boolean;
  createdAt?: string;
  updatedAt?: string;
  due?: Date | null;
  list?: List;
  sharedWith: User[];
}
