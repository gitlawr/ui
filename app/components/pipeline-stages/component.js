import Ember from 'ember';

var validateStageName = function(stages,stage){
  for (var i = 0; i < stages.length; i++) {
    var item = stages[i];
    if (item.name === stage.name) {
      return i;
    }
  }
  return -1;
};
export default Ember.Component.extend({
  sortFinishText: null,
  crt: null,
  dragDom: null,
  model: null,
  pipeline: null,
  envvars: null,
  codeMirror: Ember.inject.service(),
  envvarsLoading: true,
  modalService: Ember.inject.service('modal'),
  review: false,
  init(){
    this._super(...arguments);
    var pipelineStore = this.get('pipelineStore');
    pipelineStore.find('envvars',null,{
      url: `${pipelineStore.baseUrl}/envvars`,
      forceReload: true
    }).then((res)=>{
      var hintAry =JSON.parse(res).map(ele=>('${'+ele+'}'));
      this.set('envvarsLoading',false);
      this.set('envvars', hintAry);
      this.get('codeMirror').set('hintAry', hintAry);
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
        var stages = this.get('pipeline.stages');
        var valid = validateStageName(stages,stage)
        if(valid !== -1){
          return false;
        }
        stages.pushObject(stage);
        return true;
      };
      this.get('modalService').toggleModal('modal-pipeline-new-stage', {
        mode: 'new',
        cb: cb
      })
    },
    editStage: function(index) {
      var review = this.get('review');
      this.get('modalService').toggleModal('modal-pipeline-new-stage', {
        stage: this.get('pipeline.stages')[index],
        mode: review?'review':'edit',
        cb: (stage) => {
          var stages = this.get('pipeline.stages');
          var valid = validateStageName(stages,stage)
          if(valid !== -1 || valid === index){
            return false;
          }
          var newStage = stages.map((ele, i) => {
            if (i === index) {
              return stage;
            }
            return ele;
          })
          this.set('pipeline.stages', newStage);
          return true;
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
    this.$(document).on('keyup','input',(e)=>{
      $.fn.E_INPUT_HINT.startHint(e.target,(/*hint*/)=>{
      });
    })
  }
});
