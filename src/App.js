import logo from './logo.svg';
import './App.css';
import Arcade from './Arcade.jsx';

function App() {
  return (
    <div className="GameRoom" style={{ display: 'flex', height: '100%' }}>
      <div style={{ display: 'flex', flex: 1, background: 'lightskyblue' }}/>
      <div style={{ display: 'flex', flex: 5, background: 'lightgray' }}>
        <Arcade />
      </div>
    </div>
  );
}

export default App;
