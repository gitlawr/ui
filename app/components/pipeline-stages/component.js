import Ember from 'ember';

export default Ember.Component.extend({
  sortFinishText: null,
  crt: null,
  dragDom: null,
  model: null,
  modalService: Ember.inject.service('modal'),
  actions: {
    dragStart: function(content,e) {
      var dom = e.target
      var crt = dom.cloneNode(true);
      crt.style.position = "fixed"; 
      crt.style.top = "-100%"; crt.style.right = "-100%";
      crt.style.filter="grayscale(1)";
      var stepWrapGhost = crt.getElementsByClassName('steps-wrap')[0]
      stepWrapGhost.style.border="1px dashed gray";
      dom.appendChild(crt);
      e.dataTransfer.setDragImage(crt, 84, 50);
      dom.style.filter = 'grayscale(1) drop-shadow(5px 5px 5px #ccc)';
      this.dragDom = dom;
      this.crt=crt;
    },
    startHook: function(){

    },
    dragEnd: function(){
      var crt = this.crt
      debugger
      crt&&crt.remove()
      this.dragDom&&(this.dragDom.style.filter="")
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
              if(i===index){
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
