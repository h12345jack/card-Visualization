import React, { Component } from 'react';
import MyDialogModal from './containers/MyDialogModal'

class App extends Component {
  state = {
    tree: {}
  }

  render() {
    return (
        <div className="vis-custom">
            <MyDialogModal/>
        </div>
    );
  }
}

export default App;
