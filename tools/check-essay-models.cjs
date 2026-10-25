const assert=require("node:assert/strict");
const {evidence,deployment}=require("../assets/essay-models.js");
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-8, a+" != "+b);
// Identical and independent errors are the two interpretable endpoints.
for(const n of [1,2,10,20]) {
 close(evidence(n,0).effective,n);
 close(evidence(n,1).effective,1);
 close(evidence(n,1).actualError,1);
}
close(evidence(10,.6).actualError,.8);
close(evidence(10,.6).effective,1.5625);
assert.ok(evidence(20,.9).effective<1.11);
assert.throws(()=>evidence(10,-.1),RangeError);
// Adding the non-binding input must not create compute capacity.
const power=deployment(200000,100,200,.7);
assert.deepEqual(power.binding,["power"]);
close(power.operating,deployment(400000,100,200,.7).operating);
close(power.facilityMW,100);
assert.deepEqual(deployment(200000,300,60,.7).binding,["cooling"]);
assert.deepEqual(deployment(60000,300,200,.7).binding,["chips"]);
close(deployment(100000,87.5,70,1).operating,100000);
assert.deepEqual(deployment(100000,87.5,70,1).binding,["chips","power","cooling"]);
close(deployment(100000,87.5,70,.5).usefulHours,1200000);
close(deployment(100000,87.5,70,0).usefulHours,0);
assert.throws(()=>deployment(100000,100,100,1.1),RangeError);
console.log("Evidence endpoints, correlation example, capacity bottlenecks, units, ties, and utilization checks passed.");
