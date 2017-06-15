import Ember from 'ember';

export default Ember.Component.extend({
  sortFinishText: null,
  model: null,
  sortingScope: function(){
    return this.get('stageId')
  }.property('stageId'),
  modalService: Ember.inject.service('modal'),
  actions: {
    dragStart: function(object) {
      console.log('Drag Start', object);
    },
    sortEndAction: function() {
      console.log(this.get('stageId'));
      console.log('Sort Ended', this.get('model.pages'));
    },
    addStep: function(){
      let newDriver = this.get('store').createRecord({
              type            : 'pipelineStep',
              name            : null
            });
      this.get('modalService').toggleModal('modal-pipeline-new-step', newDriver)
        .then(function(){
          console.log('clicked save')
        }).catch(function(){
          console.log('clicked cancel')
        });
    },
    confirmAddStep: function(param){
      console.log('addStep')
      console.log(param)
    }
  }
});
