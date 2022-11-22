import {Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import "../styles.css";

const SwitchPages = (props) =>{

  const location = useLocation();


    const navigate = useNavigate();

    const pickerButtonHandler = () => {
        navigate('/');
        props.chooseStandup(false)
        props.choosePicker(true)
    } 

   const standupButtonHandler = () => {
       navigate('/standup');
       props.choosePicker(false)
        props.chooseStandup(true)
   } 

   useEffect(() => {
    if(location.pathname === "/standup"){
      props.choosePicker(false)
        props.chooseStandup(true)
    }

  },[])


    return(
        <div>
            <div className="SwitchPages">
        <div className="SwitchButtons">
          <button className={`${props.pickerStatus ? "active" : "inactive"}`} onClick={pickerButtonHandler}>
            Random Picker
          </button>
          <button className={`${props.standupStatus ? "active" : "inactive"}`} onClick={standupButtonHandler}>
            Standup Lead
          </button>
        </div>
      </div>
      <Outlet />
        </div>
    )
}

export default SwitchPages