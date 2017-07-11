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
      this.get('modalService').toggleModal('modal-pipeline-new-stage', {
        mode: 'new',
        cb:(stage)=>{
          this.get('model').pushObject(stage);
        }
    })
    },
    editStage: function(index){
      this.get('modalService').toggleModal('modal-pipeline-new-stage',{
          stage: this.get('model')[index],
          mode: 'edit',
          cb: (stage)=>{
            var newStage = this.get('model').map((ele,i)=>{
              if(i==index){
                return stage
              }
              return ele
            })
            this.set('model', newStage);
          },
          rmCb: ()=>{
            var newStage = this.get('model').filter((ele,i)=>{
              if(i==index){
                return false
              }
              return true
            })
            this.set('model', newStage);
          }
      })
    }
  }
});
