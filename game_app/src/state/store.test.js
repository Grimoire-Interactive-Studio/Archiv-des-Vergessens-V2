import test from 'node:test';
import assert from 'node:assert/strict';
import { Store, INITIAL_STATE } from './store.js';
import { addMneme, buyGenerator, processTick, updateSetting, resetGame, allocateAttributePoint, unlockSkillNode, respecSkillTree } from './actions.js';

test('Central Store - Initial State Structure & Immutability', () => {
  const store = new Store();
  const state = store.getState();

  assert.ok(state.player, 'State must contain player slice');
  assert.ok(state.resources, 'State must contain resources slice');
  assert.ok(state.generators, 'State must contain generators slice');
  assert.ok(state.system, 'State must contain system slice');
  assert.ok(state.settings, 'State must contain settings slice');

  assert.equal(state.resources.mneme, 0);
  assert.equal(state.settings.volume, 80);
  assert.equal(state.settings.autosave, true);

  // Immutability Check
  assert.throws(() => {
    state.resources.mneme = 999;
  }, TypeError, 'State should be frozen and immutable');
});

test('Central Store - Action: addMneme', () => {
  const store = new Store();

  store.dispatch(addMneme(50));
  assert.equal(store.getState().resources.mneme, 50);
  assert.equal(store.getState().resources.totalMneme, 50);

  store.dispatch(addMneme(25));
  assert.equal(store.getState().resources.mneme, 75);
  assert.equal(store.getState().resources.totalMneme, 75);

  // Invalid amounts should not alter state
  const stateBefore = store.getState();
  store.dispatch(addMneme(-10));
  assert.equal(store.getState(), stateBefore, 'Invalid amount must return unchanged state');
});

test('Central Store - Action: buyGenerator & Bulk Purchasing', () => {
  const store = new Store();

  // Give enough mneme for Gedanken-Archiv (baseCost: 10)
  store.dispatch(addMneme(100));

  const buyResult = store.dispatch(buyGenerator('gedankenArchiv', 1));
  assert.equal(buyResult.generators.gedankenArchiv.level, 1);
  assert.equal(buyResult.resources.mneme, 90, 'Cost of 10 should be deducted');

  // Attempt buying without enough funds
  const stateBefore = store.getState();
  store.dispatch(buyGenerator('absolutesChronoskop', 1));
  assert.equal(store.getState(), stateBefore, 'Buying unaffordable generator should leave state unchanged');
});

test('Central Store - Action: processTick (Game Loop Yield)', () => {
  const store = new Store();

  // Give 10 Mneme and buy level 1 Gedanken-Archiv (baseYield: 1.0)
  store.dispatch(addMneme(10));
  store.dispatch(buyGenerator('gedankenArchiv', 1));

  const mnemeBeforeTick = store.getState().resources.mneme; // 0
  // Process 2 seconds tick
  store.dispatch(processTick(2));

  assert.equal(store.getState().resources.mneme, mnemeBeforeTick + 2.0);
});

test('Central Store - Action: updateSetting & Persisted Hydrate', () => {
  const store = new Store();

  store.dispatch(updateSetting('volume', 42));
  store.dispatch(updateSetting('showParticles', false));

  assert.equal(store.getState().settings.volume, 42);
  assert.equal(store.getState().settings.showParticles, false);

  // Test Hydrate
  const newStore = new Store();
  newStore.hydrate({
    resources: { mneme: 500, totalMneme: 500 },
    settings: { volume: 42, showParticles: false }
  });

  assert.equal(newStore.getState().resources.mneme, 500);
  assert.equal(newStore.getState().settings.volume, 42);
  assert.equal(newStore.getState().settings.showParticles, false);
});

test('Central Store - Subscribers & Unsubscribe', () => {
  const store = new Store();
  let callCount = 0;
  let lastSeenMneme = 0;

  const unsubscribe = store.subscribe((s) => {
    callCount++;
    lastSeenMneme = s.resources.mneme;
  });

  // Initial call happens upon subscribe
  assert.equal(callCount, 1);
  assert.equal(lastSeenMneme, 0);

  store.dispatch(addMneme(10));
  assert.equal(callCount, 2);
  assert.equal(lastSeenMneme, 10);

  unsubscribe();
  store.dispatch(addMneme(10));
  assert.equal(callCount, 2, 'Subscriber should no longer be called after unsubscribe');
});

test('Central Store - Reset Game', () => {
  const store = new Store();
  store.dispatch(addMneme(1000));
  store.dispatch(buyGenerator('gedankenArchiv', 5));

  assert.ok(store.getState().resources.mneme < 1000);
  assert.ok(store.getState().generators.gedankenArchiv.level > 0);

  store.dispatch(resetGame());
  assert.equal(store.getState().resources.mneme, INITIAL_STATE.resources.mneme);
  assert.equal(store.getState().generators.gedankenArchiv.level, INITIAL_STATE.generators.gedankenArchiv.level);
});

test('RPG Features - EXP, Level Up, Attributes & Skill Tree', () => {
  const store = new Store();

  // 1. Initial State
  assert.equal(store.getState().player.level, 1);
  assert.equal(store.getState().player.attributePoints, 0);

  // 2. Perform clicks to accumulate EXP and level up
  for (let i = 0; i < 100; i++) {
    store.dispatch(addMneme(10));
  }

  const p = store.getState().player;
  assert.ok(p.level > 1, 'Player should have leveled up');
  assert.ok(p.attributePoints > 0, 'Player should have gained attribute points');
  assert.ok(p.skillPoints > 0, 'Player should have gained skill points');

  // 3. Allocate Attribute Point
  const pointsBefore = p.attributePoints;
  store.dispatch(allocateAttributePoint('focus'));
  assert.equal(store.getState().player.attributePoints, pointsBefore - 1);
  assert.equal(store.getState().player.attributes.focus, 1);

  // 4. Unlock Skill Tree Node (arch_1 connected to root)
  const skillPointsBefore = store.getState().player.skillPoints;
  store.dispatch(unlockSkillNode('arch_1'));
  assert.equal(store.getState().player.skillPoints, skillPointsBefore - 1);
  assert.ok(store.getState().player.unlockedNodes.includes('arch_1'));

  // 5. Respec Skill Tree
  store.dispatch(respecSkillTree());
  assert.equal(store.getState().player.skillPoints, skillPointsBefore);
  assert.deepEqual(store.getState().player.unlockedNodes, ['root']);
});

