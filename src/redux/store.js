import { createStore } from 'redux';

function store() {
  return createStore((state = {
    img: '',
    uniform: {}
  }, action) => ({
    img: action.img,
    uniform: action.uniform
  }));
}

export default store;