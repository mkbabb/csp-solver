### fps mean / long>50ms / worst ms

| scenario | m3-bat-head-r1 | m3-bat-head-r2 | m3-bat-head-r3 | m3-bat-base-r1 | m3-bat-base-r2 | m3-bat-base-r3 |
| --- | --- | --- | --- | --- | --- | --- |
| idle3s | 60.34 / 0 / 21 | 58.78 / 0 / 40 | 59.25 / 0 / 39 | 59.92 / 0 / 41 | 58.84 / 0 / 39 | 58.06 / 0 / 40 |
| deal | 60.28 / 0 / 24 | 59.63 / 0 / 23 | 59.12 / 0 / 25 | 60.19 / 0 / 24 | 60.23 / 0 / 24 | 60.19 / 0 / 23 |
| solveCelebration | 59.35 / 0 / 48 | 58.15 / 1 / 54 | 57.84 / 0 / 43 | 58.9 / 1 / 68 | 58.59 / 1 / 58 | 57.36 / 0 / 41 |
| galleryGlide | 50.51 / 3 / 242 | 51.22 / 3 / 259 | 49.57 / 4 / 258 | 50.83 / 3 / 258 | 50.49 / 3 / 253 | 50.47 / 3 / 261 |
| themeToggle | 53.41 / 2 / 138 | 52.99 / 2 / 138 | 53.81 / 2 / 140 | 53.43 / 2 / 132 | 53.45 / 2 / 125 | 52.61 / 2 / 137 |

### detail (frames · wall · p50 · p95 · long>33 · jank ms)

**m3-bat-head-r1**

| scenario | fps | frames | wall ms | p50 | p95 | >33 | >50 | worst | jank ms | note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| idle3s | 60.34 | 182 | 3016 | 17 | 18 | 0 | 0 | 21 | 0 | ~59Hz; anims running 0 |
| deal | 60.28 | 107 | 1775 | 17 | 20 | 0 | 0 | 24 | 0 |  |
| solveCelebration | 59.35 | 238 | 4010 | 17 | 24 | 2 | 0 | 48 | 0 |  |
| galleryGlide | 50.51 | 125 | 2475 | 17 | 29 | 5 | 3 | 242 | 371 |  |
| themeToggle | 53.41 | 134 | 2509 | 17 | 25 | 3 | 2 | 138 | 254 |  |

worst-3 frames per scenario (ms @ offset ms):
- idle3s: 21@854, 21@1354, 21@1854
- deal: 24@1083, 22@32, 22@697
- solveCelebration: 48@3075, 43@70, 31@3308
- galleryGlide: 242@903, 72@307, 57@1422
- themeToggle: 138@175, 116@939, 35@1211

