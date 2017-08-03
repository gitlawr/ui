import Ember from 'ember'
import Resource from 'ember-api-store/models/resource';

export default Resource.extend({
  type: 'activity',
  router: Ember.inject.service(),
  actions:{
    rerun: function() {
      return this.doAction('rerun')
      .then((res)=>{
        this.get('router').transitionTo('pipelines.activity', this.get('id'))
      });
    },
    approve: function(){
      return this.doAction('approve')
              .then((res)=>{
                this.get('router').transitionTo('pipelines.activity', this.get('id'))
              });
    },
    deny: function(){
      return this.doAction('deny');
    }
  },
  availableActions: function() {
    var a = this.get('actions');
    var status = this.get('status');
    return [
      { label: 'action.rerun',          icon: 'icon icon-refresh',   action: 'rerun',         enabled: a.rerun?true:false },
      { divider: true },
      { label: 'action.approve',      icon: 'icon icon-success',   action: 'approve',     enabled: status==='Pending'&&a.approve?true:false },
      { label: 'action.deny',      icon: 'icon-x-circle',   action: 'deny',     enabled: status==='Pending'&&a.deny?true:false },
    ];
  }.property('actions.{approve}'),
  commit: function(){
    var commitInfo = this.get('commitInfo')
    if(commitInfo){
      return commitInfo.substr(0,8)
    }
    return 
  }.property('commitInfo'),
  repository: function(){
    return this.get('pipeline.stages')[0].steps[0].repository
  }.property('pipeline.stages'),
  branch: function(){
    return this.get('pipeline.stages')[0].steps[0].branch
  }.property('pipeline.stages'),
  pendingStageName: function(){
    var pendingStage = this.get('pendingStage');
    if(!pendingStage){
      return
    }
    var activity_stages = this.get('activity_stages');
    return activity_stages[pendingStage].name;
  }.property('pendingStage')
});
