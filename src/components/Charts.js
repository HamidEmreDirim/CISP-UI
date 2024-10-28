
import React, { useState, useEffect, useCallback } from "react";
import Chartist from "react-chartist";
import ChartistTooltip from 'chartist-plugin-tooltips-updated';
import { socket } from "../services/socket";

const MAX_DATA_POINTS = 10;

export const TemperatureChart = () => {

  const [temperatureData, setTemperatureData] = useState({
    labels: [],
    series: [[]]
  });

  const [navbarData, setNavbarData] = useState({ temperature: 0, humidity: 0, battery: 0 });

  const handleNavbarData = useCallback((data) => {
    setNavbarData((prevData) => {
      if (prevData.temperature !== data.temperature || prevData.humidity !== data.humidity || prevData.battery !== data.battery) {
        setTemperatureData(prevTempData => {
          const newLabels = [...prevTempData.labels, new Date().toLocaleTimeString()];
          const newSeries = [...prevTempData.series[0], data.temperature];

          if (newLabels.length > MAX_DATA_POINTS) {
            newLabels.shift();
            newSeries.shift();
          }

          return {
            labels: newLabels,
            series: [newSeries]
          };
        });
        return data;
      }
      return prevData;
    });
  }, []);


  useEffect(() => {
    socket.on('Navbar', handleNavbarData);
  }, [handleNavbarData]);



  const options = {
    low: 0,
    showArea: true,
    fullWidth: true,
    axisX: {
      position: 'end',
      showGrid: true
    },
    axisY: {
      // On the y-axis start means left and end means right
      showGrid: true,
      showLabel: true,
      labelInterpolationFnc: value => `${value / 1}°`
    },
    style: {
      backgroundColor: 'transparent',
    }
  };

  const plugins = [
    ChartistTooltip()
  ]

  return (
    <Chartist data={temperatureData} options={{ ...options, plugins }} type="Line" className="ct-series-g ct-double-octave" />
  );
};

export const HumidityChart = () => {

  const [humidityData, setHumidityData] = useState({
    labels: [],
    series: [[]]
  });

  const [navbarData, setNavbarData] = useState({ temperature: 0, humidity: 0, battery: 0 });

  const handleNavbarData = useCallback((data) => {
    setNavbarData((prevData) => {
      if (prevData.temperature !== data.temperature || prevData.humidity !== data.humidity || prevData.battery !== data.battery) {
        setHumidityData(prevHumidityData => {
          const newLabels = [...prevHumidityData.labels, new Date().toLocaleTimeString()];
          const newSeries = [...prevHumidityData.series[0], data.humidity];

          if (newLabels.length > MAX_DATA_POINTS) {
            newLabels.shift();
            newSeries.shift();
          }

          return {
            labels: newLabels,
            series: [newSeries]
          };
        });
        return data;
      }
      return prevData;
    });
  }, []);


  useEffect(() => {
    socket.on('Navbar', handleNavbarData);
  }, [handleNavbarData]);



  const options = {
    low: 0,
    showArea: true,
    fullWidth: true,
    axisX: {
      position: 'end',
      showGrid: true
    },
    axisY: {
      // On the y-axis start means left and end means right
      showGrid: true,
      showLabel: true,
      labelInterpolationFnc: value => `${value / 1}%`
    },
    style: {
      backgroundColor: 'transparent',
    }
  };

  const plugins = [
    ChartistTooltip()
  ]

  return (
    <Chartist data={humidityData} options={{ ...options, plugins }} type="Line" className="ct-series-g ct-double-octave" />
  );
};

