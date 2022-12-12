import './App.scss';
import { Routes,Route } from "react-router-dom";
import {library} from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import HomePage from 'unauth/homepage';
import MemberForm from 'unauth/member';
import { Task } from 'auth/task'
import { Board } from 'auth/board'
import { Epic } from 'auth/epic';
import { TaskBoard } from 'auth/TaskBoard';
import { ProjectModal,DeleteNote } from "component/modal"
library.add(fas)

function App() {
  return (
    <>
    <Routes>
      <Route path='/' element={<HomePage />} ></Route>
      <Route path='/member' element={<MemberForm />}></Route>
      <Route path='/task' element={<Task />}></Route>
      <Route path='/task/:id' element={<Board />}>
        <Route path='Epic' element={<Epic />} />
        <Route path='Event' element={<TaskBoard />} /> 
        <Route index element={<TaskBoard />} />
      </Route>
      <Route index element={<HomePage />} ></Route>
    </Routes>
    <ProjectModal projectModalOpen={false} />
    <DeleteNote deleteModalOpen={false} />
    </>
  );
}

export default App;
