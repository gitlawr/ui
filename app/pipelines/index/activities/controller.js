import Ember from 'ember';
export default Ember.Controller.extend({
  queryParams: ['status','sortBy','descending'],
  status: 'all',
  sortBy:'start_ts',
  descending: true,
  filtered: function() {
    debugger
    var status = this.get('status')
    let out = this.get('model')
    .filter(ele=>{

      if(status==='all'){
        return true
      }
      return ele.status === status
    })
    
    return out.map(ele=>{
      return {
        ...ele,
        name: ele.pipeline.name,
        repository: ele.pipeline.stages[0].steps[0].repository,
        branch: ele.pipeline.stages[0].steps[0].branch,
      }
    });;
  }.property('model.@each.status'),
});
