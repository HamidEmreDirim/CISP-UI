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

  // Autonomous / Manuel sürüş modları
  const [movementModStatus, setMovementModStatus] = useState(false);
  const [movementMod, setMovementMod] = useState('2');

  // Hız ayarı (speedFactor)
  const [rangeValue, setRangeValue] = useState(30);

  // Plow (kol/kepçe) konumunu/servo açısını temsil eden değer
  const [plowSpeed, setPlowSpeed] = useState(5);

  // Joystick’ten gelen verileri tutacağımız state
  // Örnek: { x: 0, y: 0, z: 0 }
  const [joystickState, setJoystickState] = useState({ x: 0, y: 0, z: 0 });

  // Tek event ile hangi verileri göndereceğimizi kolayca kontrol edelim
  const emitAllData = (override = {}) => {
    // override ile joystickState veya diğerlerini manuel güncelleyebilirsiniz
    const dataToSend = {
      x: override.x !== undefined ? override.x : joystickState.x,
      y: override.y !== undefined ? override.y : joystickState.y,
      z: override.z !== undefined ? override.z : joystickState.z,
      plow: plowSpeed,
      speedF: rangeValue,
      turnType: 'x,z' // mevcuttaki default değer
    };
    socket.emit("Joystick", dataToSend);
  };

  // Örnekte, Joystickv2 içinden bir callback ile x,y,z alıp state’e koyuyoruz
  // Sonra emitAllData() diyerek backend’e tek seferde iletiyoruz.
  const handleJoystickChange = (newX, newY, newZ) => {
    setJoystickState({ x: newX, y: newY, z: newZ });
    // Joystick değiştiğinde veriyi gönder
    emitAllData({ x: newX, y: newY, z: newZ });
  };

  // movementMod değişince (Autonomous <-> Manuel)
  const handleChange = (e) => {
    if (movementMod === '1' && e.currentTarget.value === '2') {
      Swal.fire({
        icon: "warning",
        title: "Autonomous driving mode is turned off. Do you approve?",
        showDenyButton: true,
        confirmButtonText: "Confirm",
        denyButtonText: `Deny`
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire("Switched to manual driving!", "", "success");
          setMovementMod('2');
          setMovementModStatus(false);
          socket.emit("autonomousState", 'Manuel');
        }
      });
    }
    else if (movementMod === '2' && e.currentTarget.value === '1') {
      Swal.fire({
        icon: "warning",
        title: "Autonomous driving mode is turned on. Do you approve?",
        showDenyButton: true,
        confirmButtonText: "Confirm",
        denyButtonText: `Deny`
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire("Switched to autonomous driving!", "", "success");
          setMovementMod('1');
          setMovementModStatus(true);
          socket.emit("autonomousState", 'Autonomous');
          // Olası çakışmaları önlemek için joysticki sıfırlayalım
          setJoystickState({ x: 0, y: 0, z: 0 });
          // Sıfırlanmış joystick değerlerini gönder
          emitAllData({ x: 0, y: 0, z: 0 });
        }
      });
    }
  };

  // Uygulama ilk yüklendiğinde (component mount) yapılacaklar
  useEffect(() => {
    socket.emit("turnType", 'x,z');
    socket.emit("cameraSelect", 'Front Cam');
    // Eskiden burada "speedFactor" emit ediyordunuz, ancak
    // artık tek bir "Joystick" eventi üzerinden gönderiyoruz.
  }, []);

  // Speed (rangeValue) değiştiğinde tek seferde Joystick event’iyle gönderelim
  const sliderChange = (newVal) => {
    setRangeValue(newVal);
    emitAllData({});  // Mevcut joystickState + yeni speed
  };

  // Plow değerini (servo açısı) güncellersek yine tek event ile göndereceğiz
  const plowSpeedHandler = (data) => {
    if (plowSpeed !== data) {
      setPlowSpeed(data);
      emitAllData({}); // Mevcut joystickState + yeni plow
    }
  };

  // Plow kolunu fiziksel olarak "yukarı" veya "aşağı" hareket ettirme
  // Bu örnekte eskiden socket.emit("plowArm", …) yapıyordunuz.
  // Ama isterseniz yine burada da ek bir event atabilirsiniz.
  // Veya “Joystick” event’i üzerinden plow konumunu takip edebilirsiniz.
  const plowArmUp = () => {
    // Örnek: servo’nun gerçek açısını vs. backend kendisi hesaplayabilir.
    // isterseniz ek olarak:
    // socket.emit("plowArm", -25.5 * plowSpeed); // (isterseniz koruyabilirsiniz)
    emitAllData(); // Plow state’inizi backend’e iletiyor.
  };

  const plowArmDown = () => {
    // socket.emit("plowArm", 25.5 * plowSpeed); // (isterseniz koruyabilirsiniz)
    emitAllData();
  };

  // Autonomous modda "start" ve "stop" tuşları
  const startDrive = () => {
    socket.emit("autonomousDrive", 'start');
  };

  const stopDrive = () => {
    socket.emit("autonomousDrive", 'stop');
  };

  // Kamera seçimi vs. (isterseniz koruyabilirsiniz)
  const cameraSelect = (e) => {
    socket.emit("cameraSelect", e.target.value);
  };

  // ToggleButton listesi
  const movementMods = [
    { name: 'Autonomous', value: '1' },
    { name: 'Manuel', value: '2' }
  ];

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
          onChange={sliderChange}
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
          {/* 
            Joystickv2 bileşeni joystick hareketlerini parent'a bildiriyor.
            Mesela onMove={(x, y, z) => handleJoystickChange(x, y, z)} gibi 
            bir callback bekliyoruz. Joystickv2 içinde bu callback'i tetiklerseniz
            buradan yakalar ve emitAllData() çağırırız.
          */}
          <Joystickv2 onMove={(x, y, z) => handleJoystickChange(x, y, z)} />

          <div className='slider mb-5'>
            <label className="mt-1">Servo Angle</label>
            <Slider
              min={0}
              max={135}
              value={plowSpeed}
              labels={{ '0': '0', 135: '135' }}
              onChange={plowSpeedHandler}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '50px' }}>
              <Button
                onClick={plowArmUp}
                severity="success"
                label="Up"
                style={{ marginRight: '10px', marginBottom: '10px', height: '60px', width: '100px' }}
              />
              <Button
                onClick={plowArmDown}
                severity="warning"
                label="Down"
                style={{ height: '60px', width: '100px' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
