import Ember from 'ember';
export default Ember.Controller.extend({
  queryParams: ['status', 'sortBy', 'descending'],
  status: 'all',
  sortBy: 'start_ts',
  descending: true,
  modalService: Ember.inject.service('modal'),
  filtered: function() {
    var status = this.get('status');
    let out = this.get('model')
      .filter(ele => {

        if (status === 'all') {
          return true
        }
        return ele.status === status
      });

    return out.map(ele => {
      return {
        ...ele,
        name: ele.pipeline.name,
        repository: ele.pipeline.stages[0].steps[0].repository,
        branch: ele.pipeline.stages[0].steps[0].branch,
        availableActions: this.availableActions(ele.actionLinks)
      }
    });
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
    }
  }
});
