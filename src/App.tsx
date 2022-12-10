import './App.scss';
import {UnAuthScreen} from "unauth"
import { useAuth } from 'context/userContext';
import {Main} from "auth";
import {library} from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import {BrandInfo} from 'unauth/brand'
import Aside from 'component/aside';
library.add(fas)

function App() {
  // 若需要user 資訊則從useAuth 取得
  return (
    <div className="App">
      <Aside />
    </div>
  );
}

export default App;
