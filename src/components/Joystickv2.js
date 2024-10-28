import React, { useRef, useEffect, useState } from 'react';
import { Joystick } from 'react-joystick-component';
import { ButtonGroup, ToggleButton, Form } from '@themesberg/react-bootstrap';
import { socket } from "../services/socket";

export default function Joystickv2() {

    const [joystickAxis, setJoystickAxis] = useState(["x", "z"])

    const [joystickData, setJoystickData] = useState({ x: 0.0, y: 0.0 })

    const [lockState, setLockState] = useState("Free");

    function ParseFloat(str, val) {
        str = str.toString();
        str = str.slice(0, (str.indexOf(".")) + val + 1);
        return Number(str);
    }

    const handleMove = (data) => {
        console.log(ParseFloat(data.x, 1), ParseFloat(data.y, 1), ParseFloat(data.y * 0.1, 2))

        if (joystickData.x != ParseFloat(data.x, 1) || joystickData.y != ParseFloat(data.y, 1)) {
            setJoystickData({ x: ParseFloat(data.x, 1), y: ParseFloat(data.y, 1) })
        }
        //setJoystickData({ x: ParseFloat(data.x, 1), y: ParseFloat(data.y, 1) })


    };

    const handleStop = () => {
        setJoystickData({ x: 0, y: 0 })
    };

    const axisSelect = (e) => {
        setJoystickAxis(e.target.value.split(","))
        socket.emit("turnType", e.target.value)
        console.log(e.target.value.split(","))
    }

    const lockSelect = (e) => {
        setLockState(e.target.value);
    };

    function createObject(values) {
        let obj = {};

        for (let key in values) {
            if (values.hasOwnProperty(key)) {
                obj[key] = values[key];
            }
        }
        return obj;
    }

    useEffect(() => {
        if (joystickAxis[0] == "x" && joystickAxis[1] == "y") {
            let conditions = { x: joystickData.x, y: joystickData.y }
            let dynamicObject = createObject(conditions);
            socket.emit("Joystick", dynamicObject)
        } else if (joystickAxis[0] == "x" && joystickAxis[1] == "z") {
            let conditions = { x: joystickData.x, z: joystickData.y }
            let dynamicObject = createObject(conditions);
            socket.emit("Joystick", dynamicObject)
        } else if (joystickAxis[0] == "y" && joystickAxis[1] == "z") {
            let conditions = { y: 0, z: joystickData.y }
            let dynamicObject = createObject(conditions);
            socket.emit("Joystick", dynamicObject)
        }
    }, [joystickData])

    return (
        <>
           
            <Form.Select className="mt-2 mb-4" onChange={(e) => lockSelect(e)}>
                <option value="">Free</option>
                <option value="axisX">Only X</option>
                <option value="axisY">Only Y</option>
            </Form.Select>

            <div style={{ justifyContent: 'center', display: 'flex', marginTop: '30px', marginBottom: '30px' }}>
                <Joystick controlPlaneShape={lockState} size={160} baseColor="#1a1a1a" stickColor="white" move={handleMove} stop={handleStop}></Joystick>
            </div>

        </>
    )
}
