import './App.scss';
import { Routes,Route } from "react-router-dom";
import {library} from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import HomePage from 'unauth/homepage';
import MemberForm from 'unauth/member';
library.add(fas)

function App() {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} ></Route>
      <Route path='/member' element={<MemberForm />}></Route>
      <Route path='/task' element={<MemberForm />}></Route>
      <Route index element={<HomePage />} ></Route>
    </Routes>
  );
}

export default App;
