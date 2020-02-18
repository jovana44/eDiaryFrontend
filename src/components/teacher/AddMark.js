import React, { Component } from 'react';
import '../../style/teacher/addMark.css';

class AddMark extends Component{

    constructor(props){
        super(props);
        this.state={ activities:[], name:'usmeni', mark:'' };
    }

    componentDidMount(){

        if(localStorage.getItem('user') === null) {
            this.props.history.push('/users/login');
        } else if(!(localStorage.getItem('role') === "teacher")){
            this.props.history.push('/');
        } else {
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic '+ localStorage.getItem("user")
                }
            };
            fetch('http://localhost:8080/activities' , requestOptions)
            .then(response => {
                if(response.ok) {
                    response.json().then(data =>
                        this.setState({activities: data })    
                    )
                }else {
                    response.text().then(message => alert(message))
                }
            })
            .catch(error => console.log(error))
        }    
    }

    handleInputChange= (event) =>{
        const target = event.target;
        const name = target.name;
    
        this.setState({
            [name]: target.value
        });
    }

    handleSubmit = (event) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + localStorage.getItem("user")
            },
            body: JSON.stringify({
                teacherDto: {  id: localStorage.getItem("ID") },
                subjectDto: { id: this.props.match.params.currentSubjectId  },
                studentDto: {  id: this.props.match.params.studentId },
                mark: this.state.mark,
                activityDto: { name: this.state.name }
            })
        };
        
        fetch('http://localhost:8080/gradings' , requestOptions)
        .then(response => 
            {
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
        event.preventDefault();
    };

    render(){
        return(
            <div className="login_form">
                <form onSubmit={this.handleSubmit}>
                <h3>Mark:</h3>
                <div className="container">
              
               <div>
                <input 
                    type="radio" 
                    id="r1"
                    name="mark" 
                    value="1"
                    checked={this.state.mark==="1"}
                    onChange={this.handleInputChange} />
                 <label htmlFor="r1">1</label>
               </div>
               <div>
                <input 
                    type="radio" 
                    id="r2"
                    name="mark" 
                    value="2"
                    checked={this.state.mark==="2"}
                    onChange={this.handleInputChange} />
                 <label htmlFor="r2">2</label>
                 </div>
                 <div>
                <input 
                    type="radio" 
                    id="r3"
                    name="mark" 
                    value="3"
                    checked={this.state.mark==="3"}
                    onChange={this.handleInputChange} />
                 <label htmlFor="r3">3</label>
                 </div>
                 <div>
                <input 
                    type="radio" 
                    id="r4"
                    name="mark" 
                    value="4"
                    checked={this.state.mark==="4"}
                    onChange={this.handleInputChange} />
                 <label htmlFor="r4">4</label>
                 </div>
                 <div>
                <input 
                    type="radio" 
                    id="r5"
                    name="mark" 
                    value="5"
                    checked={this.state.mark==="5"}
                    onChange={this.handleInputChange} />
                <label htmlFor="r5">5</label>
                </div>
                </div>


                <label className="activity">Pick activity:</label>
                <select onChange={this.handleInputChange} name="name" value={this.state.name} >
                    {
                        this.state.activities &&
                        this.state.activities.map(activity =>
                            <option key={activity.id} value={activity.name}>{activity.name}</option>

                        )
                    }
                </select>

                <input type="submit" value="Add" className="submit" />
                <input type="button" value="Cancel" className="cancel" onClick={()=>this.props.history.push("/class/"+
                                            this.props.match.params.id+"/subject/"+ this.props.match.params.currentSubjectId)} />
                <label className="error">{this.state.errorMessage}</label>
                </form>
            </div>
        )
    }

}

export default AddMark;