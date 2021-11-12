/**
 * Macro for data evaluation on PhotosynQ.org
 * by: Gabriel Silva Pires
 * created: November 10, 2021 2:57 PM
 */

function save_Fluorescence(FmPrime, FoPrime, Fs, j) {  

  fvfm = (FmPrime - Fs) / FmPrime;
  FvP_FmP = (FmPrime - FoPrime) / FmPrime;
  qL = ((FmPrime - Fs) * FoPrime)/((FmPrime - FoPrime) * Fs);
  qP = (FmPrime - Fs) / (FmPrime - FoPrime);
  npqt = (4.88 / ((FmPrime / FoPrime) - 1)) - 1;
  PhiNO = 1 / (npqt + 1 + qL * 4.88); //based on equation 52 in Kramer et al., 2004 PRES
  PhiNPQ = 1 - fvfm - PhiNO; //based on equation 53 in Kramer et al., 2004 PRES
  
  if (fvfm <= -0.10 || fvfm >= 0.85) {
    danger("Phi2 is outside of expected range, please consider discarding the measurement" + j,output);
  }
  if (fvfm <= 0.75) {
	  danger("Phi2 is outside of expected range" + j,output);
  }
  if (PhiNPQ <= 0.10 || PhiNPQ >= 1.1) {
    danger("PhiNPQ is outside of expected range, please consider discarding the measurement" + j,output);
  }
  if (PhiNO <= -0.10 || PhiNO >= 1.1) {
	  danger("PhiNO is outside of expected range, please consider discarding the measurement" + j,output);
  }
  
  output["FoPrime_" + j] = MathROUND(FoPrime,2);
  output["FmPrime_" + j] = MathROUND(FmPrime,2);
  output["Fs_" + j] = MathROUND(Fs,2);
  output["Phi2_" + j] = MathROUND(fvfm,3);
  output["FvP_over_FmP_" + j] = MathROUND(FvP_FmP,3);
  output["qL_" + j] = MathROUND(qL,3);
  output["qP_" + j] = MathROUND(qP,3);
  output["NPQt_" + j] = MathROUND(npqt,3);
  output["PhiNO_" + j] = MathROUND(PhiNO,3);
  output["PhiNPQ_" + j] = MathROUND(PhiNPQ,3);

}

// Define the output object here
var output = {}; //dictionary to hold results

// Get data from each protocol
var PAM = GetProtocolByLabel("PAM", json);
var SPAD_1 = GetProtocolByLabel("SPAD_1", json);
var SPAD_2 = GetProtocolByLabel("SPAD_2", json);

