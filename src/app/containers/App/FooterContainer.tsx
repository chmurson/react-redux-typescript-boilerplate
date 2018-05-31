import { connect } from 'react-redux';
import { Footer } from "../../components/Footer";
import { RootState } from 'app/reducers';
import { createSelector } from 'reselect';
import { getFilter } from "../../selectors/index";
import { Dispatch, bindActionCreators } from 'redux';
import { TodoActions } from 'app/actions';

const getActiveTodosCount = createSelector(
  (state: RootState) => state.todos,
  (todos) => todos.length - todos.filter((todo) => todo.completed).length
);

const getCompletedTodosCount = createSelector(
  (state:RootState)=>state.todos,
  (todos)=>todos.reduce((count, todo) => (todo.completed ? count + 1 : count), 0)
)

export const FooterContainer = connect<
  Pick<Footer.Props, 'filter' | 'activeCount' | 'completedCount'>,
  Pick<Footer.Props, 'onClickClearCompleted'>,
  Pick<Footer.Props, 'onClickFilter'>
>(
  (state:RootState) => ({
    filter: getFilter(state),
    activeCount: getActiveTodosCount(state),
    completedCount: getCompletedTodosCount(state)
  }),
  (dispatch: Dispatch) => bindActionCreators({
    onClickClearCompleted: TodoActions.clearCompleted
  },dispatch)
)(Footer);