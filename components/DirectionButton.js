import React from 'react'

const DirectionButton = ({ iconClass, dir, selectedDir, select }) => (
  <span 
    className={'direction glyphicon glyphicon-' + iconClass + (selectedDir === dir ? ' selected' : '')} 
    onClick={() => select(dir)}
  />
)

DirectionButton.propTypes = {
  iconClass: React.PropTypes.string,
  dir: React.PropTypes.string,
  selectedDir: React.PropTypes.string,
  select: React.PropTypes.func
}

export default DirectionButton
