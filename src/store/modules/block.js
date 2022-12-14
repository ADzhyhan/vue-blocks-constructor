import Vue from 'vue';
import {
  ADD_BLOCK,
  REMOVE_BLOCK,
  CHANGE_PAGE
} from '../mutation-types';
// import {} from '../action-types';

function save() {
  const parsed = JSON.stringify(state.blocks);
  localStorage.setItem('blocks', parsed);
}


const state = {
  blocks: localStorage.getItem('blocks') ? JSON.parse(localStorage.getItem('blocks')) : [],
  currPage: 1,
};

const getters = {
  blocks: state => state.blocks || [],
  currPage: state => state.currPage,
};

const actions = {
 
};

const mutations = {
  [ADD_BLOCK](state, obj) {
    const block = {
      title: obj.title, 
      image: obj.image,
      link: obj.link, 
      description: obj.description
    }
    state.blocks.unshift(block)
    save();
    // console.log(state.blocks)
    return
  },
  [REMOVE_BLOCK](state, obj) {
    const element = state.blocks.findIndex(e => e.title === obj.title);
    Vue.delete(state.blocks, element)
    save();
  },
  [CHANGE_PAGE](state, page) {
    state.currPage = page
  },
};
export default {
  state,
  getters,
  actions,
  mutations,
};
