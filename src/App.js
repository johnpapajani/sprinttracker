import { useState } from "react";
import RandomPicker from "./components/RandomPicker";
import StandupLead from "./components/StandupLead";
import SwitchPages from "./components/SwitchPages";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {

  const [pickerIsActive, setpickerIsActive] = useState(true)
  const [standupIsActive, setstandupIsActive] = useState(false)


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SwitchPages pickerStatus={pickerIsActive} standupStatus={standupIsActive} 
        choosePicker={setpickerIsActive} chooseStandup={setstandupIsActive} />}>
          <Route index element={<RandomPicker />} />
          <Route path="standup" element={<StandupLead />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
