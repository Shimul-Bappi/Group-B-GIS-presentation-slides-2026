# Speaker Script — GIS & Remote Sensing (Group B)

**Total time: about 18–19 minutes** (24 slides).
Short sentences. Easy words. Speak slowly. Look at the audience, not the screen.

> In the presentation, press **P** (or the **Script** button at the top right) to show these
> lines on screen while you present. Press **← →** to change slides, **G** for all slides,
> **F** for fullscreen.

---

## Slide 1 — Title: "See the planet. Map the change." *(0:30)*

Hello everyone. We are Group B.
Our topic is GIS and Remote Sensing.
We will show you two things.
First — how we see the Earth from space.
Second — how we turn that picture into a real map.
So we start in space, and we finish on your computer.

## Slide 2 — Roadmap *(0:20)*

This is our route. Twenty-one stops.
We start with the basics of remote sensing.
Then satellites, the satellite image, and its limits.
Then downloading data, and processing it.
And finally, we work in QGIS and make a map.
You can tap any card to jump. But we will go step by step.

## Slide 3 — What is Remote Sensing? *(1:00)*

Remote sensing means we learn about the Earth **without touching it**.
We measure energy. It comes from the sun, hits the ground, and comes back up.
The sensor on the satellite records it. That record becomes our image.

- **Passive** — we use sunlight.
- **Active** — we send our own signal, like radar.

Think of your eyes: you see a ball because light comes back to you. Remote sensing is the same — but from space.

## Slide 4 — The Electromagnetic Spectrum *(0:50)*

Light travels in waves. The size of the wave is the **wavelength**.
A short wave has more energy. A long wave has less.

- **Visible light** — what our eyes see.
- **Near-infrared** — great for looking at plants.
- **Thermal infrared** — measures heat.
- **Microwave** — used by radar, goes through clouds.

Every sensor is built to catch one or more of these wave sizes.

## Slide 5 — Components of Remote Sensing *(1:15)*

A satellite alone is not enough. We need a full system. Seven parts, remembered by letters:

- **A** — the energy source (the sun)
- **B** — the atmosphere (the air can change the energy)
- **C** — the target (the ground: water, soil, trees, houses)
- **D** — the sensor (it records the energy)
- **E** — the ground station (receives and fixes the data)
- **F** — interpretation (we study the image)
- **G** — application (we solve a real problem)

Simple order: **energy → air → ground → sensor → computer → meaning.**

## Slide 6 — Sensors & Scanning *(0:50)*

How does a sensor build a picture?

- **Framing** — takes the whole scene at once, like a normal camera.
- **Whiskbroom** — a mirror sweeps left and right, line by line.
- **Pushbroom** — a row of detectors catches a full line at once. No moving parts.

There are also different sensor types: optical, thermal, radar, and laser sensors called **LiDAR**.

## Slide 7 — Data Acquisition Methods *(0:40)*

Where do we put these sensors?

- **Ground** — for careful, close-up study.
- **Air** — drones and aircraft, for detailed local maps.
- **Space** — satellites, for wide, repeated coverage.

Higher up usually means a bigger area, but less fine detail.

## Slide 8 — Satellites & Orbits *(0:45)*

A satellite is a machine that goes around the Earth. It carries a sensor — a camera or a radar.
It has solar panels for power, and an antenna to send data down.

Most Earth-observation satellites are low. They orbit in about 100 minutes, and pass at the same local time every day — so the light is always similar.
Weather satellites are much higher, and watch one place all the time.

## Slide 9 — Earth-Observation Missions *(1:00)*

- **Landsat 8/9** — NASA/USGS. 30 m pixels. Free.
- **Sentinel-2** — Europe. 10 m pixels. Great for plants and water. Free.
- **Sentinel-1** — radar. Works at night, sees through clouds.
- **MODIS** — daily picture, big pixels.
- **WorldView / Planet** — commercial, very sharp, but you pay.

For our work, **Sentinel-2 is the best start.**

## Slide 10 — The Satellite Image *(1:00)*

A satellite image is **not a normal photo**. It is a grid of pixels.
Each pixel stores a number — a **Digital Number** — for each band: blue, green, red, near-infrared.

Water is dark in near-infrared. Plants are bright. So the image is **data**. We can measure it.

## Slide 11 — Spectral Signatures *(0:45)*

Every surface reflects light in its own way.

- Healthy plants reflect a lot of near-infrared.
- Water reflects almost none.
- Soil sits in the middle. Buildings are flat and bright.

This pattern is a **fingerprint** — a spectral signature. We can say what's on the ground without going there.

## Slide 12 — Image Resolution *(1:10)*

"High resolution" has **four meanings**:

1. **Spatial** — pixel size (10 m, 30 m…)
2. **Spectral** — number of bands (Sentinel-2 has 13)
3. **Radiometric** — brightness levels (12-bit = 4,096 levels)
4. **Temporal** — how often it revisits (Sentinel-2: every 5 days)

