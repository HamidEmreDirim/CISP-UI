import React, { useRef, useEffect, useState } from 'react';
import nipplejs from 'nipplejs';
import { ButtonGroup, ToggleButton, Form } from '@themesberg/react-bootstrap';
import { socket } from "../services/socket";
import Joystickv2 from './Joystickv2';

const Joystick = () => {
    const joystickContainer = useRef(null);

    const [joystickAxis, setJoystickAxis] = useState(["x", "y"])

    const [joystickData, setJoystickData] = useState({ x: 0.0, y: 0.0 })

    const [lockState, setLockState] = useState("Free");
    const [lockX, setLockX] = useState(false);
    const [lockY, setLockY] = useState(false);

    function ParseFloat(str, val) {
        str = str.toString();
        str = str.slice(0, (str.indexOf(".")) + val + 1);
        return Number(str);
    }

    const axisSelect = (e) => {
        setJoystickAxis(e.target.value.split(","))
        socket.emit("turnType", e.target.value)
        console.log(e.target.value.split(","))
    }

    const lockSelect = (e) => {
        const lockValue = e.target.value;
        setLockState(lockValue); // Lock state güncelle

        // Lock state'e göre lockX ve lockY değerlerini ayarla
        if (lockValue === "Free") {
            setLockX(false);
            setLockY(false);
        } else if (lockValue === "LockVertical") {
            setLockX(true);
            setLockY(false);
        } else if (lockValue === "LockHorizontal") {
            setLockX(false);
            setLockY(true);
        }
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
        const manager = nipplejs.create({
            zone: joystickContainer.current,
            mode: 'dynamic',
            color: 'red',
            shape: 'circle',
            lockX: lockX,
            lockY: lockY,
        });

        manager.on('move', (evt, nipple) => {
            setJoystickData({ x: ParseFloat(nipple.vector.x, 2) * -1, y: ParseFloat(nipple.vector.y * -1, 2) })
        });

        manager.on('end', (evt, nipple) => {
            setJoystickData({ x: 0, y: 0 })
        });

        return () => {
            manager.destroy();
        };
    }, [lockState]);

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
            <Form.Select className="mt-4" onChange={(e) => axisSelect(e)}>
                <option value="">Select Turn Type</option>
                <option value="x,z">Double Turn</option>
                <option value="x,y">Crab Walk</option>
                <option value="y,z">Center Turn</option>
            </Form.Select>
            <Form.Select className="mt-2 mb-4"  onChange={(e) => lockSelect(e)}>
                <option value="Free">Free</option>
                <option value="LockVertical">Lock Vertical</option>
                <option value="LockHorizontal">Lock Horizontal</option>
            </Form.Select>

            <div ref={joystickContainer} style={{ width: '100%', height: '200px', borderRadius: '10%', marginTop: '35px', backgroundColor: '#1a1a1a' }} >
                <label style={{ color: 'white', fontSize: '20px', textAlign: 'center', marginTop: '85px' }}>Joystick Area</label>
            </div>

        </>
    )
};

export default Joystick;
