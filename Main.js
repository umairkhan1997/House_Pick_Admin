import React, { Component } from 'react';
import MainNavi from './Navigation'
class Main extends Component {
    constructor(props) {
        super(props)
        this.state = { currentScreen: 'Splash' };
        console.log('Start doing some tasks for about 3 seconds')
    }
  
    render() {
        
      return <MainNavi />
        
    }

}

export default Main;