import React from 'react'
import ReactDOM from 'react-dom'
import { Transport } from 'tone'
import ArpSynth from './components/ArpSynth'
import RestPattern from './components/RestPattern'

let synth1,
    synth2,
    synth3,
    restPattern

Transport.scheduleRepeat(time => {
  if (!restPattern.next()) return

	synth1.trigger()
  synth2.trigger()
  synth3.trigger()
}, "16n")

Transport.bpm.value = 120
Transport.start("+0.5")

ReactDOM.render((
  <div className='container'>
    <div className='col-sm-12'>
      <div className='row'>
         <div className='col-sm-3'>
          <div className='panel panel-default'>
            <div className='panel-body'>
              <div className='col-sm-12'>
                <RestPattern ref={ref => restPattern = ref} rests={[1]}/>
              </div>
            </div>
          </div>
        </div>
        <div className='col-sm-3'>
          <ArpSynth ref={ref => synth1 = ref} root={44} range={5} scale={4} rests={[1,0,0,1,0]} chord={[0,0,0]} dir={'upDown'} isMuted={false} /> 
        </div>
        <div className='col-sm-3'>
          <ArpSynth ref={ref => synth3 = ref} root={52} range={16} scale={1} rests={[0,0,0,1]} chord={[0,0,0]} dir={'upDown'} isMuted={true} /> 
        </div>
        <div className='col-sm-3'>
          <ArpSynth ref={ref => synth2 = ref} root={57} range={3} scale={7} rests={[0,0,0,0,0,1]} chord={[0,5,0]} dir={'up'} isMuted={true} />
        </div>
      </div>
    </div>
  </div>
), document.getElementById('root'))