Always ask: **which one?**

## Slide 13 — Limitations & Constraints *(0:50)*

Remote sensing is powerful, but it has limits.

- Clouds can block the whole view.
- No sensor is best at everything — there's always a trade-off.
- MODIS visits daily but has big pixels; sharp commercial images come rarely and cost money.
- We also need storage, computing power, and skilled people to read images well.

## Slide 14 — Download Satellite Images *(1:00)*

1. Go to **EarthExplorer** (USGS). Make a free account.
2. Search your area, choose **Landsat**, choose the product.
3. Set clouds to less than **10%**.
4. Preview, then download.

For Sentinel-2, use the **Copernicus Browser**. Download the real band files, not just a small picture.

## Slide 15 — Data Preprocessing *(0:50)*

Before we use an image, we clean it.

- **Radiometric correction** — fixes stripes & uneven brightness.
- **Atmospheric correction** — removes haze from the air.
- **Geometric correction** — lines up the image with its real map position.

After these three steps, the image is ready to trust.

## Slide 16 — Image Enhancement *(0:50)*

- **Contrast stretch** — spreads dull values from black to white.
- **Filtering** — smooths noise, or sharpens edges.
- **Pan-sharpening** — mixes a sharp grey band with a soft colour image for a sharp colour result.

Enhancement only changes how it looks — never the real data.

## Slide 17 — QGIS › Raster Data *(1:00)*

We add the downloaded bands one by one, then **stack** them:

**Raster → Miscellaneous → Build Virtual Raster** — tick *place each input file into a separate band*.

Then **clip** the image to our study area. Now we have one clean raster, ready for colour.

## Slide 18 — QGIS › Symbology *(1:00)*

Right-click the layer → **Properties → Symbology** → **Multiband colour**.
**Red = band 4. Green = band 3. Blue = band 2.** Now it looks like a real photo.

Other styles: grey for one band, a colour ramp for NDVI, colours for a land-cover map.
**Important:** symbology changes the look — never the data.

## Slide 19 — Band Combinations *(0:45)*

- **Natural colour** — 4, 3, 2 (like our eyes)
- **Colour infrared** — 5, 4, 3 (plants glow red)
- **Agriculture** — 6, 5, 2 (good for crops)
- **NDVI** — −1 to +1 (green = healthy plants)

Same place, same day — different story.

## Slide 20 — Image Classification *(0:55)*

We sort every pixel into a class.

- **Supervised** — we pick training samples ourselves; the computer learns from them, then classifies the whole image.
- **Unsupervised** — the computer groups similar pixels on its own; we label each group afterwards.

Tools: Random Forest (supervised), K-means (unsupervised).

## Slide 21 — Field Data Collection *(0:40)*

A classified map is only a guess until we check it in the real world.
We visit real places — **ground truth**. Record location with GPS, take a photo, write a note.

We can place sample points randomly, systematically, or stratified (some inside every class).
These become training samples — and later, test samples.

## Slide 22 — Accuracy Assessment *(0:50)*

We compare the map to ground-truth points in an **error matrix**. The diagonal shows what we got right.

- **Overall accuracy** — correct points out of all points.
- **Kappa** — how much better than guessing.

A good map usually needs **80%+ accuracy**.

## Slide 23 — Mapping the Satellite Image *(1:00)*

**Project → New Print Layout.** Add the map, a title, a legend, a scale bar and a north arrow.
Add the source and date — people must know where the image came from. Export to PDF or PNG.

A good map is not only beautiful — it is **clear and honest**.

## Slide 24 — Summary & Questions *(0:20)*

So — we **sense**. We **download**. We **process**. We **map**.
That is the whole workflow. From orbit to insight.

Thank you for listening. **Any questions?**

---

## Quick tips for the presenter

| If you… | Then… |
| --- | --- |
| Are nervous | Slow down. Pause after each slide title. |
| Run out of time | Skip slides 9, 11, 16 and 19. Keep the rest. |
| Get a hard question | Say: *"Good question — we can check it after."* Then continue. |
| Want to show something live | Press **G**, pick the slide, then press **P** again. |

## Short answers for likely questions

- **"Is this a real satellite image?"** No — it is an illustration. Real Landsat and Sentinel-2 data look similar.
- **"Which satellite is best?"** Sentinel-2 for most work: free, 10 m, 13 bands, every 5 days.
- **"What is NDVI?"** A number for plant health: (NIR − Red) / (NIR + Red). Near +1 = very green.
- **"Supervised or unsupervised — which is better?"** Supervised is more accurate if you have good samples. Unsupervised is faster when you don't.
- **"What is ground truth for?"** Two jobs: teaching the classifier (training) and checking the final map (accuracy assessment).
- **"Why do we need accuracy assessment?"** A map is only useful if we know how much to trust it.
- **"Is QGIS free?"** Yes. Free and open source, for Windows, Mac and Linux.
