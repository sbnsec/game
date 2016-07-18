import * as store from 'src/vuex/store'

describe('store', () => {
  /* describe('saveLocalStorage', () => {
    it('should save the relevant parts of state to local storage', () => {
      window.localStorage.state = {}

      const now = Date.now()

      const state = {
        currentLesson: 1,
        currentSection: 1,
        solvedCurrentSection: false,
        lessons: [],
        completedLessons: [],
        output: [],
        turbo: false,
        lessonSelectionActive: false,
        emulator: {
          history: [],
          workingDirectory: '/home',
          user: 'user',
          fileSystem: {
            '/home': { type: 'dir', modified: now }
          }
        },
        randomStuff: 100
      }

      store.saveLocalStorage(state)

      expect(window.localStorage.state).to.be.a.string
      expect(JSON.parse(window.localStorage.state)).to.deep.equal({
        currentLesson: 1,
        currentSection: 1,
        completedLessons: [],
        solvedCurrentSection: false,
        output: [],
        emulator: {
          history: [],
          workingDirectory: '/home',
          user: 'user',
          fileSystem: {
            '/home': { type: 'dir', modified: now }
          }
        }
      })
    })
  })*/

  describe('vuexState', () => {
    it('should use {} if localStorage is empty', () => {
      delete window.localStorage.state

      // remove store from require cache and load it again
      // to evaluate the other branch for setting `vuexState`
      delete require.cache[require.resolve('src/vuex/store')]
      const store2 = require('src/vuex/store')

      expect(store2.state).to.be.an.object
    })
  })

  describe('mutations', () => {
    describe('START_SECTION', () => {
      it('should set the properties to the new lesson', () => {
        const state = {
          lessons: [{sections: [{}, {emulator: {}}]}]
        }

        store.mutations.START_SECTION(state, 1, 1)
        expect(state.solvedCurrentSection).to.be.false
        expect(state.currentLesson).to.equal(1)
        expect(state.currentSection).to.equal(1)
      })
    })

    describe('SEND_COMMAND', () => {
      before(() => {
        require('es6-promise').polyfill()
      })

      it('should add the new command to the history', (done) => {
        const state = {output: []}

        store.mutations.SEND_COMMAND(state, 'cd /')
        setTimeout(function () {
          expect(state.output[0]).to.deep.equal({type: 'INPUT', text: 'cd /'})
          expect(state.output).to.have.lengthOf(2)
          done()
        }, 10)
      })

      it('should return an error if input is wrong', (done) => {
        const state = {output: []}

        store.mutations.SEND_COMMAND(state, 'not_implemented')
        setTimeout(function () {
          expect(state.output[1]).to.deep.equal({type: 'ERR', text: 'not_implemented: command not found'})
          done()
        }, 10)
      })
    })

    describe('RESET', () => {
      it('should reset the whole state', () => {
        const state = {}
        store.mutations.RESET(state)
        expect(state.currentLesson).to.equal(1)
        expect(state.currentSection).to.equal(1)
        expect(state.solvedCurrentSection).to.be.false
      })
    })

    describe('TOGGLE_TURBO', () => {
      it('should set state.turbo to false if true', () => {
        const state = {turbo: true}
        store.mutations.TOGGLE_TURBO(state)
        expect(state.turbo).to.be.false
      })

      it('should set state.turbo to true if false', () => {
        const state = {turbo: false}
        store.mutations.TOGGLE_TURBO(state)
        expect(state.turbo).to.be.true
      })
    })

    describe('ACTIVATE_LEVEL_SELECTION', () => {
      it('should set state.lessonSelectionActive to true', () => {
        const state = {lessonSelectionActive: false}
        store.mutations.ACTIVATE_LEVEL_SELECTION(state)
        expect(state.lessonSelectionActive).to.be.true
      })
    })
  })
})