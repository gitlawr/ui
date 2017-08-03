import Ember from 'ember';
export default Ember.Controller.extend({
  queryParams: ['status', 'sortBy', 'descending'],
  status: 'active',
  sortBy: 'Name',
  filtered: function() {
    var status = this.get('status');
    let out = this.get('model')
    if(status==='all'){
      return out
    }
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
