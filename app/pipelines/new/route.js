import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    return Ember.RSVP.hash({
      userList: this.get('userStore').find('account', null, {filter: {'kind_ne': ['service','agent']}, forceReload: true})
    }).then(res =>{
      return res
    })
  }
});
