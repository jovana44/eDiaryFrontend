import React, { Component, Fragment} from 'react';
import {BrowserRouter as Router, Route,  Switch} from 'react-router-dom';

import Users from './components/users/Users';
import Login from './components/users/Login';
import AddUser from './components/users/AddUser';
import Roles from './components/role/Roles';
import AddRole from './components/role/AddRole';
import UpdateRole from './components/role/UpdateRole';
import NotFound from './components/common/NotFound';
import Home from './components/home/Home';
import Header from './components/common/Header';
import UpdateUser from './components/users/UpdateUser';
import Footer from './components/common/Footer';
import Subjects from './components/subject/Subjects';
import AddSubject from './components/subject/AddSubject';
import UpdateSubject from './components/subject/UpdateSubject';
import Activities from './components/activity/Activities';
import AddActivity from './components/activity/AddActivity';
import UpdateActivity from './components/activity/UpdateActivity';
import Semesters from './components/semester/Semesters';
import AddSemester from './components/semester/AddSemester';
import UpdateSemester from './components/semester/UpdateSemester';
import Teachers from './components/teacher/Teachers';
import SubjectsClasses from './components/teacher/SubjectsClasses';
import ClassRegister from './components/teacher/ClassRegister';
import AddTeacher from './components/teacher/AddTeacher';
import AddMark from './components/teacher/AddMark';
import MarkDetails from './components/teacher/MarkDetails';
import UpdateMark from './components/teacher/UpdateMark';
import ForStudent from './components/student/ForStudent';
import ForParent from './components/parent/ForParent';
import ChildrenMarks from './components/parent/ChildrenMarks';
import UpdateTeacher from './components/teacher/UpdateTeacher';
import Classes from './components/student/Classes';
import AddClass from './components/student/AddClass';
import UpdateClass from './components/student/UpdateClass';
import Students from './components/student/Students';
import Marks from './components/student/Marks';
import AddStudent from './components/student/AddStudent';


class App extends Component{
  render(){
    return (
    <Router>
      <Fragment>
        <Header></Header>
      <Switch>
        <Route exact path="/users/login" component={Login} />
        <Route exact path="/" component={Home} />

        <Route exact path="/users" component={Users} />
        <Route exact path="/users/addUser" component={AddUser} />
        <Route exact path="/users/updateUser/:id" component={UpdateUser} />
        <Route exact path="/roles" component={Roles} />
        <Route exact path="/roles/addRole" component={AddRole} />
        <Route exact path="/roles/updateRole/:id" component={UpdateRole} />

        <Route exact path="/subjects" component={Subjects} />
        <Route exact path="/subjects/addSubject" component={AddSubject} />
        <Route exact path="/subjects/update/:id" component={UpdateSubject} />

        <Route exact path="/activities" component={Activities} />
        <Route exact path="/activities/addActivity" component={AddActivity} />
        <Route exact path="/activities/update/:id" component={UpdateActivity} />

        <Route exact path="/semesters" component={Semesters} />
        <Route exact path="/semesters/addSemester" component={AddSemester} />
        <Route exact path="/semesters/update/:id" component={UpdateSemester} />

        <Route exact path="/teachers" component={Teachers} />
        <Route exact path="/teachers/addTeacher" component={AddTeacher} />
        <Route exact path="/teachers/update/:id" component={UpdateTeacher} />

        <Route exact path="/subjectClasses" component={SubjectsClasses} />
        <Route exact path="/class/:id/subject/:currentSubjectId" component={ClassRegister} />
        <Route exact path="/student/:studentId/subject/:currentSubjectId/class/:id" component={AddMark} />
        <Route exact path="/grading/:markId/subject/:currentSubjectId/class/:id" component={MarkDetails} />
        <Route exact path="/gradingupdate/:markId/subject/:currentSubjectId/class/:id" component={UpdateMark} />

        <Route exact path="/studentgrading" component={ForStudent} />
        <Route exact path="/parentgrading" component={ForParent} />
        <Route exact path="/parentgrading/:studentId" component={ChildrenMarks} />

        <Route exact path="/classes" component={Classes} />
        <Route exact path="/classes/addClass" component={AddClass} />
        <Route exact path="/classes/update/:id" component={UpdateClass} />
        <Route exact path="/classes/:id/students" component={Students} />
        <Route exact path="/classes/:id/students/:studentId" component={Marks} />
        <Route exact path="/classes/:id/addstudent" component={AddStudent} />

        <Route component={NotFound} />

      </Switch>
      <Footer></Footer>

      </Fragment>
    </Router>
    );
   }
}

export default App;