engine: Mozilla/5.0 (iPhone; CPU iPhone OS 19_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/19.0 Mobile/15E148 Safari/604.1
vendor=Apple Computer, Inc. dpr=3 viewport=393x699 screen=393x852 hc=8 touch=5 coarse=true prm=false dark=false themePinned=dark htmlDark=true ablated=false
census: nodes=1092 filtered=17 (html 0) willChange=39 transitionAll+dur=1 poses={"boilPose":20,"restPose":8,"dtPose":4} anims={"supported":true,"total":3,"running":0,"paused":0,"finished":3,"idle":0}

**m3-bat-head-r2**

| scenario | fps | frames | wall ms | p50 | p95 | >33 | >50 | worst | jank ms | note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| idle3s | 58.78 | 177 | 3011 | 17 | 21 | 4 | 0 | 40 | 0 | ~59Hz; anims running 0 |
| deal | 59.63 | 105 | 1761 | 17 | 22 | 0 | 0 | 23 | 0 |  |
| solveCelebration | 58.15 | 233 | 4007 | 17 | 26 | 4 | 1 | 54 | 54 |  |
| galleryGlide | 51.22 | 126 | 2460 | 17 | 28 | 4 | 3 | 259 | 386 |  |
| themeToggle | 52.99 | 133 | 2510 | 17 | 28 | 2 | 2 | 138 | 258 |  |

worst-3 frames per scenario (ms @ offset ms):
- idle3s: 40@867, 37@1864, 35@2362
- deal: 23@454, 23@1199, 22@321
- solveCelebration: 54@74, 40@3447, 39@1080
- galleryGlide: 259@919, 69@304, 58@1420
- themeToggle: 138@173, 120@946, 33@826

engine: Mozilla/5.0 (iPhone; CPU iPhone OS 19_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/19.0 Mobile/15E148 Safari/604.1
vendor=Apple Computer, Inc. dpr=3 viewport=393x699 screen=393x852 hc=8 touch=5 coarse=true prm=false dark=false themePinned=dark htmlDark=true ablated=false
census: nodes=1092 filtered=17 (html 0) willChange=39 transitionAll+dur=1 poses={"boilPose":20,"restPose":8,"dtPose":4} anims={"supported":true,"total":3,"running":0,"paused":0,"finished":3,"idle":0}

**m3-bat-head-r3**

| scenario | fps | frames | wall ms | p50 | p95 | >33 | >50 | worst | jank ms | note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| idle3s | 59.25 | 178 | 3004 | 17 | 28 | 4 | 0 | 39 | 0 | ~59Hz; anims running 0 |
| deal | 59.12 | 105 | 1776 | 17 | 22 | 0 | 0 | 25 | 0 |  |
| solveCelebration | 57.84 | 232 | 4011 | 17 | 25 | 6 | 0 | 43 | 0 |  |
| galleryGlide | 49.57 | 122 | 2461 | 17 | 31 | 5 | 4 | 258 | 448 |  |
| themeToggle | 53.81 | 135 | 2509 | 17 | 23 | 3 | 2 | 140 | 256 |  |

worst-3 frames per scenario (ms @ offset ms):
- idle3s: 39@860, 35@355, 35@2355
- deal: 25@1701, 24@46, 24@454
- solveCelebration: 43@3070, 42@61, 39@3566
- galleryGlide: 258@920, 76@311, 60@1424
- themeToggle: 140@180, 116@945, 36@829

engine: Mozilla/5.0 (iPhone; CPU iPhone OS 19_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/19.0 Mobile/15E148 Safari/604.1
vendor=Apple Computer, Inc. dpr=3 viewport=393x699 screen=393x852 hc=8 touch=5 coarse=true prm=false dark=false themePinned=dark htmlDark=true ablated=false
census: nodes=1092 filtered=17 (html 0) willChange=39 transitionAll+dur=1 poses={"boilPose":20,"restPose":8,"dtPose":4} anims={"supported":true,"total":3,"running":0,"paused":0,"finished":3,"idle":0}

**m3-bat-base-r1**

| scenario | fps | frames | wall ms | p50 | p95 | >33 | >50 | worst | jank ms | note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| idle3s | 59.92 | 180 | 3004 | 17 | 25 | 1 | 0 | 41 | 0 | ~59Hz; anims running 0 |
| deal | 60.19 | 106 | 1761 | 17 | 21 | 0 | 0 | 24 | 0 |  |
| solveCelebration | 58.9 | 236 | 4007 | 17 | 24 | 2 | 1 | 68 | 68 |  |
| galleryGlide | 50.83 | 125 | 2459 | 17 | 26 | 4 | 3 | 258 | 384 |  |
| themeToggle | 53.43 | 134 | 2508 | 17 | 27 | 3 | 2 | 132 | 247 |  |

worst-3 frames per scenario (ms @ offset ms):
- idle3s: 41@628, 31@1485, 30@984
- deal: 24@1218, 23@1717, 22@716
- solveCelebration: 68@92, 34@126, 29@1336
- galleryGlide: 258@917, 74@306, 52@1412
- themeToggle: 132@168, 115@941, 34@826

engine: Mozilla/5.0 (iPhone; CPU iPhone OS 19_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/19.0 Mobile/15E148 Safari/604.1
vendor=Apple Computer, Inc. dpr=3 viewport=393x699 screen=393x852 hc=8 touch=5 coarse=true prm=false dark=false themePinned=dark htmlDark=true ablated=false
census: nodes=1064 filtered=17 (html 0) willChange=39 transitionAll+dur=1 poses={"boilPose":8,"restPose":8,"dtPose":4} anims={"supported":true,"total":4,"running":0,"paused":0,"finished":4,"idle":0}

**m3-bat-base-r2**

| scenario | fps | frames | wall ms | p50 | p95 | >33 | >50 | worst | jank ms | note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| idle3s | 58.84 | 177 | 3008 | 17 | 29 | 4 | 0 | 39 | 0 | ~59Hz; anims running 0 |
| deal | 60.23 | 106 | 1760 | 17 | 21 | 0 | 0 | 24 | 0 |  |
| solveCelebration | 58.59 | 235 | 4011 | 17 | 28 | 3 | 1 | 58 | 58 |  |
| galleryGlide | 50.49 | 124 | 2456 | 17 | 24 | 5 | 3 | 253 | 386 |  |
| themeToggle | 53.45 | 134 | 2507 | 17 | 28 | 3 | 2 | 125 | 248 |  |

worst-3 frames per scenario (ms @ offset ms):
- idle3s: 39@1864, 35@860, 35@2360
- deal: 24@1701, 23@950, 23@1083
- solveCelebration: 58@77, 38@1082, 36@113
- galleryGlide: 253@909, 79@313, 54@1414
- themeToggle: 125@951, 123@158, 36@826

engine: Mozilla/5.0 (iPhone; CPU iPhone OS 19_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/19.0 Mobile/15E148 Safari/604.1
vendor=Apple Computer, Inc. dpr=3 viewport=393x699 screen=393x852 hc=8 touch=5 coarse=true prm=false dark=false themePinned=dark htmlDark=true ablated=false
census: nodes=1064 filtered=17 (html 0) willChange=39 transitionAll+dur=1 poses={"boilPose":8,"restPose":8,"dtPose":4} anims={"supported":true,"total":4,"running":0,"paused":0,"finished":4,"idle":0}

**m3-bat-base-r3**

| scenario | fps | frames | wall ms | p50 | p95 | >33 | >50 | worst | jank ms | note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| idle3s | 58.06 | 175 | 3014 | 17 | 29 | 5 | 0 | 40 | 0 | ~59Hz; anims running 0 |
| deal | 60.19 | 106 | 1761 | 17 | 21 | 0 | 0 | 23 | 0 |  |
| solveCelebration | 57.36 | 230 | 4010 | 17 | 29 | 7 | 0 | 41 | 0 |  |
| galleryGlide | 50.47 | 124 | 2457 | 17 | 28 | 5 | 3 | 261 | 390 |  |
| themeToggle | 52.61 | 132 | 2509 | 17 | 27 | 3 | 2 | 137 | 261 |  |

worst-3 frames per scenario (ms @ offset ms):
- idle3s: 40@1854, 36@850, 35@1983
- deal: 23@700, 23@950, 23@1200
- solveCelebration: 41@3567, 39@59, 36@3696
- galleryGlide: 261@918, 72@304, 57@1418
- themeToggle: 137@175, 124@950, 35@1744

engine: Mozilla/5.0 (iPhone; CPU iPhone OS 19_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/19.0 Mobile/15E148 Safari/604.1
vendor=Apple Computer, Inc. dpr=3 viewport=393x699 screen=393x852 hc=8 touch=5 coarse=true prm=false dark=false themePinned=dark htmlDark=true ablated=false
census: nodes=1064 filtered=17 (html 0) willChange=39 transitionAll+dur=1 poses={"boilPose":8,"restPose":8,"dtPose":4} anims={"supported":true,"total":4,"running":0,"paused":0,"finished":4,"idle":0}

