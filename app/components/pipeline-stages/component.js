import Ember from 'ember';

export default Ember.Component.extend({
  sortFinishText: null,
  crt: null,
  dragDom: null,
  model: null,
  pipeline: null,
  envvars: null,
  envvarsLoading: true,
  modalService: Ember.inject.service('modal'),
  init(){
    this._super(...arguments);
    var pipelineStore = this.get('pipelineStore');
    pipelineStore.find('envvars',null,{
      url: `${pipelineStore.baseUrl}/envvars`,
      forceReload: true
    }).then((res)=>{
      this.set('envvarsLoading',false);
      this.set('envvars',JSON.parse(res).map(ele=>('${'+ele+'}')));
    });
  },
  actions: {
    dragStart: function(content, e) {
      var dom = e.target
      var crt = dom.cloneNode(true);
      crt.style.position = "fixed";
      crt.style.top = "-100%";
      crt.style.right = "-100%";
      crt.style.filter = "grayscale(1)";
      var stepWrapGhost = crt.getElementsByClassName('steps-wrap')[0]
      stepWrapGhost.style.border = "1px dashed gray";
      dom.appendChild(crt);
      e.dataTransfer.setDragImage(crt, 84, 50);
      dom.style.filter = 'grayscale(1) drop-shadow(5px 5px 5px #ccc)';
      this.dragDom = dom;
      this.crt = crt;
    },
    startHook: function() {

    },
    dragEnd: function() {
      var crt = this.crt
      crt && crt.remove()
      this.dragDom && (this.dragDom.style.filter = "")
    },
    addStage: function() {
      var cb = (stage) => {
        this.get('model').pushObject(stage);
      };
      this.get('modalService').toggleModal('modal-pipeline-new-stage', {
        mode: 'new',
        cb: cb
      })
    },
    editStage: function(index) {
      this.get('modalService').toggleModal('modal-pipeline-new-stage', {
        stage: this.get('pipeline.stages')[index],
        mode: 'edit',
        cb: (stage) => {
          var newStage = this.get('pipeline.stages').map((ele, i) => {
            if (i === index) {
              return stage;
            }
            return ele;
          })
          this.set('pipeline.stages', newStage);
        },
        rmCb: () => {
          var newStage = this.get('pipeline.stages').filter((ele, i) => {
            if (i === index) {
              return false;
            }
            return true;
          });
          this.set('pipeline.stages', newStage);
        }
      })
    }
  },
  didInsertElement(){
    this._super(...arguments);
    this.$(document).on('keyup','input,textarea',(e)=>{
      $.fn.E_INPUT_HINT.startHint(e.target,(hint)=>{
      });
    })
  }
});
