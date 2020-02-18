import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import '../../style/common/header.css'

class Header extends Component {

    logout = () => {
        localStorage.clear(); 
        this.props.history.push("/users/login");
    }
    
    render() {
        return (
        <div className="header">
          <Link to="/" className="ediary">School eDiary</Link>
            {
                localStorage.getItem("user") ?
                  <div className="header_links">
                    {
                        localStorage.getItem("role")==="admin" &&
                        (<div className="header_links">
                        <Link to="/users">Users</Link>
                        <Link to="/subjects">Subjects</Link>
                        <Link to="/activities">Activities</Link>
                        <Link to="/teachers">Teachers</Link>
                        <Link to="/classes">Classes</Link>

                        </div>)
                    }
                    {
                       localStorage.getItem("role")==="teacher" &&
                       (<div className="header_links">
                       <Link to="/subjectClasses">My subjects</Link>
                       
                       </div>) 
                    }
                    {
                       localStorage.getItem("role")==="parent" &&
                       (<div className="header_links">
                       <Link to="/parentgrading">My children</Link>
                       
                       </div>) 
                    }
                     {
                       localStorage.getItem("role")==="student" &&
                       (<div className="header_links">
                       <Link to="/studentgrading">My marks</Link>
                       
                       </div>) 
                    }
                    <div className="logout" onClick={this.logout}>Logout<label>{localStorage.getItem("role")}</label></div>
                    </div>
                    :
                   ( <Link  className="login" to="/users/login">Login</Link>)
                
            }
        </div>
        )
    }
};

export default withRouter(Header);