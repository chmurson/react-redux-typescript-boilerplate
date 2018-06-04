import * as React from 'react';
import * as classNames from 'classnames';
import * as style from './style.css';

const initialState = {
  text: ''
}
export type State = Readonly<typeof initialState>;

const defaultProps = {
  text: '',
  placeholder: '',
  newTodo: false,
  editing: false
}

type DefaultProps = typeof defaultProps;
export type Props = {
  onSave: (text: string) => void;
} & DefaultProps

export class TodoTextInput extends React.Component<Props, State> {
  state = initialState;

  constructor(props: Props, context?: any) {
    super(props, context);
    this.state = { ...this.state, text: this.props.text || '' };
    this.handleBlur = this.handleBlur.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(event: React.KeyboardEvent<HTMLInputElement>) {
    const text = event.currentTarget.value.trim();
    if (event.which === 13) {
      this.props.onSave(text);
      if (this.props.newTodo) {
        this.setState({ text: '' });
      }
    }
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ text: event.target.value });
  }

  handleBlur(event: React.FocusEvent<HTMLInputElement>) {
    const text = event.target.value.trim();
    if (!this.props.newTodo) {
      this.props.onSave(text);
    }
  }

  render() {
    const classes = classNames(
      {
        [style.edit]: this.props.editing,
        [style.new]: this.props.newTodo
      },
      style.normal
    );

    return (
      <input
        className={classes}
        type="text"
        autoFocus
        placeholder={this.props.placeholder}
        value={this.state.text}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        onKeyDown={this.handleSubmit}
      />
    );
  }
}
