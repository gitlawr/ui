import Ember from 'ember';

export default Ember.Component.extend({
  prefs: Ember.inject.service(),
  modalService: Ember.inject.service('modal'),
  stickyHeader: false,
  activity: null,
  sortBy: 'name',
  body: null,
  filtered: null,
  init(){
    this._super(...arguments)
    this.set('filtered',this.get('body'))
  },
  actions: {
    showLogs: function(stageIndex,stepIndex){
      this.get('modalService').toggleModal('modal-pipeline-logs', {
          activity: this.get('activity'),
          step: [stageIndex,stepIndex]
        });
    }
  },
});
