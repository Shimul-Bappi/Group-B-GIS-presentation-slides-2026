# Speaker Script — GIS & Remote Sensing (Group B)

**Total time: about 12–13 minutes.**
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

This is our route. Twelve stops.
We start with remote sensing.
Then satellites, then the satellite image.
Then resolution, then downloading data.
And finally, we work in QGIS.
You can tap any card to jump. But we will go step by step.

## Slide 3 — What is Remote Sensing? *(1:00)*

Remote sensing means we learn about the Earth **without touching it**.
We measure energy.
The energy comes from the sun. It hits the ground. Then it comes back up.
The sensor on the satellite records it. That record becomes our image.

There are two types.
**Passive** — we use sunlight.
**Active** — we send our own signal, like radar.

Think of your eyes. You see a ball because light comes back to you.
Remote sensing is the same idea — but from space.

## Slide 4 — Components of Remote Sensing *(1:15)*

A satellite alone is not enough. We need a full system.
There are seven parts. Remember them with letters.

- **A** — the energy source. The sun.
- **B** — the atmosphere. The air can change the energy.
- **C** — the target. The ground: water, soil, trees, houses.
- **D** — the sensor. It records the energy.
- **E** — the ground station. They receive the data and fix it.
- **F** — interpretation. We study the image.
- **G** — application. We use the answer to solve a real problem.

Simple order: **energy → air → ground → sensor → computer → meaning.**

## Slide 5 — Satellites & Orbits *(0:45)*

A satellite is a machine that goes around the Earth.
It carries a sensor. The sensor is the camera or the radar.
It has solar panels for power, and an antenna to send data down.

Most Earth-observation satellites are low.
They go around the Earth in about one hundred minutes.
They pass at the same time every day. So the light is always the same.
Weather satellites are much higher. They watch one place all the time.

## Slide 6 — Earth-Observation Missions *(1:00)*

Here are some famous satellites.

- **Landsat 8 and 9** — from NASA and the USGS. Thirty metre pixels. Free.
- **Sentinel-2** — from Europe. Ten metre pixels. Very good for plants and water. Also free.
- **Sentinel-1** — radar. It works at night and it sees through clouds.
- **MODIS** — a picture every day, but the pixels are big.
- **WorldView and Planet** — commercial. Very sharp pixels, but you pay.

For our work, **Sentinel-2 is the best start.** Free and clear.

## Slide 7 — The Satellite Image *(1:00)*

Now the picture. A satellite image is **not a normal photo**.
It is a grid. Every square is a pixel. Every pixel covers a piece of ground.
Inside each pixel there is a number. We call it a **Digital Number**.

The image has **bands**. Blue, green, red, and near-infrared.

Look here — I move the magnifier and you see the real numbers.
Water is dark in near-infrared. Plants are bright.
So the image is **data**. We can measure it.

## Slide 8 — Spectral Signatures *(0:45)*

Every surface reflects light in its own way.

- Healthy plants reflect a lot of near-infrared.
- Water reflects almost none.
- Soil is in the middle. Buildings are flat and bright.

This pattern is like a **fingerprint**. We call it a **spectral signature**.
Because of this, we can say what is on the ground — without going there.

## Slide 9 — Image Resolution *(1:10)*

Now, resolution. Many people think it only means "sharp".
No — it has **four meanings**.

1. **Spatial** — how big is one pixel? Ten metres or thirty metres.
2. **Spectral** — how many colours does the sensor see? Sentinel-2 has thirteen bands.
3. **Radiometric** — how many brightness levels? Landsat stores 12-bit. That is 4,096 levels.
4. **Temporal** — how often does the satellite come back? Sentinel-2 comes every 5 days.

So when someone says "high resolution", always ask: **which one?**

## Slide 10 — Download Satellite Images *(1:00)*

How do we get the image? **For free.**

1. Go to **EarthExplorer**, from the USGS. Make a free account.
2. Search your area. Choose **Landsat**. Choose the product.
3. Set the clouds to less than **10 percent**.
4. Check the results. Preview the scene. Then download.

For Sentinel-2, use the **Copernicus Browser**. Same idea.

One tip: download the **real band files**. Not just a small picture.

## Slide 11 — QGIS › Raster Data *(1:00)*

Now we open QGIS.
The downloaded bands are separate files. We add them one by one.
Then we **stack** them:

**Raster → Miscellaneous → Build Virtual Raster**

We tick — *place each input file into a separate band*.
Then we **clip** the image to our study area.
Now we have one clean raster. Ready for colour.

## Slide 12 — QGIS › Symbology *(1:00)*

Next — **symbology**. This is the fun part.

1. Right-click the layer. **Properties → Symbology**.
2. Choose **Multiband colour**.
3. **Red = band 4. Green = band 3. Blue = band 2.**

Now it looks like a real photo.
We can also change the contrast to make it clearer.

Other styles: grey for one band, a colour ramp for NDVI, and colours for a land-cover map.

**Important:** symbology changes the look. It never changes the data.

## Slide 13 — Band Combinations *(0:45)*

If we change the bands, the story changes.

- **Natural colour** — 4, 3, 2. Like our eyes.
- **Colour infrared** — 5, 4, 3. Plants glow red.
- **Agriculture** — 6, 5, 2. Good for crops.
- **NDVI** — a number from −1 to +1. Green means healthy plants.

Same place. Same day. Different story.

## Slide 14 — Mapping the Satellite Image *(1:00)*

Finally, we make the map.

1. In QGIS: **Project → New Print Layout**.
2. Add the map. Add a title. Add a legend.
3. Add a **scale bar** and a **north arrow**.
4. Add the **source** and the **date**. People must know where the image came from.
5. Export to PDF or PNG.

A good map is not only beautiful. It is **clear and honest**.

## Slide 15 — Summary & Questions *(0:20)*

So — we **sense**. We **download**. We **style**. We **map**.
That is the whole workflow. From orbit to insight.

Thank you for listening.
**Any questions?**

---

## Quick tips for the presenter

| If you… | Then… |
| --- | --- |
| Are nervous | Slow down. Pause after each slide title. |
| Run out of time | Skip slides 6, 8 and 13. Keep 3, 4, 9, 10, 11, 12, 14. |
| Get a hard question | Say: *"Good question — we can check it after."* Then continue. |
| Want to show something live | Press **G**, pick the slide, then press **P** again. |

## Short answers for likely questions

- **"Is this a real satellite image?"** No — it is an illustration. Real Landsat and Sentinel-2 data look similar.
- **"Which satellite is best?"** Sentinel-2 for most work: free, 10 m, 13 bands, every 5 days.
- **"What is NDVI?"** A number for plant health: (NIR − Red) / (NIR + Red). Near +1 = very green.
- **"Is QGIS free?"** Yes. It is free and open source, for Windows, Mac and Linux.
- **"Why stack bands?"** One file with three bands is needed for a colour composite.
