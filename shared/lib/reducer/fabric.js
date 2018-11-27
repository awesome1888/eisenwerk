export default class ReducerFabric {
  static make(root, initialState = {}, actions = {}) {
    const r = (state = initialState, action) => {
      if (actions[action.type]) {
        return actions[action.type](state, action.payload);
      } else {
        return state;
      }
    };
    r.__root = root;

    return r;
  }

  static makePage(root, initialState = {}, actions = {}) {
    const pageInitial = {
      ready: false, // indicates that the loading process is finished
      loading: false, // indicates that the page is still loading
      data: {}, // contains page data
      meta: {}, // contains page meta, like title and other SEO stuff
      httpCode: null // contains an HTTP status, i.e. 200, 400, 500
    };

    const initialStateMixed = _.cloneDeep(initialState);
    Object.assign(initialStateMixed, _.cloneDeep(pageInitial));

    actions = _.cloneDeep(actions);
    Object.assign(actions, {
      [`${root}.enter`]: state => ({ ...state, loading: true }),
      [`${root}.meta.set`]: (state, payload) => ({ ...state, meta: payload }),
      [`${root}.http-code.set`]: (state, payload) => ({
        ...state,
        httpCode: payload
      }),
      [`${root}.ready`]: state => ({ ...state, ready: true, loading: false }),
      [`${root}.leave`]: state => ({ ...state, ..._.deepClone(pageInitial) })
    });

    return this.make(root, initialStateMixed, actions);
  }

  static makePageActions(code) {
    return {
      ENTER: `${code}.enter`,
      META_SET: `${code}.meta.set`,
      HTTPCODE_SET: `${code}.http-code.set`,
      READY: `${code}.ready`,
      LEAVE: `${code}.leave`
    };
  }
}
