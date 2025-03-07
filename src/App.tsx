import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Navbar from './pages/Navbar/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './pages/Sidebar/Sidebar';
import Store from './pages/Store/Store';
import { Provider } from 'react-redux';
import store from './redux/store';


function App() {
  return (
    <div className="App">
      <Navbar />
      <Router>
        <Provider store={store}>
          <div className="container">
            <Sidebar />
          </div>
          <div className="content">
            <Routes>
              <Route path="/" element={<Store />} />
            </Routes>
          </div>
        </Provider>
      </Router>
    </div>
  );
}

export default App;
