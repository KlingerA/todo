import React, { useState } from 'react';
import { Todo } from '../../../shared/Todo';
import { MenuContainer, StarContainer } from './Item.styles';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { Link } from 'react-router-dom';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import {
  CheckCircleOutlineIcon,
  Title,
  ListItem,
} from '../../../shared/components/Item/Item.styles';

interface Props {
  todo: Todo;
  onChange: (todo: Todo) => void;
  onRemove: (todo: Todo) => void;
}

const MENU_WIDTH = 53;

const Item: React.FC<Props> = ({ todo, onChange, onRemove }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <ListItem>
      {!todo.done && (
        <RadioButtonUncheckedIcon
          onClick={() => onChange({ ...todo, done: true })}
        />
      )}
      {todo.done && (
        <CheckCircleOutlineIcon
          onClick={() => onChange({ ...todo, done: false })}
        />
      )}
      <Title done={todo.done}>
        {todo.title}

        {todo.subtasks.length > 0 && (
          <span>
            &nbsp;(
            {todo.subtasks.reduce((prev, curr) => {
              if (curr.done) {
                return prev + 1;
              }
              return prev;
            }, 0)}{' '}
            / {todo.subtasks.length})
          </span>
        )}
      </Title>
      <StarContainer
        onClick={() => onChange({ ...todo, starred: !todo.starred })}
      >
        {todo.starred ? <StarIcon /> : <StarBorderIcon />}
      </StarContainer>
      <MoreVertIcon
        onClick={() => {
          setShowMenu(!showMenu);
        }}
      />
      <MenuContainer style={{ width: showMenu ? MENU_WIDTH : 0 }}>
        <DeleteIcon
          onClick={() => {
            onRemove(todo);
            setShowMenu(false);
          }}
        />
        <Link to={`/edit/${todo.id}`}>
          <EditIcon onClick={() => setShowMenu(false)} />
        </Link>
      </MenuContainer>
    </ListItem>
  );
};
export default Item;
