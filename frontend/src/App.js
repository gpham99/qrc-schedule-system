import logo from './logo.svg';
import {useState, useEffect} from 'react';
import LoginScreen from './Components/LoginScreen';
import './App.css';

function App() {
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    fetch('http://52.12.35.11:5000/api/time')
    .then(res => res.json())
    .then(data => {setCurrentTime(data.time);});
  }, []);

  return (
    <div className="App">
      {/* <header className="App-header">

        ... some changes in this part ...

        <p>The current time is {currentTime}.</p>
      </header> */}

      <LoginScreen></LoginScreen>
    </div>
  );
}

export default App;
