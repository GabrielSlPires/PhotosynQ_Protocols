# PhotosynQ_Protocols

I've developed three protocols so far. And their descriptions are written below.

### GSP - Basic Fluorescence

Measures photosynthesis-related parameters in <5 seconds.

- Chlorophyll Fluorescence: F0, Fm, Fs, Phi2, Fv/Fm, qL, qP, NPQ, PhiNO, PhiNPQ, LEF
- Relative Chlorophyll
- Leaf Thickness (in mm)
- Leaf Temperature and differential from ambient temperature
- Environmental conditions: PAR and ambient temperature/pressure/humidity

### GSP - Basic Fluorescence - 3 Leafs

Measure 3 leaves in sequence, with two measurements per leaf.

The first measurement of the leaf is the same on GSP - Basic Fluorescence. The second is only a SPAD measure to calculate de mean with the first measurement.

### GSP - SPAD - 3 Leafs

Measure 3 leaves in sequence, with two SPAD measurements per leaf and returns each leaf mean.
