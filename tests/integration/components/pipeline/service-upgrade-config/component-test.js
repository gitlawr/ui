import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('pipeline/service-upgrade-config', 'Integration | Component | pipeline/service upgrade config', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{pipeline/service-upgrade-config}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#pipeline/service-upgrade-config}}
      template block text
    {{/pipeline/service-upgrade-config}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
