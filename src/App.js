import logo from './logo.svg';
import './App.css';
import Form from './components/Form';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="App">
        <Navbar />
      <header className="App-header">
        <Form />
      </header>
    </div>
  );
}

export default App;
