import React, { Component } from 'react';

class MarkDetails extends Component{

    constructor(props){
      super(props);
      this.state={ mark:null, errorMessage:''};
    }

    componentDidMount(){

        if(localStorage.getItem('user') === null) {
            this.props.history.push('/users/login');
        } else if(!(localStorage.getItem('role') === "teacher")){
            this.props.history.push('/');
        } else   {
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic '+ localStorage.getItem("user")
                }
            };
            fetch('http://localhost:8080/gradings/' + this.props.match.params.markId, requestOptions)
            .then(response => {
                if(response.ok) {
                    response.json().then(data =>
                        this.setState({ mark: data })    
                    )
                }else {
                    response.text().then(message => alert(message))
                }
            })
            .catch(error => console.log(error))
        }    
    }

    updateMark = () => {
        this.props.history.push("/gradingupdate/" + this.props.match.params.markId + "/subject/"+ this.props.match.params.currentSubjectId+
                    "/class/"+this.props.match.params.id);
    }

    deleteMark = () => {
        const path = 'http://localhost:8080/gradings/' + this.props.match.params.markId;
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic '+ localStorage.getItem("user")
            }
        };
        fetch(path, requestOptions)
        .then(response => {
            if(response.ok) {
                response.json().then(data => {
                    this.setState({errorMessage: ''})
                    this.props.history.push("/class/"+this.props.match.params.id+"/subject/"+ 
                                                this.props.match.params.currentSubjectId);
                });
            }else {
                response.text().then(message => this.setState({errorMessage: message}))
            }
        })
        .catch(error => console.log(error))
    }

    cancel= () =>{
        this.props.history.push("/class/"+this.props.match.params.id+"/subject/"+this.props.match.params.currentSubjectId);
    }

    render(){
        const heading=["Mark", "Activity", "Date","", "", ""];
        const buttons=[
            {name: "Update", action: this.updateMark, class: "btn-update"}, 
            {name: "Delete", action: this.deleteMark, class: "btn-update"},
            {name: "Cancel", action: this.cancel, class: "btn-update"}
           ];

         return(
            <div className="user_wrapper">
                    <table>
                <thead>
                    <tr>
                        {heading.map((head, index) => 
                            <th key={index}>{head}</th>    
                        )}
                    </tr>
                </thead>
                <tbody>
                    {
                        this.state.mark &&
                     <tr>
                         <td>{this.state.mark.mark}</td>
                         <td>{this.state.mark.activityDto.name}</td>
                         <td>{this.state.mark.date}</td>
                         {
                          buttons.map(btn => (
                          <td key={btn.name}><button className={btn.class} onClick={()=>btn.action()}>{btn.name}</button></td>
                          ))
                         }   
                     </tr> 
                    }
                 </tbody>
              </table>
            </div>
         )
    }
};

export default MarkDetails;