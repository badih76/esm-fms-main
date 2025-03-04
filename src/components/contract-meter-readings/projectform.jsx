import React, { Component } from 'react';
import Input from '../../common/input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonGroup, Button, ButtonToolbar } from 'react-bootstrap'
import processing from '../../images/processing.gif';

class ProjectForm extends Component {
    state = {
        error: '',
        bottomTBVisible: "hidden",
        topTBVisible: "",
        flags: {
            isAdd: false,
            isEdit: false
        }

    }

    render() {
        const { project } = this.props;

        return (
            <React.Fragment>
                <div className={this.props.showFormProcess}>
                    <img src={processing} 
                        width="60vw" 
                        alt="processing"  
                        style={{marginTop: "5vh"}} />
                </div>
                
                <Input 
                    name='txtPrjName'
                    label='Project Name'
                    type='text'
                    value={project.prjName}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"}
                    error={this.state.error}
                />
                <Input 
                    name='txtPrjCode'
                    label='Project Code'
                    type='text'
                    value={project.prjCode}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"}
                    error={this.state.error}
                />
                <Input 
                    name='txtPrjDesc'
                    label='Description'
                    type='text'
                    value={project.prjDescription}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"}
                    error={this.state.error}
                />
                <Input 
                    name='txtClName'
                    label='Client Name'
                    type='text'
                    value={project.clientName}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"}
                    error={this.state.error}
                />
                
                <div className={this.state.bottomTBVisible}>
                    <ButtonToolbar>
                        <ButtonGroup justified>
                            <ButtonGroup>
                                <Button bsStyle="success" onClick={this.handleOnSave}>
                                    <FontAwesomeIcon icon='save' />
                                </Button>
                            </ButtonGroup>
                            <ButtonGroup>
                                <Button bsStyle="danger" onClick={this.handleOnCancel}>
                                    <FontAwesomeIcon icon='ban' />
                                </Button>
                            </ButtonGroup>
                        </ButtonGroup>
                    </ButtonToolbar>
                </div>
            </React.Fragment>

        );
    }
}

export default ProjectForm;