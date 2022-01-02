import React, { useState } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { FileUpload } from 'primereact/fileupload';
import { Card } from 'primereact/card';
import { ScrollPanel } from 'primereact/scrollpanel';
import { ScrollTop } from 'primereact/scrolltop';
import { Button } from 'primereact/button';

const App = () => {
    const [logs, setLogs] = useState([]);
    const [currentLogNote, setCurrentLogNote] = useState();
    const [shiftKeyDown, setShiftKeyDown] = useState(false);


    const fileUploader = async (event) => {

        var tempLogsText = await event.files[0].text();
        var tempLogsJson = JSON.parse(tempLogsText);
        setLogs(tempLogsJson.Logs);
    }

    const processInputDown = (key) => {
        if (key === "Shift") {
            setShiftKeyDown(true);
        }
        if (key === "Enter" && !shiftKeyDown) {
            setLogs([...logs, { "Timestamp": new Date().toISOString(), "Note": currentLogNote }])
            setCurrentLogNote("");
        }
    }

    const processInputUp = (key) => {
        if (key === "Shift") {
            setShiftKeyDown(false);
        }
    }

    const downloadLogs = () => {
        const a = document.createElement('a');
        const file = new Blob([JSON.stringify({ "Logs":logs })], { type: 'application/json' });
        a.href = URL.createObjectURL(file);
        a.download = "dndlogs";
        a.click();
        URL.revokeObjectURL(a.href);
    }

    const chooseOptions = { label: 'Choose'};
    const uploadOptions = { label: 'Upload'};
    const cancelOptions = { label: 'Cancel'};

    return (<>
        <div class="">
            <Card className="m-6">
                <div class="flex flex-wrap align-items-stretch card-container blue-container">
                    <FileUpload className="flex m-2 flex-grow-1"
                        name="upload" url="./upload" accept=".json" chooseOptions={chooseOptions} auto multiple={false} cancelOptions={cancelOptions} customUpload uploadHandler={fileUploader} />
                </div>
            </Card>

            <ScrollPanel className="m-6" style={{ width: '95vw', height: '40vh' }}>
                {logs.map((log, index) => {
                    return (
                        <Card className="surface-overlay m-2" style={{ "height": "auto" }} subTitle={new Date(log.Timestamp).toLocaleString()}>
                            <div style={{ "white-space":"pre-wrap" }}>{log.Note}</div>
                        </Card>
                    );
                })}
            </ScrollPanel>

            <Card className="m-6">
                <div class="flex flex-wrap card-container blue-container">
                    <InputTextarea id="in" value={currentLogNote} onChange={(e) => setCurrentLogNote(e.target.value)} className="flex flex-grow-1 m-2" onKeyDown={(e) => processInputDown(e.key)} onKeyUp={(e) => processInputUp(e.key)} />
                    <Button className="flex flex-grow-0 m-2" label="Save" onClick={downloadLogs} />
                </div>
            </Card>
        </div> 
    </>);
}

export default App;
