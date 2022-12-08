import logo from './logo.svg';
import {useState, useEffect} from 'react';
import LoginScreen from './Components/LoginScreen';
import './App.css';

function App() {
  const [currentTime, setCurrentTime] = useState(0);
  useEffect(() => {
    fetch('http://52.12.35.11:8080/api/time').then(res => res.json()).then(data => {
      setCurrentTime(data.time);
    });
  }, []);

  const [loginStatus, setLoginStatus] = useState(false);
  useEffect(() => {
    fetch('http://52.12.35.11:8080/api/login_status')
    .then(res => res.json())
    .then(data => {
      console.log(data.login_status)
      setLoginStatus(data.login_status)
    });
  }, [loginStatus])

  return (
    <div className="App">
      <p>The current time is {currentTime}.</p>
      {
        loginStatus == false
        ? <LoginScreen></LoginScreen>
        : <h2> You are logged in, so the home page now becomes this.</h2>
      }
    </div>
  );
}

export default App;