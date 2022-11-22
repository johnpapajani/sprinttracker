import CardList from "./CardList";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "../styles.css";

const StandupLead = () => {
  return (
    <div className="StandupLead">
      <DndProvider backend={HTML5Backend}>
        <CardList />
      </DndProvider>
    </div>
  );
};

export default StandupLead;
