/**
 * Macro for data evaluation on PhotosynQ.org
 * by: Gabriel Silva Pires
 * created: November 10, 2021 2:57 PM
 */

// Define the output object here
var output = {}; //dictionary to hold results

// Get data from each protocol
var SPAD_1 = GetProtocolByLabel("SPAD_1", json);
var SPAD_2 = GetProtocolByLabel("SPAD_2", json);

for(j = 0; j<3; j++) {
  
  // Get enviroment data
  var light_intensity = (SPAD_1[j].light_intensity + SPAD_2[j].light_intensity)/2;
  var ambient_temperature = (SPAD_1[j].temperature + SPAD_2[j].temperature)/2;
  var ambient_RH = (SPAD_1[j].humidity + SPAD_2[j].humidity)/2;
  var ambient_pressure = (SPAD_1[j].pressure + SPAD_2[j].pressure)/2;
  var leaf_RH = (SPAD_1[j].humidity2 + SPAD_2[j].humidity2)/2;
  var leaf_temperature = (SPAD_1[j].contactless_temp + SPAD_2[j].contactless_temp)/2;
  var leaf_air_difference_temperature = leaf_temperature - ambient_temperature;

  output["light_intensity_" + j] = light_intensity;
  output["ambient_temperature_" + j] = ambient_temperature;
  output["ambient_RH_" + j] = ambient_RH;
  output["ambient_pressure_" + j] = ambient_pressure;
  output["leaf_RH_" + j] = leaf_RH;
  output["leaf_temperature_" + j] = leaf_temperature;
  output["leaf_air_difference_temperature_" + j] = leaf_air_difference_temperature;
  output["leaf_thickness_" + j] = (SPAD_1[j].thickness + SPAD_2[j].thickness)/2;
  output["spad_" + j] = (SPAD_1[j].spad[0] + SPAD_2[j].spad[0])/2;

}
return output;