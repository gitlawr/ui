import Ember from 'ember';

export default Ember.Component.extend({
  sortFinishText: null,
  model: [
    {id:'stage1', title:'Page Title 1',steps:[{id:'stage1step1'},{id:'stage1step2'}]},
    {id:'stage2', title:'Page Title 2',steps:[{id:'stage2step1'},{id:'stage2step2'}]},
    {id:'stage3', title:'Page Title 3',steps:[{id:'stage3step1'},{id:'stage3step2'}]}
  ],
  modalService: Ember.inject.service('modal'),
  actions: {
    dragStart: function(object) {
      console.log('Drag Start', object);
    },
    sortEndAction: function() {
      console.log('Sort Ended', this.get('model.pages'));
    },
    addStage: function(){
      let newDriver = this.get('store').createRecord({
              type            : 'pipelineStage',
              name            : null
            });
      this.get('modalService').toggleModal('modal-pipeline-new-stage', newDriver)
    }
  }
});
