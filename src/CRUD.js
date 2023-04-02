import React,{useState, useEffect, Fragment} from "react";   
import Table from 'react-bootstrap/Table'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './index.css';


const CRUD = () => {
  
  //Test Data without API Integration during development
    const taskdata =[
        {
            task_id:1,
            task_name:'Task 1',
            task_priority:1,
            task_status:'Completed'
        },
        {
            task_id:2,
            task_name:'Task 2',
            task_priority:2,
            task_status:'Not-Started'
        }
    ]

    const [data, setdata] = useState([])
    const [show, setShow] = useState(false);

    //Click functions
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
    //add
    const[task_name, set_name] = useState('')
    const[task_priority, set_priority] = useState('')
    const[task_status, set_NotStarted] = useState('NotStarted')

     //edit
     const[edit_task_id, set_edit_taskid] = useState(0)
     const[edit_task_name, set_edit_name] = useState('')
     const[edit_task_priority, set_edit_priority] = useState('')
     const[edit_task_status, set_edit_status] = useState('')

     //DropDown Change Event
     const [option,setOption] = useState()

    function handleChange(event){
    setOption(event.target.value)
    set_NotStarted(event.target.value);
    }

    //set API
    useEffect(()=>{
    getdata();
    },[])

    //GET data
    const getdata = () =>{
      axios.get('https://localhost:7254/api/Task') 
      .then((result)=>{
        setdata(result.data)
      })
      .catch((error)=>{
        console.log(error)
      })
    }

    //Validate Save Input
    const ValidInput=()=>{

      var flag=true;
      if(task_name.length===0) flag=false;
      if(task_priority.length===0) flag=false;
      if(flag==false) toast.error('Task name/Task priority cannot be empty');

      return flag;
    }

    //Validate Edit Input
    const ValidEditInput=()=>{

      var flag=true;
      if(edit_task_name.length===0) flag=false;
      if(edit_task_priority.length===0) flag=false;
      if(flag==false) toast.error('Task name/Task priority cannot be empty');

      return flag;
    }

    //POST data
    const handleSave = () =>{
      if(ValidInput())
    {
      const URL = 'https://localhost:7254/api/Task'
      const data = new FormData();
        data.append("task_name",task_name);
        data.append("task_priority",task_priority);
        data.append("task_status", task_status );

       axios.post(URL,data)
      .then((result)=>{
        if(result.status == 200){
          toast.error('Task Name: '+ task_name+' already exist.');
          return;
        } 
        else {
        getdata();
        clear();
        toast.success('Task has been added');
      }}).catch((error)=>{
        toast.error(error);
      })
    }
    else return;
  }

  //Clear Controls after Save/Edit
    const clear = () =>{
      set_name('');
      set_priority('');
      set_NotStarted('NotStarted');
      set_edit_name('');
      set_edit_priority('');
    }

  //Edit button click : data mapping to controls
    const handleEdit =(task_name) =>{
      handleShow();
      axios.get('https://localhost:7254/api/Task/'+task_name)
      .then((result)=>{
        set_edit_taskid(result.data.task_id);
        set_edit_name(result.data.task_name);
        set_edit_priority(result.data.task_priority);
        set_edit_status(result.data.task_status);
      })
    }

    // Updating EDIT data
    const handleUpdate =() =>{
      if(ValidEditInput())
    {
      
      const URL = 'https://localhost:7254/api/Task/';
      const data = new FormData();
        data.append("edit_task_name",edit_task_name);
        data.append("edit_task_priority",edit_task_priority);
        data.append("edit_task_status",task_status );
      
       axios.put(URL+ edit_task_id+"?task_name="+edit_task_name+"&task_priority="+edit_task_priority+
       "&task_status="+task_status)
      .then((result)=>{

        console.log(result);
       var text = result.data;

        if(text.includes("exist")){
          toast.error('Task Name: '+ task_name+' already exist.');
          return;
        } 
        
        else {
        getdata();
        clear();
        toast.success('Task has been updated');
        setShow(false);
      }}).catch((error)=>{
        toast.error(error);
      })
    }
    }

    //Handle deletion of Completed tasks
    const handleDelete =(task_name,task_status) =>{
      if(task_status.toLowerCase()=='Completed'.toLowerCase())
      {
        if(window.confirm("Confirm task delete:" + task_name) === true)
      {
        axios.delete( 'https://localhost:7254/api/Task/'+task_name)
        .then((result)=>{
          if(result.status === 200)
          { 
            toast.success('Task: '+task_name+' has been deleted');
            getdata();
          }
        })
      }
    }
    else{
      toast.error('Deletion of only completed tasks allowed.'); }
    }

//DOM element binding
    return(
    <Fragment>
      <ToastContainer />
      <br></br> <br></br>
      <Container>
      <Row>
        <Col>
        <input type="text" className="form-control" placeholder="Task Name" 
        id="taskname" value={task_name} onChange={(e)=> set_name(e.target.value)} required />
        </Col>
        <Col>
        <input id="taskpriority" type="number" className="form-control" placeholder="Task Priority"  maxLength={5} max={10000} min={1} value={task_priority} 
        onChange={(e)=> set_priority(e.target.value)} required />
        </Col>
        <Col >
        <label class='control-label'>Task Status</label> &nbsp;
        <select id="taskstatus" class='dropdown' name='option' onChange={handleChange} defaultValue={set_NotStarted}>
             <option value="NotStarted" selected="True">NotStarted</option>
             <option value="InProgress">InProgress</option>
             <option value="Completed">Completed</option>
        </select>

        </Col>
        <Col>
        <button className="btn btn-primary" id="btnadd" type="submit" onClick={()=> handleSave()}>Add</button>
        </Col>
      </Row>
      </Container>
      <br></br>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Task Name</th>
          <th>Task Priority</th>
          <th>Task Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {
            data && data.length>0 ?
            data.map((item, index)=>{
                return(
                    <tr key={index}>
                        <td>{index+1}</td>
                        <td>{item.task_name}</td>
                        <td>{item.task_priority}</td>
                        <td>{item.task_status}</td>
                        <td colSpan={2}>
                        <button className="btn btn-primary" onClick={() => handleEdit(item.task_id)} >Edit</button>
                        &nbsp;
                        <button className="btn btn-danger" onClick={() => handleDelete(item.task_name,item.task_status)} >Delete</button>
                        </td>
                    </tr>
                )
            })
            :
            'Loading....'
        }
      </tbody>
    </Table>
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
        <Row>
        <Col>
        <input type="text" className="form-control" placeholder="Task Name" value={edit_task_name} 
        onChange={(e)=> set_edit_name(e.target.value)} />
        </Col>
        <Col>
        <input type="number" className="form-control" placeholder="Task Priority" max={10000} min={0} maxLength={5} value={edit_task_priority} 
        onChange={(e)=> set_edit_priority(e.target.value)} />
        </Col>
        <Col>
        
        <select class='dropdown' name='option' onChange={handleChange} 
          setOption={set_edit_status}>
        <option value="Not-Started" selected={edit_task_status == 'NotStarted' ? true : false}> NotStarted</option>
        <option value="In-Progress" selected={edit_task_status == 'InProgress' ? true : false}>InProgress</option>
        <option value="Completed" selected={edit_task_status == 'Completed' ? true : false}>Completed</option>
        </select>

        </Col>
      </Row>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>

    )
  }


export default CRUD;