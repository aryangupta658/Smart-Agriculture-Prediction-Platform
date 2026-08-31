import { useCallback, useEffect, useState } from "react";

import {
  Activity,
  CloudRain,
  Droplets,
  FlaskConical,
  Loader2,
  MapPin,
  RefreshCcw,
  Thermometer,
  Wifi,
  WifiOff,
  Wind,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import API from "../api/api";

// =====================================================
// FORMAT TIME
// =====================================================

function formatTime(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

// =====================================================
// SENSOR CARD
// =====================================================

function SensorCard({ title, value, unit, icon, description }) {
  const available = value !== null && value !== undefined;

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-agriGreen">
          {icon}
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            available
              ? "bg-green-50 text-green-700"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {available ? "Available" : "Unavailable"}
        </span>
      </div>

      <p className="text-sm font-bold text-slate-500">{title}</p>

      <div className="mt-2 flex items-end gap-2">
        <p className="text-3xl font-black text-slate-950">
          {available ? Number(value).toFixed(1) : "—"}
        </p>

        {available && (
          <span className="mb-1 text-sm font-bold text-slate-500">{unit}</span>
        )}
      </div>

      <p className="mt-3 text-xs leading-5 text-slate-500">{description}</p>
    </div>
  );
}

// =====================================================
// GENERATE EMPTY GRAPH AXIS POINTS
// =====================================================
//
// These are NOT sensor readings.
//
// They only provide timestamps for the X-axis so the
// graph still looks like a graph before ESP32 readings
// arrive.
//
// The sensor value remains null.
// =====================================================

function createEmptyGraphData() {
  const now = Date.now();

  const points = [];

  for (let index = 9; index >= 0; index--) {
    const time = new Date(now - index * 30 * 1000);

    points.push({
      time: time.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),

      value: null,
    });
  }

  return points;
}

// =====================================================
// SENSOR GRAPH
// =====================================================

