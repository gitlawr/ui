import Ember from 'ember';
export default Ember.Controller.extend({
  queryParams: ['status', 'sortBy', 'descending'],
  status: 'all',
  sortBy: 'start_ts',
  descending: true,
  modalService: Ember.inject.service('modal'),
  waitingForApproval: function () {
    let out = this.get('model')
      .filter(ele => {
        if(ele.status === 'Pending'){
          return true
        }
        return false
      });
    return out;
  }.property('model.@each.status', 'status'),
  filtered: function() {
    var status = this.get('status');
    let out = this.get('model')
      .filter(ele => {
        if(ele.status === 'Pending'){
          return false
        }
        if (status === 'all') {
          return true
        }
        if(status==="running"
            &&ele.status!=='Success'
            &&ele.status!=='Fail'
            &&ele.status!=='Denied'){
          return true
        }
        if(status === 'fail'
            &&ele.status === 'Denied'){
            return true
        }
        return ele.status === status
      });
    return out;
  }.property('model.@each.status', 'status'),
  availableActions: function(a) {
    return [
      // { label: 'action.rerun',          icon: 'icon icon-play',   action: 'run',         enabled: true },
      // { divider: true },
      { label: 'action.approve',      icon: 'icon icon-success',   action: 'approve',     enabled: a.approve?true:false },
      { label: 'action.deny',      icon: 'icon-x-circle',   action: 'deny',     enabled: a.deny?true:false },
    ];
  },
  actions: {
    runPipelines: function() {
      this.get('modalService').toggleModal('modal-pipeline-run', {
        cb: (pipelines) => {
          console.log(pipelines)
        }
      });
    },
    sendAction: function (model, action) {
      return model.send(action)
    },
  }
});
