import CardList from "./CardList";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useNavigate } from "react-router-dom";
import "../styles.css";

const StandupLead = (props) => {
  const navigate = useNavigate();

  const switchPicker = () =>{
    navigate('/');
    props.chooseStandup(false)
    props.choosePicker(true)
  }
  return (
    <div className="StandupLead">
      <DndProvider backend={HTML5Backend}>
        <CardList switchPicker={switchPicker} />
      </DndProvider>
    </div>
  );
};

export default StandupLead;
