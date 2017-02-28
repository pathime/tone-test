import React from 'react'
import { FMSynth, PolySynth, CtrlPattern, Frequency, Freeverb } from 'tone'
import RestPattern from './RestPattern'
import scaleNote from './scaleNote'
import Knob from './Knob'
import DirectionButton from './DirectionButton'

let synthOpts = {
  harmonicity: 5,
  modulationIndex: 20,
  detune: 0,
  oscillator: {
    type: 'sine'
  },
  envelope: {
    attack: 0.004,
    decay: 0.8,
    sustain: 0,
    release: 1,
  },
  modulation: {
    type: 'sine'
  },
  modulationEnvelope: {
    attack: 0,
    decay: 0.2,
    sustain: 0,
    release: 0.5
  },
  portamento: 0
}

class ArpSynth extends React.Component {

  constructor() {
    super()
    this.state = {}
    this.setChord = this.setChord.bind(this)
    this.setDir = this.setDir.bind(this)
    this.setEnv = this.setEnv.bind(this)
  }

  componentDidMount() {
    let { root, range, scale, chord, dir, isMuted } = this.props

    this.setState({root, range, scale, chord, dir, isMuted}, () => {
      this.arp = new CtrlPattern([], dir)
      this.setArpValues()

      this.freeverb = new Freeverb(0.9, 1000).toMaster()
      this.freeverb.wet.value = 0
      this.synth = new PolySynth(3, FMSynth).connect(this.freeverb)
      this.synth.set(synthOpts)
    }) 
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.dir !== this.state.dir || nextState.isMuted !== this.state.isMuted
  }

  setArpValues() {
    let { root, range, scale } = this.state

    this.arp.values = Array
      .from({length: range})
      .map((elem, i) => root + (scale * i))
  }

  setChord(i, value) {
    let { chord } = this.state
    chord[i] = parseInt(value)
    this.setState({chord})
  }

  setDir(dir) {
    this.setState({dir})
    this.arp.type = dir
  }

  setEnv(value) {
    let { envelope } = synthOpts
    envelope.release = (value / 100) * 3.2 + 1
    envelope.decay = (value / 100) * 2 + 0.2
    this.synth.set(synthOpts)
  }

  trigger() {
    let { chord, isMuted } = this.state

    if (!chord || isMuted) return
    if (!this.restPattern.next()) return

    let note = this.arp.next()

    let chordSet = new Set(chord)

    let freqs = Array
      .from(chordSet)
      .map((value) => {
        let midiNote = scaleNote(note + value)
        return new Frequency(midiNote, 'midi')
      })

    this.synth.triggerAttackRelease(freqs , '16n')

    freqs.forEach(freq => freq.dispose())
  }

  render() {
    let { rests } = this.props
    let { root, range, scale, chord, dir, isMuted } = this.state

    if (!root) return <div />

    return (
      <div className='panel panel-default'>
        <div className='panel-body'>
          <div className='col-sm-12'>
            <div className='row'>
              <div className='col-sm-3'>
                <div className='row'>
                  <Knob initialValue={root} min={1} max={127} label='Root'
                    onChangeValue={root => this.setState({root}, this.setArpValues)} />
                </div>
              </div>
              <div className='col-sm-3'>
                <div className='row'>
                  <Knob initialValue={chord[1]} min={-24} max={24} label='2nd'
                    onChangeValue={value => this.setChord(1, value)} />
                </div>
              </div>
              <div className='col-sm-3'>
                <div className='row'>
                  <Knob initialValue={chord[2]} min={-24} max={24} label='3rd'
                    onChangeValue={value => this.setChord(2, value)} />
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-sm-3'>
                <div className='row'>
                  <Knob initialValue={range} min={1} max={24} label='Range'
                    onChangeValue={range => this.setState({range}, this.setArpValues)} />
                </div>
              </div>
              <div className='col-sm-3'>
                <div className='row'>
                  <Knob initialValue={scale} min={1} max={24} label='Scale'
                    onChangeValue={scale => this.setState({scale}, this.setArpValues)} /> 
                </div>
              </div>
              <div className='col-sm-6 arp-direction'>
                <div className='row'>
                  <label>Dir</label>
                  <div>
                    <DirectionButton iconClass='arrow-up' dir='up' selectedDir={dir} select={this.setDir} />
                    <DirectionButton iconClass='arrow-down' dir='down' selectedDir={dir} select={this.setDir} />
                    <DirectionButton iconClass='sort' dir='upDown' selectedDir={dir} select={this.setDir} />
                  </div>
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-sm-12'>
                <RestPattern ref={ref => this.restPattern = ref} rests={rests}/>
              </div>
            </div>
            <div className='row'>
              <div className='col-sm-3'>
                <div className='row'>
                  <Knob initialValue={50} min={0} max={100} label='Tail'
                    onChangeValue={this.setEnv} />
                </div>
              </div>
              <div className='col-sm-3'>
                <div className='row'>
                  <Knob initialValue={0} min={0} max={100} label='Verb'
                    onChangeValue={value => this.freeverb.wet.value = value / 100} />
                </div>
              </div>
              <div className='col-sm-3'>
                <div className='row'>
                  <Knob initialValue={100} min={0} max={100} label='Gain'
                    onChangeValue={value => this.synth.volume.value = (value / 100 * 40) - 40} />
                </div>
              </div>
            </div>
          </div>
          { isMuted && <div className='mute-overlay' /> }
          <span className={'mute glyphicon glyphicon-volume-' + (isMuted ? 'off' : 'down')}
            onClick={() => this.setState({isMuted: !isMuted})} />
        </div>
      </div>
    )
  }
}

ArpSynth.propTypes = {
  root: React.PropTypes.number,
  range: React.PropTypes.number,
  scale: React.PropTypes.number,
  chord: React.PropTypes.array,
  rests: React.PropTypes.array,
  isMuted: React.PropTypes.bool,
}

export default ArpSynth
