import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    // code: {
    //   refreshModel: false
    // },
    // state: {
    //   refreshModel: false
    // },
    login: {
      refreshModel: false
    }
  },
  model: function() {
    return null
  }
});
