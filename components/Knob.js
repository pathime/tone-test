import React from 'react'

class Knob extends React.Component {
  constructor() {
    super()
    this.state = {}
  }

  componentDidMount() {
    let { initialValue } = this.props
    this.setState({
      value: initialValue,
      degree: this.valueToRadian(initialValue)
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.value !== this.state.value
  }

  handleChange(value) {
    this.setState({
      value,
      degree: this.valueToRadian(value)
    })
    this.props.onChangeValue(value)
  }

  valueToRadian(value) {
    let { min, max } = this.props
    return Math.round((value - min) * 270 / (max - min)) - 45
  }

  render() {
    let { initialValue, min, max, label } = this.props
    let { value, degree } = this.state
    
    if (!value && !degree) return <div />

    return (
      <div className='knob-wrapper'>
        <label>{label}</label>
          <div className="Knob">
            <div className="Knob-label">
              <input
                type="number"
                min={min}
                max={max}
                ref={ref => this.input = ref}
                className="Knob-value"
                defaultValue={initialValue}
                onChange={e => this.handleChange(parseInt(e.target.value))}
                onWheel={() => this.input.focus()}
              />
            </div>
            <div
              className="Knob-spinner"
              style={{
                transform: `rotate(${degree}deg)`
              }}
            >
            </div>
          </div>
      </div>
    )
  }
}

Knob.propTypes = {
  label: React.PropTypes.string,
  initialValue: React.PropTypes.number,
  min: React.PropTypes.number,
  max: React.PropTypes.number,
  onChangeValue: React.PropTypes.func
}

export default Knob
