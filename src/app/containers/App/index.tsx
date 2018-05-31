import * as React from 'react';
import * as style from './style.css';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { RouteComponentProps } from 'react-router';
import { createSelector } from 'reselect';
import { TodoActions } from 'app/actions';
import { RootState } from 'app/reducers';
import { TodoModel } from 'app/models';
import { omit } from 'app/utils';
import { Header, TodoList, Footer } from 'app/components';
import { getFilter } from 'app/selectors';
import { FooterContainer } from 'app/containers/App/FooterContainer';


const FILTER_FUNCTIONS: Record<TodoModel.Filter, (todo: TodoModel) => boolean> = {
  [TodoModel.Filter.SHOW_ALL]: () => true,
  [TodoModel.Filter.SHOW_ACTIVE]: (todo) => !todo.completed,
  [TodoModel.Filter.SHOW_COMPLETED]: (todo) => todo.completed
};

export namespace App {
  export interface Props extends RouteComponentProps<void> {
    filter: TodoModel.Filter;
    filteredTodos: TodoModel[],
    activeCount: number;
    completedCount: number;
    actions: TodoActions;
  }
}

const getFilteredTodos = createSelector(
  getFilter,
  (state: RootState) => state.todos,
  (filter, todos) => (filter ? todos.filter(FILTER_FUNCTIONS[filter]) : todos)
);

@connect(
  (state: RootState): Pick<App.Props, 'filter' | 'filteredTodos'> => {
    return {
      filter: getFilter(state),
      filteredTodos: getFilteredTodos(state),
    };
  },
  (dispatch: Dispatch): Pick<App.Props, 'actions'> => ({
    actions: bindActionCreators(omit(TodoActions, 'Type'), dispatch)
  })
)
export class App extends React.Component<App.Props> {
  static defaultProps: Partial<App.Props> = {
    filter: TodoModel.Filter.SHOW_ALL
  };

  constructor(props: App.Props, context?: any) {
    super(props, context);
    this.handleClearCompleted = this.handleClearCompleted.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  handleClearCompleted(): void {
      this.props.actions.clearCompleted();
  }

  handleFilterChange(filter: TodoModel.Filter): void {
    this.props.history.push(`#${filter}`);
  }

  render() {
    const { actions, filteredTodos} = this.props;    

    return (
      <div className={style.normal}>
        <Header addTodo={actions.addTodo} />
        <TodoList todos={filteredTodos} actions={actions} />
        <FooterContainer      
          onClickFilter={this.handleFilterChange}
        />
      </div>
    );
  }
}
