import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home  from './pages/Home';
import UserProfile from './pages/UserProfile.js';
import PostDetail from './pages/PostDetail';

function App() {
  return(
    <Router>
    <Switch >
    <Route path="/" exact component={Home}/>
    <Route path="/user/:userId" exact component={UserProfile}/>
    <Route path="/post/:postId" exact component={PostDetail}/>
    </Switch>
    </Router>
  );
}

export default App;