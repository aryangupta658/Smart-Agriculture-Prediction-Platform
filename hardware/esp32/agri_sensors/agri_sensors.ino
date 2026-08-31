#include <Arduino.h>
#include <DHT.h>

// =====================================================
// PIN CONNECTIONS
// =====================================================

// DHT11
#define DHT_PIN 4
#define DHT_TYPE DHT11

// Soil moisture sensor analog output
#define SOIL_SENSOR_PIN 34

// L298N motor driver
#define MOTOR_IN1 26
#define MOTOR_IN2 27

// =====================================================
// SOIL SENSOR CALIBRATION
// Replace these after testing your own sensor.
// =====================================================

// Example raw value when soil is very dry
int dryValue = 3200;

// Example raw value when soil is wet but drained
int wetValue = 1400;

// =====================================================
// IRRIGATION THRESHOLDS
// These are initial testing values, not final agronomic values.
// =====================================================

// Pump starts at or below this percentage
const float PUMP_ON_MOISTURE = 35.0;

// Pump stops at or above this percentage
const float PUMP_OFF_MOISTURE = 55.0;

// Maximum continuous pump running time
const unsigned long MAX_PUMP_TIME = 10000;  // 10 seconds

// Time between sensor readings
const unsigned long SENSOR_INTERVAL = 2000; // 2 seconds

// =====================================================
// OBJECTS AND VARIABLES
// =====================================================

DHT dht(DHT_PIN, DHT_TYPE);

bool automaticMode = false;
bool pumpRunning = false;

unsigned long pumpStartedAt = 0;
unsigned long previousSensorTime = 0;


// =====================================================
// PUMP CONTROL FUNCTIONS
// =====================================================

void turnPumpOn() {
  if (!pumpRunning) {
    digitalWrite(MOTOR_IN1, HIGH);
    digitalWrite(MOTOR_IN2, LOW);

    pumpRunning = true;
    pumpStartedAt = millis();

    Serial.println("================================");
    Serial.println("PUMP STATUS: ON");
    Serial.println("================================");
  }
}


void turnPumpOff() {
  digitalWrite(MOTOR_IN1, LOW);
  digitalWrite(MOTOR_IN2, LOW);

  if (pumpRunning) {
    Serial.println("================================");
    Serial.println("PUMP STATUS: OFF");
    Serial.println("================================");
  }

  pumpRunning = false;
}


// =====================================================
// READ AVERAGE SOIL SENSOR VALUE
// =====================================================

int readAverageSoilRaw() {
  const int numberOfSamples = 10;
  long total = 0;

  for (int i = 0; i < numberOfSamples; i++) {
    total += analogRead(SOIL_SENSOR_PIN);
    delay(20);
  }

  return total / numberOfSamples;
}


// =====================================================
// CONVERT RAW READING TO MOISTURE PERCENTAGE
// =====================================================

float calculateMoisturePercentage(int rawValue) {
  float moisturePercentage;

  moisturePercentage =
      ((float)(dryValue - rawValue) * 100.0) /
      ((float)(dryValue - wetValue));

  // Keep result between 0 and 100
  moisturePercentage = constrain(moisturePercentage, 0.0, 100.0);

  return moisturePercentage;
}


// =====================================================
// AUTOMATIC IRRIGATION DECISION
// =====================================================

void automaticPumpControl(float soilMoisture) {

  // Dry soil: start pump
  if (soilMoisture <= PUMP_ON_MOISTURE && !pumpRunning) {
    Serial.println("Decision: Soil is dry.");
    Serial.println("Irrigation needed = 1");
    turnPumpOn();
  }

  // Adequately moist soil: stop pump
  else if (soilMoisture >= PUMP_OFF_MOISTURE && pumpRunning) {
    Serial.println("Decision: Soil has sufficient moisture.");
    Serial.println("Irrigation needed = 0");
    turnPumpOff();
  }

  // Between ON and OFF limits:
  // retain the current pump state.
}


// =====================================================
// SAFETY CHECK
// =====================================================

void checkPumpSafety() {
  if (pumpRunning &&
      millis() - pumpStartedAt >= MAX_PUMP_TIME) {

    Serial.println("SAFETY: Maximum pump time reached.");
    turnPumpOff();

    // Exit automatic mode so the pump does not restart immediately
    automaticMode = false;

    Serial.println("Automatic mode disabled.");
    Serial.println("Check the soil before enabling it again.");
  }
}


