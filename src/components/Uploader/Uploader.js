import React, { Component } from 'react';
import {connect} from 'react-redux';
import { displayOff } from '../../actions/actions.js';
import { Panel, ToggleButton,
  ButtonToolbar, ToggleButtonGroup }
  from 'react-bootstrap';
import './uploader.css';

import Dropzone from 'react-dropzone';

import { readJLQM, selectFile } from '../../actions/actions.js';

class Uploader extends Component{

  constructor(){
    super();
    this.state = {
      files: [],
      rejected:[],
      rawText:""
    }
  }

  onDrop = (files) => {
    console.log('accepted/rejected files :',files);
    let accept = [];
    let reject = [];
    files.forEach((file)=>{
      if (file.name.endsWith('.jlqm')){
        accept.push(file);
      }else{
        reject.push(file);
      }
    });
    this.setState({
      files:[...this.state.files, ...accept],
      rejected:[...this.state.rejected, ...reject]
    })


  }

  selectFile(evt,i){
    console.log('selected ',evt.target,i);
    this.state.files && this.props.displayOff();
    //this file reading operation shouldn't be done here
    const reader = new FileReader();
    this.setJLQM.bind(reader);
    reader.addEventListener("loadend", (evt) =>
    {
      this.setJLQM(evt.target.result)
      //evt.target.result has the jlqm text
      //reader does not work with binding of dispatch action
      //use a promise instead of this ya dummy
    })
    reader.readAsText(this.state.files[i]);
    //make sure other component(s) know that a file is available
    this.props.selectFile(true,this.state.files[i].name)
  }

  setJLQM(data){
    // console.log('data is...', data);
    this.setState({rawText:data});
    //dispatch action from here?
    this.props.readJLQM(data)
  }

  render(){
    //is readJLQM working?
    console.log('readJLQM', this.props.readJLQM);
    return(
      <div>
        <h3>Dropzone here:</h3>
        <div id="Dropzone">
          <Dropzone onDrop={this.onDrop} >
            <p>Feed me your JLQMs, ;3</p>
          </Dropzone>
        </div>
        <div>
            <Panel>
              {this.state.files.length ? <p>Accepted files:</p> : <div></div>}
              <ButtonToolbar>
                <ToggleButtonGroup type="radio" name="file-select">
                {
                  this.state.files.map((f,i) => <ToggleButton
                    key={i}
                    value={i}
                    onClick={(evt)=>{this.selectFile(evt,i)}}>{f.name} - {f.size}
                    bytes
                  </ToggleButton>)
                }
                </ToggleButtonGroup>
              </ButtonToolbar>
              {this.state.rejected.length ? <p>Rejected files: </p> : <div></div>}
              <ul className="list-group">
              {
                this.state.rejected.map(f => <li className="list-group-item"
                  key={f.name}>{f.name} - {f.size}
                  bytes
                </li>)
              }
            </ul>
          </Panel>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state,ownProps){
  return{
    display:state.display,
    selectedFile:state.text.fileStatus
  }

}

export default connect(mapStateToProps,{readJLQM,selectFile,displayOff})(Uploader)
