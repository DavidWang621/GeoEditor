import React, { useState } from 'react';
import MapView from './components/MapView';
import * as shapefile from "shapefile";
import na from './na.json'

function App() {

    const [fileExist, setFileExist] = useState(false);
    const [GeoJson, setGeoJson] = useState({});
    const [state, setState] = useState(false);

    let shpfile = null;
    let dbffile = null;
    const names = [];
    const properties =[];
    let count = 0;


    const handleShpDbfFile = (e,type) => {
        {
            console.log("reading: "+ type);
            const reader = new FileReader();
            reader.readAsArrayBuffer(e.target.files[0]);
            reader.onload = async e => {
                if(type==="dbf")
                    dbffile = reader.result
                if(type==="shp")
                    shpfile = reader.result
                if(dbffile && shpfile){
                    console.log("done")
                    handleSubmit()
                }
            }
        }
    }

    const handleSubmit = () => {
        setGeoJson({});
        console.log("shapefile.open")
        // console.log(shpfile)
        // console.log(dbffile)

        let geoJson = {
            type:"FeatureCollection",
            features: []
        }
        shapefile
            .open(
                shpfile,
                dbffile
            ).then(function (e){
            e.read().then(
                function next(result){
                    if(result.value) {
                        // console.log(result.value);
                        geoJson.features.push(result.value)
                    }
                    if(!result.done){
                        e.read().then(next)
                    }
                    else{
                        setGeoJson(geoJson)
                        setFileExist(true);
                    }
                })
        })
    }

    const changeRegionName = (oldName, newName) =>{
        console.log("newold", oldName, newName);
        let temp = GeoJson;
        temp.features.forEach((i) => {
            if (i.properties.name === oldName) {
                i.properties.name = newName;
                setGeoJson(temp);
            }
        })
        console.log("features", GeoJson.features);
        setState(!state);
    }

    const upload = () => {
        console.log("upload the NA region ")
        console.log(na)
        setGeoJson(na);
        setFileExist(true);
    }

    const handleGeoJson = (e) => {
        const reader = new FileReader();
        setGeoJson({});
        reader.readAsText(e.target.files[0]);
        reader.onload = e => {
            setGeoJson(JSON.parse(e.target.result));
        }
        setFileExist(true);
    }

    return (
        <div className="App">
            <button onClick={upload}>
                Display North America geojson
                come ona
            </button>

            <div>
                <div>
                    <div>Input geo.json File</div>
                    <input type="file" accept=".json" onChange={handleGeoJson}/>
                </div>
                <div  style={{height: 1,width: "fill", backgroundColor:"black"}}/>
                <div>
                    <div>Shapefile:
                        <input type="file" accept=".shp" onChange={e=>{handleShpDbfFile(e,"shp")}}/>
                    </div>
                    <div>Dbf:
                        <input type="file" accept=".dbf" onChange={e=>{handleShpDbfFile(e,"dbf")}}/>
                    </div>
                    {/*<div> <input type="submit" value="submit" onClick={handleSubmit} /></div>*/}
                </div>
            </div>

            {fileExist ? <MapView file={GeoJson} changeName={changeRegionName}/> : <></>}

        </div>
    );
}

export default App;