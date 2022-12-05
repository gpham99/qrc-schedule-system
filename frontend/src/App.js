import logo from './logo.svg';
import {useState, useEffect} from 'react';
import './App.css';

function App() {
  const [state, setState] = useState({})
   useEffect(() => {
    fetch("http://35.88.95.206:8080/api").then(response => {
      if (response.status == 200) {
        return response.json()
      }
    }).then(data => console.log(data))
    .then(err => console.log(err))
   })

  return (
    <div className="App">
      Hello
    </div>
  );
}

export default App;
