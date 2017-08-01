import Ember from 'ember'
import Resource from 'ember-api-store/models/resource';

export default Resource.extend({
  type: 'activity',
  router: Ember.inject.service(),
  actions:{
    // rerun: function() {
    //   return this.doAction('rerun')
    //   .then((res)=>{
    //     this.get('router').transitionTo('pipelines.activity', res.data.id)
    //   });
    // },
    // approve: function(){
    //   return this.doAction('approve')
    //           .then((res)=>{
    //             this.get('router').transitionTo('pipelines.activity', res.data.id)
    //           });
    // },
    // deny: function(){
    //   return this.doAction('deny');
    // }
  },
  availableActions: function() {
    var a = this.get('actionLinks');

    return [
      // { label: 'action.rerun',          icon: 'icon icon-play',   action: 'run',         enabled: true },
      // { divider: true },
      { label: 'action.approve',      icon: 'icon icon-success',   action: 'approve',     enabled: a.approve?true:false },
      { label: 'action.deny',      icon: 'icon-x-circle',   action: 'deny',     enabled: a.deny?true:false },
    ];
  }.property('actions'),
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
  }.property('pipeline.stages')
});
