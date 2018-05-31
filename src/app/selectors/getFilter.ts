import { TodoModel } from "app/models";
import { createSelector } from "reselect";
import { RootState } from "app/reducers";

export const FILTER_VALUES = (Object.keys(TodoModel.Filter) as (keyof typeof TodoModel.Filter)[]).map(
  (key) => TodoModel.Filter[key]
);

export const getFilter = createSelector(
  (state: RootState) => state.router,
  (router) => {
    const hash = router.location && router.location.hash.replace('#', '');
    return FILTER_VALUES.find((value) => value === hash) || TodoModel.Filter.SHOW_ALL;
  }
);