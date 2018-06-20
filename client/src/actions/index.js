import axios from 'axios';

const fetchUser = (dispatch) => {
  return function() {
    axios
      .get('/api/current_user')
      .then(res => dispatch({ type: FETCH_USER, payload: res }));
  };
};
