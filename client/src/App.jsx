import './App.css'
import Navigation from './components/navbar';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Create from './components/Create';
import Postpage from './components/Postpage';
import Edit from './components/Edit';
import {Route, Routes} from 'react-router-dom';
import { UserContextProvider } from './UserContext';

function App() {
  return (
      <UserContextProvider>
        <Navigation/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/Login' element={<Login/>}/>
          <Route path='/Register' element={<Register/>}/>
          <Route path='/Create' element={<Create/>}/>
          <Route path='/post/:id' element={<Postpage/>} />
          <Route path='/edit/:id'element={<Edit/>} />
        </Routes>
      </UserContextProvider>
  )
}

export default App