function SensorGraph({ title, data, dataKey, unit, minimum, maximum }) {
  // Keep only real sensor values.

  const usefulData = data.filter(
    (item) => item[dataKey] !== null && item[dataKey] !== undefined,
  );

  const hasData = usefulData.length > 0;

  // Real data when available.
  //
  // Empty timestamp points only when there
  // are no readings.

  const graphData = hasData ? usefulData : createEmptyGraphData();

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      {/* HEADER */}

      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-slate-900">{title}</h3>

          <p className="mt-1 text-xs text-slate-500">Recent ESP32 readings</p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            hasData
              ? "bg-green-50 text-green-700"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {hasData ? "Live Data" : "Waiting"}
        </span>
      </div>

      {/* GRAPH */}

      <div className="relative h-72 w-full rounded-2xl bg-slate-50/60 p-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={graphData}
            margin={{
              top: 15,
              right: 20,
              left: 0,
              bottom: 5,
            }}
          >
            {/* GRID */}

            <CartesianGrid strokeDasharray="4 4" vertical={true} />

            {/* X AXIS */}

            <XAxis
              dataKey="time"
              tick={{
                fontSize: 10,
              }}
              minTickGap={25}
            />

            {/* Y AXIS */}

            <YAxis
              domain={[minimum, maximum]}
              tick={{
                fontSize: 10,
              }}
              unit={unit}
            />

            {/* TOOLTIP */}

            {hasData && (
              <Tooltip
                formatter={(value) => [
                  `${Number(value).toFixed(2)} ${unit}`,
                  title,
                ]}
              />
            )}

            {/* REAL SENSOR LINE ONLY */}

            {hasData && (
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke="currentColor"
                strokeWidth={3}
                dot={{
                  r: 3,
                }}
                activeDot={{
                  r: 5,
                }}
                className="text-agriGreen"
                connectNulls={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>

        {/* =================================================
            EMPTY GRAPH MESSAGE
        ================================================= */}

        {!hasData && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="rounded-2xl border border-slate-200 bg-white/90 px-6 py-4 text-center shadow-sm backdrop-blur">
              <Activity size={27} className="mx-auto mb-2 text-slate-300" />

              <p className="text-sm font-black text-slate-600">
                Waiting for sensor data
              </p>

              <p className="mt-1 max-w-[210px] text-xs leading-5 text-slate-400">
                The graph will update automatically when ESP32 readings are
                received.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}

      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        <span>
          {hasData
            ? `${usefulData.length} reading${
                usefulData.length !== 1 ? "s" : ""
              }`
            : "0 readings"}
        </span>

        <span>Auto refresh enabled</span>
      </div>
    </div>
  );
}

// =====================================================
// PAGE
// =====================================================

function SensorReadings() {
  // =====================================================
  // SENSOR STATE
  // =====================================================

  const [latest, setLatest] = useState(null);

  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =====================================================
  // HISTORICAL RAINFALL STATE
  // =====================================================

  const [city, setCity] = useState("Gorakhpur");

  const [state, setState] = useState("Uttar Pradesh");

  const [rainfallDays, setRainfallDays] = useState(30);

  const [rainfall, setRainfall] = useState(null);

  const [rainfallLoading, setRainfallLoading] = useState(false);

  const [rainfallError, setRainfallError] = useState("");

  // =====================================================
  // LOAD SENSOR DATA
  // =====================================================

  const loadSensorData = useCallback(async (showLoader = false) => {
    if (showLoader) {
      setLoading(true);
    }

    try {
      const [latestResponse, historyResponse] = await Promise.all([
        API.get("/iot/latest"),

        API.get("/iot/history?limit=100"),
      ]);

      const latestData = latestResponse.data;

      setLatest(latestData.available ? latestData : null);

      const readings = historyResponse.data?.readings || [];

      setHistory(
        readings.map((item) => ({
          ...item,

          time: formatTime(item.received_at),
        })),
      );

      setError("");
    } catch (error) {
      console.error("Sensor dashboard error:", error);

      setError("Unable to load sensor readings from FastAPI.");
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  }, []);

  // =====================================================
  // INITIAL SENSOR LOAD
  //
  // Auto refresh every 5 seconds.
  // =====================================================

  useEffect(() => {
    loadSensorData(true);

    const interval = setInterval(() => {
      loadSensorData(false);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [loadSensorData]);

  // =====================================================
  // LOAD HISTORICAL RAINFALL
  // =====================================================

  const loadHistoricalRainfall = async () => {
    const cleanCity = city.trim();

    const cleanState = state.trim();

    if (!cleanCity || !cleanState) {
      setRainfallError("Please enter both city and state.");

      return;
    }

    setRainfallLoading(true);

    setRainfallError("");

    setRainfall(null);

    try {
      const response = await API.get("/weather/rainfall/history", {
        params: {
          city: cleanCity,

          state: cleanState,

          days: rainfallDays,
        },
      });

      setRainfall(response.data);
    } catch (error) {
      console.error("Historical rainfall error:", error);

      setRainfallError(
        error.response?.data?.detail || "Unable to load historical rainfall.",
      );
    } finally {
      setRainfallLoading(false);
    }
  };

  return (
    <main className="relative overflow-hidden px-5 py-12 lg:px-8">
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="absolute -left-20 top-40 h-96 w-96 rounded-full bg-green-100 blur-3xl" />

      <div className="absolute right-0 top-10 h-96 w-96 rounded-full bg-sky-100 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-agriGreen">
                <Activity size={30} />
              </div>

              <div>
                <h1 className="text-3xl font-black text-slate-950 sm:text-4xl">
                  Sensor Readings
                </h1>

                <p className="mt-1 text-slate-600">
                  Live environmental and soil readings from your ESP32.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => loadSensorData(true)}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-agriGreen px-5 py-3 text-sm font-bold text-white shadow-lg shadow-green-200 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <RefreshCcw size={18} />
            )}
            Refresh
          </button>
        </div>

        {/* =================================================
            DEVICE STATUS
        ================================================= */}

        <div className="mb-8 rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full ${
                  latest
                    ? "bg-green-100 text-agriGreen"
                    : "bg-red-50 text-red-500"
                }`}
              >
                {latest ? <Wifi size={23} /> : <WifiOff size={23} />}
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                  ESP32 Status
                </p>

                <h2
                  className={`text-xl font-black ${
                    latest ? "text-green-700" : "text-red-600"
                  }`}
                >
                  {latest ? "Receiving Data" : "No Sensor Data"}
                </h2>
              </div>
            </div>

            {latest && (
              <div className="text-right">
                <p className="text-xs text-slate-400">Device</p>

                <p className="font-bold text-slate-800">{latest.device_id}</p>
              </div>
            )}
          </div>
        </div>

        {/* =================================================
            SENSOR ERROR
        ================================================= */}

        {error && (
          <div className="mb-8 rounded-2xl bg-red-50 px-5 py-4 text-sm font-bold text-red-700">
            {error}
          </div>
        )}

        {/* =================================================
            SENSOR CARDS
        ================================================= */}

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <SensorCard
            title="Temperature"
            value={latest?.temperature}
            unit="°C"
            icon={<Thermometer size={25} />}
            description="Air temperature measured by the DHT sensor."
          />

          <SensorCard
            title="Humidity"
            value={latest?.humidity}
            unit="%"
            icon={<Wind size={25} />}
            description="Relative humidity of the surrounding air."
          />

          <SensorCard
            title="Soil Moisture"
            value={latest?.soil_moisture}
            unit="%"
            icon={<Droplets size={25} />}
            description="Estimated soil moisture from the connected moisture sensor."
          />

          <SensorCard
            title="Soil pH"
            value={latest?.ph}
            unit="pH"
            icon={<FlaskConical size={25} />}
            description="Soil acidity or alkalinity when a pH sensor is connected."
          />
        </div>

        {/* =================================================
            SENSOR HISTORY
        ================================================= */}

        <section className="mt-10">
          <div className="mb-6">
            <p className="text-sm font-black uppercase tracking-widest text-agriGreen">
              Sensor History
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-950">
              Recent Sensor Trends
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Graphs update automatically as new ESP32 readings are received.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* TEMPERATURE */}

            <SensorGraph
              title="Temperature"
              data={history}
              dataKey="temperature"
              unit="°C"
              minimum={0}
              maximum={50}
            />

            {/* HUMIDITY */}

            <SensorGraph
              title="Humidity"
              data={history}
              dataKey="humidity"
              unit="%"
              minimum={0}
              maximum={100}
            />

            {/* MOISTURE */}

            <SensorGraph
              title="Soil Moisture"
              data={history}
              dataKey="soil_moisture"
              unit="%"
              minimum={0}
              maximum={100}
            />

            {/* PH */}

            <SensorGraph
              title="Soil pH"
              data={history}
              dataKey="ph"
              unit=""
              minimum={0}
              maximum={14}
            />
          </div>
        </section>

        {/* =================================================
            HISTORICAL RAINFALL
        ================================================= */}

        <section className="mt-12 rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50 to-white p-7 shadow-sm">
          {/* HEADER */}

          <div className="mb-7">
            <div className="mb-2 flex items-center gap-2 text-sky-700">
              <CloudRain size={23} />

              <p className="font-black">Historical Rainfall</p>
            </div>

            <h2 className="text-2xl font-black text-slate-950">
              Rainfall History by Location
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Enter an Indian city and state to view historical rainfall data
              for the selected time period.
            </p>
          </div>

          {/* =================================================
              SEARCH
          ================================================= */}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_220px_auto]">
            {/* CITY */}

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                City
              </label>

              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Gorakhpur"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                />
              </div>
            </div>

            {/* STATE */}

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                State
              </label>

              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Uttar Pradesh"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              />
            </div>

            {/* PERIOD */}

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Period
              </label>

              <select
                value={rainfallDays}
                onChange={(e) => setRainfallDays(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              >
                <option value={7}>Last 7 Days</option>

                <option value={30}>Last 30 Days</option>

                <option value={90}>Last 90 Days</option>

                <option value={365}>Last 1 Year</option>
              </select>
            </div>

            {/* BUTTON */}

            <div className="flex items-end">
              <button
                type="button"
                onClick={loadHistoricalRainfall}
                disabled={rainfallLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {rainfallLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <CloudRain size={18} />
                )}
                View Rainfall
              </button>
            </div>
          </div>

          {/* =================================================
              RAINFALL ERROR
          ================================================= */}

          {rainfallError && (
            <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
              {rainfallError}
            </div>
          )}

          {/* =================================================
              RAINFALL RESULT
          ================================================= */}

          {rainfall && (
            <div className="mt-8">
              {/* LOCATION */}

              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                    <MapPin size={21} />
                  </div>

                  <div>
                    <h3 className="font-black text-slate-900">
                      {rainfall.location.name}

                      {rainfall.location.state
                        ? `, ${rainfall.location.state}`
                        : ""}
                    </h3>

                    <p className="text-xs text-slate-500">
                      {rainfall.location.district
                        ? `${rainfall.location.district}, `
                        : ""}

                      {rainfall.location.country || "India"}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-white px-4 py-2 text-right shadow-sm">
                  <p className="text-xs font-bold text-slate-400">Period</p>

                  <p className="text-sm font-black text-slate-800">
                    {rainfall.period.days} Days
                  </p>
                </div>
              </div>

              {/* =================================================
                  SUMMARY
              ================================================= */}

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {/* TOTAL */}

                <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Total Rainfall
                  </p>

                  <p className="mt-2 text-3xl font-black text-sky-700">
                    {rainfall.summary.total_precipitation_mm}

                    <span className="ml-1 text-sm font-bold text-slate-500">
                      mm
                    </span>
                  </p>
                </div>

                {/* RAINY DAYS */}

                <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Rainy Days
                  </p>

                  <p className="mt-2 text-3xl font-black text-slate-900">
                    {rainfall.summary.rainy_days}
                  </p>
                </div>

                {/* AVERAGE */}

                <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Daily Average
                  </p>

                  <p className="mt-2 text-3xl font-black text-slate-900">
                    {rainfall.summary.average_daily_mm}

                    <span className="ml-1 text-sm font-bold text-slate-500">
                      mm
                    </span>
                  </p>
                </div>

                {/* MAX */}

                <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Highest Daily Rainfall
                  </p>

                  <p className="mt-2 text-3xl font-black text-slate-900">
                    {rainfall.summary.maximum_daily_mm}

                    <span className="ml-1 text-sm font-bold text-slate-500">
                      mm
                    </span>
                  </p>
                </div>
              </div>

              {/* =================================================
                  RAINFALL GRAPH
              ================================================= */}

              <div className="mt-6 rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
                <div className="mb-6">
                  <h3 className="text-lg font-black text-slate-900">
                    Historical Rainfall
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {rainfall.period.start_date}

                    {" → "}

                    {rainfall.period.end_date}
                  </p>
                </div>

                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={rainfall.history}>
                      <CartesianGrid strokeDasharray="3 3" />

                      <XAxis
                        dataKey="date"
                        tick={{
                          fontSize: 10,
                        }}
                        minTickGap={20}
                      />

                      <YAxis
                        unit=" mm"
                        tick={{
                          fontSize: 11,
                        }}
                      />

                      <Tooltip
                        formatter={(value) => [
                          `${Number(value ?? 0).toFixed(2)} mm`,
                          "Rainfall",
                        ]}
                      />

                      <Bar
                        dataKey="precipitation_mm"
                        fill="currentColor"
                        className="text-sky-600"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* NOTE */}

              <div className="mt-5 rounded-xl border border-sky-100 bg-white/70 p-4">
                <p className="text-xs leading-5 text-slate-500">
                  Historical rainfall is derived from weather reanalysis data
                  for the selected location. It is not a direct rain-gauge
                  measurement from the farm and remains separate from the
                  rainfall input used by the crop prediction model.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default SensorReadings;