export const BatteryChart = () => {

  const [batteryData, setBatteryData] = useState({
    labels: [],
    series: [[]]
  });

  const [navbarData, setNavbarData] = useState({ temperature: 0, humidity: 0, battery: 0 });

  const handleNavbarData = useCallback((data) => {
    setNavbarData((prevData) => {
      if (prevData.temperature !== data.temperature || prevData.humidity !== data.humidity || prevData.battery !== data.battery) {
        setBatteryData(prevBatteryData => {
          const newLabels = [...prevBatteryData.labels, new Date().toLocaleTimeString()];
          const newSeries = [...prevBatteryData.series[0], data.battery];

          if (newLabels.length > MAX_DATA_POINTS) {
            newLabels.shift();
            newSeries.shift();
          }

          return {
            labels: newLabels,
            series: [newSeries]
          };
        });
        return data;
      }
      return prevData;
    });
  }, []);


  useEffect(() => {
    socket.on('Navbar', handleNavbarData);
  }, [handleNavbarData]);



  const options = {
    low: 0,
    showArea: true,
    fullWidth: true,
    axisX: {
      position: 'end',
      showGrid: true
    },
    axisY: {
      // On the y-axis start means left and end means right
      showGrid: true,
      showLabel: true,
      labelInterpolationFnc: value => `${value / 1}%`
    },
    style: {
      backgroundColor: 'transparent',
    }
  };

  const plugins = [
    ChartistTooltip()
  ]

  return (
    <Chartist data={batteryData} options={{ ...options, plugins }} type="Line" className="ct-series-g ct-double-octave" />
  );
};

export const LoadChart = () => {

  const [loadData, setLoadData] = useState({
    labels: [],
    series: [[]]
  });

  const handleLoadData = useCallback((data) => {
    console.log(data);

    setLoadData((prevLoadData) => {
      const newLabels = [...prevLoadData.labels, new Date().toLocaleTimeString()];
      const newSeries = [...prevLoadData.series[0], data.load];

      if (newLabels.length > 50) {
        newLabels.shift();
        newSeries.shift();
      }

      return {
        labels: newLabels,
        series: [newSeries]
      };
    });
  }, []);


  useEffect(() => {
    socket.on('LoadUI', handleLoadData);
  }, [handleLoadData]);



  const options = {
    low: -300000,
    high: 300000,
    showArea: true,
    fullWidth: true,
    axisX: {
      position: 'end',
      showGrid: true
    },
    axisY: {
      // On the y-axis start means left and end means right
      showGrid: false,
      showLabel: true,
      labelInterpolationFnc: value => `${value / 1}`
    },
    style: {
      backgroundColor: 'transparent',
    }
  };

  const plugins = [
    ChartistTooltip()
  ]

  return (
    <Chartist data={loadData} options={{ ...options, plugins }} type="Line" className="ct-series-g ct-double-octave" />
  );
};

export const SalesValueChartphone = () => {
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    series: [[1, 2, 2, 3, 3, 4, 3]]
  };

  const options = {
    low: 0,
    showArea: true,
    fullWidth: false,
    axisX: {
      position: 'end',
      showGrid: true
    },
    axisY: {
      // On the y-axis start means left and end means right
      showGrid: false,
      showLabel: false,
      labelInterpolationFnc: value => `$${value / 1}k`
    }
  };

  const plugins = [
    ChartistTooltip()
  ]

  return (
    <Chartist data={data} options={{ ...options, plugins }} type="Line" className="ct-series-g ct-major-tenth" />
  );
};

export const CircleChart = (props) => {
  const { series = [], donutWidth = 20 } = props;
  const sum = (a, b) => a + b;

  const options = {
    low: 0,
    high: 8,
    donutWidth,
    donut: true,
    donutSolid: true,
    fullWidth: false,
    showLabel: false,
    labelInterpolationFnc: value => `${Math.round(value / series.reduce(sum) * 100)}%`,
  }

  const plugins = [
    ChartistTooltip()
  ]

  return (
    <Chartist data={{ series }} options={{ ...options, plugins }} type="Pie" className="ct-golden-section" />
  );
};

export const BarChart = (props) => {
  const { labels = [], series = [], chartClassName = "ct-golden-section" } = props;
  const data = { labels, series };

  const options = {
    low: 0,
    showArea: true,
    axisX: {
      position: 'end'
    },
    axisY: {
      showGrid: false,
      showLabel: false,
      offset: 0
    }
  };

  const plugins = [
    ChartistTooltip()
  ]

  return (
    <Chartist data={data} options={{ ...options, plugins }} type="Bar" className={chartClassName} />
  );
};
