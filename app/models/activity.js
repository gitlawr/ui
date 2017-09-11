import Ember from 'ember'
import Resource from 'ember-api-store/models/resource';

let ENUMS_STATUSCLASS = {
  'Success': 'bg-success',
  'Pending': 'bg-warning',
  'Building': 'bg-info',
  'Denied': 'bg-error',
  'Waiting': 'bg-info',
  'Fail': 'bg-error'
};

const STATUS_LABEL_ENUMS = {
  'Waiting': 'running',
  'Building': 'running',
  'Success': 'success',
  'Fail': 'fail',
  'Denied': 'denid'
}

export default Resource.extend({
  type: 'activity',
  router: Ember.inject.service(),
  userStore: Ember.inject.service('user-store'),
  actions: {
    rerun: function() {
      return this.doAction('rerun')
        .then((/*res*/) => {
          this.get('router').transitionTo('pipelines.activity', this.get('id'))
        });
    },
    approve: function() {
      return this.doAction('approve')
        .then((/*res*/) => {
          this.get('router').transitionTo('pipelines.activity', this.get('id'))
        });
    },
    deny: function() {
      return this.doAction('deny');
    }
  },
  availableActions: function() {
    var a = this.get('actions');
    var status = this.get('status');
    return [
      { label: 'action.rerun', icon: 'icon icon-refresh', action: 'rerun', enabled: a.rerun ? true : false },
      { divider: true },
      { label: 'action.approve', icon: 'icon icon-success', action: 'approve', enabled: status === 'Pending' && a.approve ? true : false },
      { label: 'action.deny', icon: 'icon-x-circle', action: 'deny', enabled: status === 'Pending' && a.deny ? true : false },
    ];
  }.property('actions.{approve}'),
  commit: function() {
    var commitInfo = this.get('commitInfo')
    if (commitInfo) {
      return commitInfo.substr(0, 8)
    }
    return
  }.property('commitInfo'),
  repository: function() {
    return this.get('pipelineSource.stages')[0].steps[0].repository
  }.property('pipelineSource.stages'),
  branch: function() {
    return this.get('pipelineSource.stages')[0].steps[0].branch
  }.property('pipelineSource.stages'),
  pendingStageName: function() {
    var pendingStage = this.get('pendingStage');
    if (!pendingStage) {
      return
    }
    var activity_stages = this.get('activity_stages');
    var stage = activity_stages[pendingStage];
    var pipelineSource = this.get('pipelineSource');
    var pipelineStage = pipelineSource.stages[pendingStage];
    if(pipelineStage.approvers){
      var userStore = this.get('userStore');
      var approversPromises = pipelineStage.approvers.map(ele=>{
        return userStore.find('account',ele)
      })
      Ember.RSVP.all(approversPromises)
        .then((array)=>{
          var names = [];
          names = array.map(ele=>ele.name)
          this.set('approversName',names);
        })
    }
    return stage.name;
  }.property('pendingStage'),
  approversName: [],
  statusClass: function() {
    var status = this.get('status');
    return ENUMS_STATUSCLASS[status];
  }.property('status'),
  statusLabel: function () {
    var status = this.get('status');
    return STATUS_LABEL_ENUMS[status];
  }.property('status')
});
