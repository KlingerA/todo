import createRootReducer from '../../reducers/rootReducer';
import { getToken } from './login.selector';
import { loginSuccessAction } from '../actions/login.actions';

describe('Login Selector', () => {
  describe('getToken', () => {
    it('should return the correct initial value', () => {
      const rootReducer = createRootReducer({} as any);
      const state = rootReducer(undefined, {} as any);
      const token = getToken(state);
      expect(token).toBe('');
    });
    it('should return the correct value of a changed token', () => {
      const rootReducer = createRootReducer({} as any);
      const state = rootReducer(undefined, loginSuccessAction('token'));
      const token = getToken(state);
      expect(token).toBe('token');
    });
  });
});
