import './App.scss';
import {library} from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import HomePage from 'unauth/homepage';
library.add(fas)

function App() {
  // 若需要user 資訊則從useAuth 取得
  return (
    <div className="App">
      <HomePage />
    </div>
  );
}

export default App;
