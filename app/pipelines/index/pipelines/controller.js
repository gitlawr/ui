import Ember from 'ember';
export default Ember.Controller.extend({
  queryParams: ['status', 'sortBy', 'descending'],
  status: 'all',
  sortBy: 'Name',
  filtered: function() {
    var status = this.get('status');

    let out = this.get('model')
    if(status==='all'){
      return out
    }
    debugger
    out = this.get('model').filter(ele=>{
      if((status==='active')
        ===!!ele.isActivate){
        return true
      }
      return false
    });
    return out;
  }.property('model.@each.isActivate'),
});
