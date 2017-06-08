import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    var store = this.get('store');

    return Ember.RSVP.hash({
      approvers: this.get('userStore').find('password').then(() => {
        return this.get('userStore').find('account', null, {filter: {'kind_ne': ['service','agent']}, forceReload: true});
      })
    });
  }
});