// =====================================================
// SERIAL MONITOR COMMANDS
// =====================================================

void handleSerialCommands() {
  if (Serial.available() == 0) {
    return;
  }

  char command = Serial.read();

  // Ignore newline characters
  if (command == '\n' || command == '\r') {
    return;
  }

  switch (command) {

    case '1':
      automaticMode = false;
      Serial.println("Manual command: Pump ON");
      turnPumpOn();
      break;

    case '0':
      automaticMode = false;
      Serial.println("Manual command: Pump OFF");
      turnPumpOff();
      break;

    case 'A':
    case 'a':
      automaticMode = true;
      turnPumpOff();
      Serial.println("Automatic irrigation mode ENABLED");
      break;

    case 'M':
    case 'm':
      automaticMode = false;
      turnPumpOff();
      Serial.println("Manual mode ENABLED");
      break;

    case 'S':
    case 's':
      Serial.println();
      Serial.println("Available commands:");
      Serial.println("1 = Manually turn pump ON");
      Serial.println("0 = Manually turn pump OFF");
      Serial.println("A = Enable automatic mode");
      Serial.println("M = Enable manual mode");
      Serial.println("S = Show command list");
      Serial.println();
      break;

    default:
      Serial.println("Unknown command. Enter S for help.");
      break;
  }
}


// =====================================================
// SETUP
// =====================================================

void setup() {
  Serial.begin(115200);

  dht.begin();

  pinMode(SOIL_SENSOR_PIN, INPUT);

  pinMode(MOTOR_IN1, OUTPUT);
  pinMode(MOTOR_IN2, OUTPUT);

  // Pump must remain OFF during startup
  digitalWrite(MOTOR_IN1, LOW);
  digitalWrite(MOTOR_IN2, LOW);

  analogReadResolution(12);

  delay(2000);

  Serial.println();
  Serial.println("========================================");
  Serial.println("ESP32 SMART IRRIGATION TEST");
  Serial.println("Mungbean setup");
  Serial.println("========================================");

  Serial.println("Connections:");
  Serial.println("DHT11 DATA   -> GPIO 4");
  Serial.println("Soil AO      -> GPIO 34");
  Serial.println("L298N IN1    -> GPIO 26");
  Serial.println("L298N IN2    -> GPIO 27");

  Serial.println();
  Serial.println("Commands:");
  Serial.println("1 = Pump ON");
  Serial.println("0 = Pump OFF");
  Serial.println("A = Automatic mode");
  Serial.println("M = Manual mode");
  Serial.println("S = Show commands");

  Serial.println();
  Serial.println("Starting in MANUAL mode for safety.");
  Serial.println("Pump is OFF.");
  Serial.println("========================================");
}


// =====================================================
// MAIN LOOP
// =====================================================

void loop() {
  handleSerialCommands();
  checkPumpSafety();

  unsigned long currentTime = millis();

  if (currentTime - previousSensorTime >= SENSOR_INTERVAL) {
    previousSensorTime = currentTime;

    // Read soil sensor
    int soilRaw = readAverageSoilRaw();

    float soilMoisture =
        calculateMoisturePercentage(soilRaw);

    // Read DHT11
    float humidity = dht.readHumidity();
    float temperature = dht.readTemperature();

    Serial.println();
    Serial.println("----------------------------------------");

    Serial.print("Soil raw value: ");
    Serial.println(soilRaw);

    Serial.print("Soil moisture: ");
    Serial.print(soilMoisture, 1);
    Serial.println(" %");

    if (isnan(temperature) || isnan(humidity)) {
      Serial.println("DHT11 reading failed!");
    } else {
      Serial.print("Temperature: ");
      Serial.print(temperature, 1);
      Serial.println(" °C");

      Serial.print("Humidity: ");
      Serial.print(humidity, 1);
      Serial.println(" %");
    }

    Serial.print("Mode: ");
    Serial.println(automaticMode ? "AUTOMATIC" : "MANUAL");

    Serial.print("Pump: ");
    Serial.println(pumpRunning ? "ON" : "OFF");

    // Run automatic decision only when automatic mode is enabled
    if (automaticMode) {
      automaticPumpControl(soilMoisture);
    }

    Serial.println("----------------------------------------");
  }
}