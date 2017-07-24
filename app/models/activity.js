import Ember from 'ember'
import Resource from 'ember-api-store/models/resource';

export default Resource.extend({
  type: 'activity',
  router: Ember.inject.service(),
  // actions:{
  //   run: function() {
  //     return this.doAction('rerun')
  //     .then((res)=>{
  //       this.get('router').transitionTo('pipelines.activity', res.data.id)
  //     });
  //   }
  // },
  // availableActions: function() {
  //   var a = this.get('actions');

  //   return [
  //     { label: 'action.rerun',          icon: 'icon icon-play',   action: 'run',         enabled: true },
  //     // { divider: true },
  //     // { label: 'action.upgrade',      icon: 'icon icon-edit',   action: 'update',     enabled: true },
  //   ];
  // }.property('actions.{run,update}'),
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
