import Ember from 'ember';

export default Ember.Route.extend({
  pipeline: Ember.inject.service(),
  model: function(params) {
    var pipelineStore = this.get('pipelineStore');
    var activities = pipelineStore.find('activity',null,{url:`${pipelineStore.baseUrl}/activitys/${params.activity_id}`,forceReload:true})
    return activities;
  },
});