for(j = 0; j<3; j++) {
  // PAM fluorescence traces
  //DEFINE THE STARTING AND ENDING POINTS TO USE FOR THE VARIOUS 
  //PARAMETERS USED IN THE CALCULATIONS

  var Fs_begin= 1; //the first point to use for Fs 
  var Fs_end = 4; //the end point to use  for Fs

  //The Fv/FM' results will be calculated using hte Avenson technique, wherein
  //a series of different saturation pulse intensities are used and the 
  //true saturation point is inferred by extrapolation to infinite
  //intensities.

  //The first FM value (Fm_1) is obtained with the highest intensity
  var Fm_1_begin = 101; //the first point to use for the FIRST Fmp
  var Fm_1_end = 130; //the end point to use  for the FIRST Fmp
  var Fm_2_begin = 131; //the first point to use for the FIRST Fmp
  var Fm_2_end = 145; //the end point to use  for the FIRST Fmp
  var Fm_3_begin = 146; //the first point to use for the FIRST Fmp
  var Fm_3_end = 160; //the end point to use  for the FIRST Fmp
  var Fm_4_begin = 161; //the first point to use for the FIRST Fmp
  var Fm_4_end = 175; //the end point to use  for the FIRST Fmp
  var Fm_5_begin = 176; //the first point to use for the FIRST Fmp
  var Fm_5_end = 190; //the end point to use  for the FIRST Fmp

  //START AND STOP FOR F0'
  var FoPrime_begin = 206; //the first point to use for Fo 
  var FoPrime_end = 220; //the end point to use  for Fo

  //SET THE INVERSE INTENSITIES FOR THE AVENSON INTENSITY RAMP
  var inverse_intensity = [1/8000,1/7000,1/6000,1/5000];

  // Display of PAM result and calculation of the fluorescence parameters
  //************************************************************************************************
  //Calculate the PAM fluorescence paramters
    
  data = PAM[j].data_raw;
    
  // Set our Apparent FmPrime, 3 FmPrime steps, and Fs to calculate both traditional fv/fm and new Multi-phase flash fv/fm
  //----------------------------

  //get the values for representative Fs 
  var baseline = 0; //for the time being, do not use baseline

  //GET THE VALUES FOR Fs
  var Fs = MathMEAN(data.slice(Fs_begin, Fs_end)) - baseline; // take only the first 4 values in the Fs range, excluding the very first
  var Fs_std = MathSTDEV(data.slice(Fs_begin, Fs_end)); // create standard deviation for this value for error checking
  //output.Fs = MathROUND(Fs, 2);

  //GET THE VALUES FOR THE 5 Fm' ILLUMINATION CONDITIONS

  var sat_vals = data.slice(Fm_1_begin,Fm_1_end).sort();  // sort the saturating light values from low to high
  var AFmP = MathMEAN(sat_vals.slice(2,20)) - baseline; // take the 18 largest values and average them
  var AFmP_std = MathSTDEV(sat_vals); // create standard deviation for this value for error checking
  //output.AFmP=AFmP;
    
  sat_vals = data.slice(Fm_5_begin,Fm_5_end).sort();  // sort the saturating light values from low to high
  var FmP_end = MathMEAN(sat_vals.slice(2,23)) - baseline; // take the 21 largest values and average them
  var FmP_end_std = MathSTDEV(sat_vals); // create standard deviation for this value for error checking
  //output.FmP_end=FmP_end;
    
  sat_vals = data.slice(Fm_2_begin,Fm_2_end).sort();  // sort the saturating light values from low to high
  var FmP_step1 = MathMEAN(sat_vals.slice(2,6)) - baseline; // take the 4 largest values and average them
  var FmP_step1_std = MathSTDEV(sat_vals); // create standard deviation for this value for error checking
  //output.FmP_step1=FmP_step1;

  sat_vals = data.slice(Fm_3_begin,Fm_3_end).sort();  // sort the saturating light values from low to high
  var FmP_step2 = MathMEAN(sat_vals.slice(2,6)) - baseline; // take the 4 largest values and average them
  var FmP_step2_std = MathSTDEV(sat_vals); // create standard deviation for this value for error checking
  //output.FmP_step2=FmP_step2;
    
  sat_vals = data.slice(Fm_4_begin,Fm_4_end).sort();  // sort the saturating light values from low to high
  var FmP_step3 = MathMEAN(sat_vals.slice(2,6)) - baseline; // take the 4 largest values and average them
  var FmP_step3_std = MathSTDEV(sat_vals); // create standard deviation for this value for error checking
  //output.FmP_ste3=FmP_step3;
    
  // Calculations for F0'
  // ----------------------------
  var FoPrime_values = data.slice(FoPrime_begin,FoPrime_end).sort();
    
  var FoPrime = MathMIN(FoPrime_values);
  var FoPrime_std = MathSTDEV(FoPrime_values); // create standard deviation for this value for error checking
  //output.FoPrime=MathROUND(FoPrime,2);

  //output.FoPrime_values = FoPrime_values;
    
  // Calculations for corrected FmPrime using multi-phase flash
  // ----------------------------
  var reg = MathLINREG(inverse_intensity, [AFmP,FmP_step1,FmP_step2,FmP_step3]);

  /****************OUTPUT VALUES FROM MACRO *******************/

  // if any of the flag conditions are true, then create the 'flag' object.  Otherwise, do not create the flag object.
  // for now since flag system isn't fully implemented, also create as separate objects so they will be displayed
  // ----------------------------

  // If multi-phase flash steps are flat or positive slope, then just use the normal Phi2, NPQt, PhiNPQ, PhiNO... etc.
  // If Phi2 or NPQt is less than zero, make zero and give user warning.  If Phi2 is higher than .85, give user danger flag.
  // ----------------------------

  // Calculate fvfm, Phi2, NPQt, PhiNPQ, PhiNO, qL w/ or w/out multi-phase flash
  // ----------------------------
  if (reg.m > 0) {
    save_Fluorescence(AFmP, FoPrime, Fs, j);
  }
  else {
    save_Fluorescence(reg.b, FoPrime, Fs, j);
  }

  // ----------------------------
  
  // Calculate Standard Deviation for Warning or Danger flags (out of bounds measurement)
  // ----------------------------
  if (Fs_std > 100) {
    danger("noisy Fs" + j, output);
  }
  if (AFmP_std > 300) {
    danger("noisy FmPrime" + j, output);
  }
  if (FmP_step1_std > 120 | FmP_step2_std > 120 | FmP_step3_std > 120 | FmP_end_std > 300) {
    danger("noisy  multi-phase flash steps" + j,output);
  }
  if (FoPrime_std > 150) {
    danger("noisy FoPrime" + j, output);
  }
  
  // Get enviroment data
  var light_intensity = (SPAD_1[j].light_intensity + SPAD_2[j].light_intensity)/2;
  var ambient_temperature = (SPAD_1[j].temperature + SPAD_2[j].temperature)/2;
  var ambient_RH = (SPAD_1[j].humidity + SPAD_2[j].humidity)/2;
  var ambient_pressure = (SPAD_1[j].pressure + SPAD_2[j].pressure)/2;
  var leaf_RH = (SPAD_1[j].humidity2 + SPAD_2[j].humidity2)/2;
  var leaf_temperature = (SPAD_1[j].contactless_temp + SPAD_2[j].contactless_temp)/2;
  var leaf_air_difference_temperature = leaf_temperature - ambient_temperature;
  
  output["LEF_" + j] = MathROUND((fvfm  * 0.45 * light_intensity),3);
  output["LEF_no_light_" + j] = MathROUND((fvfm  * 0.45),3);
  
  output["light_intensity_" + j] = light_intensity;
  output["ambient_temperature_" + j] = ambient_temperature;
  output["ambient_RH_" + j] = ambient_RH;
  output["ambient_pressure_" + j] = ambient_pressure;
  output["leaf_RH_" + j] = leaf_RH;
  output["leaf_temperature_" + j] = leaf_temperature;
  output["leaf_air_difference_temperature_" + j] = leaf_air_difference_temperature;
  output["leaf_thickness_" + j] = (SPAD_1[j].thickness + SPAD_2[j].thickness)/2;
  output["spad_" + j] = (SPAD_1[j].spad[0] + SPAD_2[j].spad[0])/2;

  output["PAM_raw_data_" + j] = data;
}
return output;