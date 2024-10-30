
import React, { useEffect, useState } from "react";
import { } from '@fortawesome/free-solid-svg-icons';
import { ButtonGroup, ToggleButton, Form } from '@themesberg/react-bootstrap';
import Swal from "sweetalert2"
import Slider from 'react-rangeslider'
import "react-rangeslider/lib/index.css"
import Joystickv2 from "./Joystickv2";
import { Button } from "primereact/button"
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { socket } from "../services/socket";


export default () => {

    const [movementModStatus, setMovementModStatus] = useState(false)

    const [movementMod, setMovementMod] = useState('2');

    const [rangeValue, setRangeValue] = useState(30);

    const [plowSpeed, setPlowSpeed] = useState(5);

    const movementMods = [
        { name: 'Autonomous', value: '1' },
        { name: 'Manuel', value: '2' }
    ];

    function createObject(values) {
        let obj = {};

        for (let key in values) {
            if (values.hasOwnProperty(key)) {
                obj[key] = values[key];
            }
        }

        return obj;
    }

    const handleChange = (e) => {
        if (movementMod == 1 && e.currentTarget.value == '2') {
            Swal.fire({
                icon: "warning",
                title: "Autonomous driving mode is turned off. Do you approve?",
                showDenyButton: true,
                confirmButtonText: "Confirm",
                denyButtonText: `Deny`
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire("Switched to manual driving!", "", "success");
                    setMovementMod('2')
                    setMovementModStatus(false)
                    socket.emit("autonomousState", 'Manuel')
                }
            });
        }
        else if (movementMod == 2 && e.currentTarget.value == '1') {
            Swal.fire({
                icon: "warning",
                title: "Autonomous driving mode is turned on. Do you approve?",
                showDenyButton: true,
                confirmButtonText: "Confirm",
                denyButtonText: `Deny`
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire("Switched to autonomous driving!", "", "success");
                    setMovementMod('1')
                    setMovementModStatus(true)
                    socket.emit("autonomousState", 'Autonomous')
                    socket.emit("Joystick", { x: 0.0, y: 0.0 })
                }
            });
        }
    }

    useEffect(() => {
        socket.emit("turnType", 'x,z')
        socket.emit("speedFactor", rangeValue)
        socket.emit("cameraSelect", 'Front Cam')
    }, [])

    const sliderChange = (e) => {
        setRangeValue(e)
        socket.emit("speedFactor", e)
    }

    const turnType = (e) => {
        socket.emit("turnType", e.target.value)
    }

    const cameraSelect = (e) => {
        socket.emit("cameraSelect", e.target.value)
    }
    const startDrive = (data) => {
        socket.broadcast.emit("autonomousDrive", 'start')
    }

    const stopDrive = () => {
        socket.emit("autonomousDrive", 'stop')
    }

    const plowSpeedHandler = (data) => {
        if (plowSpeed != data) {
            setPlowSpeed(data)
        }
    }

    const plowArmUp = () => {
        socket.emit("plowArm", -25.5 * plowSpeed)
        console.log(-2.55 * plowSpeed)
    }

    const plowArmDown = () => {
        socket.emit("plowArm", 25.5 * plowSpeed)
    }

    return (
        <div className="text-center" style={{ height: '100%' }}>

            <ButtonGroup>
                {movementMods.map((radio, idx) => (
                    <ToggleButton
                        key={idx}
                        id={`radio-${idx}`}
                        type="radio"
                        variant={idx % 2 ? 'outline-success' : 'outline-danger'}
                        name="radio"
                        value={radio.value}
                        checked={movementMod === radio.value}
                        onChange={handleChange}
                    >
                        {radio.name}
                    </ToggleButton>
                ))}
            </ButtonGroup>

            <div className='slider mt-5 mb-5'>
                <Slider
                    min={0}
                    max={100}
                    value={rangeValue}
                    labels={{ 0: 'Slow', 50: 'Speed Factor', 100: 'Fast' }}
                    onChange={(e) => sliderChange(e)}
                />
            </div>

            <hr className="border border-black border-2 mt-5"></hr>

            {movementModStatus ? (
                <div style={{ display: 'flex', justifyContent: 'space-between' }} className="mt-4">
                    <Button onClick={startDrive} severity="success" label="Start Drive" style={{ marginRight: '10px', marginBottom: '10px', height: '60px' }} />
                    <Button onClick={stopDrive} severity="danger" label="Stop Drive" style={{ height: '60px' }} />
                </div>
            ) : (
                <div>
                    <Joystickv2 />
                    <div className='slider mb-5'>
                        <label className="mt-1">Servo Angle</label>
                        <Slider
                            min={0}
                            max={255}
                            value={plowSpeed}
                            labels={{ '0': '0', 255: '255' }}
                            onChange={(e) => plowSpeedHandler(e)}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '50px' }}>
                            <Button onClick={plowArmUp} severity="success" label="Up" style={{ marginRight: '10px', marginBottom: '10px', height: '60px', width: '100px' }} />
                            <Button onClick={plowArmDown} severity="warning" label="Down" style={{ height: '60px', width: '100px' }} />
                        </div>
                    </div>
                </div>

            )}
        </div>
    );
};

/*            <Form.Select className="mt-4" onChange={(e) => cameraSelect(e)}>
                <option value="Front Cam">Front Cam</option>
                <option value="Left Cam">Left Cam</option>
                <option value="Right Cam">Right Cam</option>
            </Form.Select>*/