function Cell(props) {
  return (
	<div id={`piece_${props.x}_${props.y}`} 
	style={
		{ 'gridColumnStart' : props.x,
		  'gridColumnEnd': props.x + 1, 
		  'gridRowStart': props.y, 
		  'gridRowEnd': props.y + 1,
		  'backgroundColor': props.color ? props.color : ''}} />
  );
}

export default Cell;
