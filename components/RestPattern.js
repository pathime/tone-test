import React from 'react'

class RestPattern extends React.Component {

  constructor(rests) {
    super()
    this.state = {}
    this.currentStep = 0
    this.setTotalSteps = this.setTotalSteps.bind(this)
  }

  componentDidMount() {
    this.setState({rests: this.props.rests})
  }

  next() {
    this.currentStep++
    if (this.currentStep >= this.state.rests.length) this.currentStep = 0
    return this.state.rests[this.currentStep]
  }

  handleCheckChange(i, value) {
    let { rests } = this.state
    rests[i] = value ? 1 : 0
    this.setState({rests})
  }

  setTotalSteps(steps) {
    let rests = []
    for (let i = 0; i < steps; i++) {
      rests[i] = this.state.rests[i] || 0
    }
    this.setState({rests})
  }

  render() {
    let { rests } = this.state
    if (!rests) return <div />

    return (
      <div className='row'>
        <div className='col-sm-10'>
          <label>Steps</label>
          <div className='row'>
            { Array.from({length: 8}).map((elem, i) => (
              <label className="" key={i}>
                <input type="checkbox" checked={rests[i] === 1} onChange={e => this.handleCheckChange(i, e.target.checked)} disabled={i >= rests.length}/>
              </label>
            ))}
          </div>
        </div>
        <div className='col-sm-2'>
          <div className='row'>
            <label>Total</label>
            <input type='number' defaultValue={rests.length} min='1' max='8' onChange={e => this.setTotalSteps(e.target.value)}/>
          </div>
        </div>
      </div>
    )
  }
}

RestPattern.propTypes = {
  rests: React.PropTypes.array
}

export default RestPattern
