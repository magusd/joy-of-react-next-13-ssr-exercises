import { produce } from 'immer';

function persist(items) {
  window.localStorage.setItem('cart', JSON.stringify(items));
}

function load() {
  const items = window.localStorage.getItem('cart');
  if (!items) {
    return [];
  }
  return JSON.parse(items);
}

function reducer(state, action) {
  if (action.type == 'load') {
    console.log('load');
    return load();
  }
  return produce(state, (draftState) => {
    if (!state) {
      draftState = state = [];
    }
    switch (action.type) {

      case 'add-item': {
        const itemIndex = state.findIndex(
          (item) => item.id === action.item.id
        );

        if (itemIndex !== -1) {
          draftState[itemIndex].quantity += 1;
          persist(draftState);
          return;
        }

        draftState.push({
          ...action.item,
          quantity: 1,
        });
        persist(draftState);
        return;
      }

      case 'delete-item': {
        const itemIndex = state.findIndex(
          (item) => item.id === action.item.id
        );

        draftState.splice(itemIndex, 1);
        persist(draftState);
        return;
      }
    }
  });
}

export default reducer;
