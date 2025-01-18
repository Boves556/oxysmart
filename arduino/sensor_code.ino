#include <Wire.h>
#include <MPU6050.h>

MPU6050 mpu;

int steps = 0; // Step counter
float calories = 0; // Calories burned
const float calories_per_step = 0.04; // Example conversion factor
bool stepDetected = false;

void setup() {
  Serial.begin(9600);
  Wire.begin();

  // Initialize the MPU6050
  mpu.initialize();
  if (!mpu.testConnection()) {
    Serial.println("MPU6050 connection failed!");
    while (1);
  }
  Serial.println("MPU6050 initialized successfully.");
}

void loop() {
  int16_t ax, ay, az;
  mpu.getAcceleration(&ax, &ay, &az);

  // Convert raw acceleration values to g (gravitational force)
  float accelX = ax / 16384.0;
  float accelY = ay / 16384.0;
  float accelZ = az / 16384.0;

  // Calculate acceleration magnitude
  float accelerationMagnitude = sqrt(accelX * accelX + accelY * accelY + accelZ * accelZ);

  // Detect steps
  if (accelerationMagnitude > 1.2 && !stepDetected) {
    steps++;
    calories += calories_per_step;
    stepDetected = true;
    Serial.print(steps);
    Serial.print(",");
    Serial.println(calories);
  } else if (accelerationMagnitude < 1.0) {
    stepDetected = false;
  }

  delay(100); // Adjust delay as needed
}