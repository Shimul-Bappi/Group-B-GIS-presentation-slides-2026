/**
 * Speaker script — deliberately short sentences and easy words.
 * One entry per slide (same order as the deck).
 */
export interface SlideScript {
  /** Suggested speaking time, e.g. "0:45". */
  time: string;
  /** What to say, one short line at a time. */
  lines: string[];
  /** A small cue for the presenter. */
  cue?: string;
}

export const SCRIPT: SlideScript[] = [
  {
    time: "0:30",
    cue: "Smile. Look at the audience, not the screen.",
    lines: [
      "Hello everyone. We are Group B.",
      "Our topic is GIS and Remote Sensing.",
      "We will show you two things.",
      "First — how we see the Earth from space.",
      "Second — how we turn that picture into a real map.",
      "So we start in space, and we finish on your computer.",
    ],
  },
  {
    time: "0:20",
    cue: "Point at the route line, then move on.",
    lines: [
      "This is our route. Twelve stops.",
      "We start with remote sensing.",
      "Then satellites, then the satellite image.",
      "Then resolution, then downloading data.",
      "And finally, we work in QGIS.",
      "You can tap any card to jump. But we will go step by step.",
    ],
  },
  {
    time: "1:00",
    cue: "Click Passive, then Active. Let the arrows move.",
    lines: [
      "Remote sensing means we learn about the Earth without touching it.",
      "We measure energy.",
      "The energy comes from the sun. It hits the ground. Then it comes back up.",
      "The sensor on the satellite records it. That record becomes our image.",
      "There are two types.",
      "Passive — we use sunlight.",
      "Active — we send our own signal, like radar.",
      "Think of your eyes. You see a ball because light comes back to you.",
      "Remote sensing is the same idea — but from space.",
    ],
  },
  {
    time: "1:15",
    cue: "Let the diagram play once. Then read the letters fast.",
    lines: [
      "A satellite alone is not enough. We need a full system.",
      "There are seven parts. Remember them with letters.",
      "A — the energy source. The sun.",
      "B — the atmosphere. The air can change the energy.",
      "C — the target. The ground: water, soil, trees, houses.",
      "D — the sensor. It records the energy.",
      "E — the ground station. They receive the data and fix it.",
      "F — interpretation. We study the image.",
      "G — application. We use the answer to solve a real problem.",
      "Simple order: energy, air, ground, sensor, computer, meaning.",
    ],
  },
  {
    time: "0:45",
    cue: "Point at the satellite parts while you speak.",
    lines: [
      "A satellite is a machine that goes around the Earth.",
      "It carries a sensor. The sensor is the camera or the radar.",
      "It has solar panels for power, and an antenna to send data down.",
      "Most Earth-observation satellites are low.",
      "They go around the Earth in about one hundred minutes.",
      "They pass at the same time every day. So the light is always the same.",
      "Weather satellites are much higher. They watch one place all the time.",
    ],
  },
  {
    time: "1:00",
    cue: "Point at the green numbers under each card.",
    lines: [
      "Here are some famous satellites.",
      "Landsat eight and nine — from NASA and the USGS. Thirty metre pixels. Free.",
      "Sentinel-two — from Europe. Ten metre pixels. Very good for plants and water. Also free.",
      "Sentinel-one is radar. It works at night and it sees through clouds.",
      "MODIS takes a picture every day, but the pixels are big.",
      "WorldView and Planet are commercial. Very sharp pixels, but you pay.",
      "For our work, Sentinel-two is the best start. Free and clear.",
    ],
  },
  {
    time: "1:00",
    cue: "Move the magnifier and read one number out loud.",
    lines: [
      "Now the picture. A satellite image is not a normal photo.",
      "It is a grid. Every square is a pixel. Every pixel covers a piece of ground.",
      "Inside each pixel there is a number. We call it a Digital Number.",
      "The image has bands. Blue, green, red, and near-infrared.",
      "Look here — I move the magnifier and you see the real numbers.",
      "Water is dark in near-infrared. Plants are bright.",
      "So the image is data. We can measure it.",
    ],
  },
  {
    time: "0:45",
    cue: "Hover the chart slowly from left to right.",
    lines: [
      "Every surface reflects light in its own way.",
      "Healthy plants reflect a lot of near-infrared.",
      "Water reflects almost none.",
      "Soil is in the middle. Buildings are flat and bright.",
      "This pattern is like a fingerprint. We call it a spectral signature.",
      "Because of this, we can say what is on the ground — without going there.",
    ],
  },
  {
    time: "1:10",
    cue: "Ask the audience: which one? Then answer.",
    lines: [
      "Now, resolution. Many people think it only means sharp. No — it has four meanings.",
      "One — spatial. How big is one pixel? Ten metres or thirty metres.",
      "Two — spectral. How many colours does the sensor see? Sentinel-two has thirteen bands.",
      "Three — radiometric. How many brightness levels? Landsat stores twelve bit. That is four thousand levels.",
      "Four — temporal. How often does the satellite come back? Sentinel-two comes every five days.",
      "So when someone says high resolution, always ask: which one?",
    ],
  },
  {
    time: "1:00",
    cue: "Let the walkthrough play. Explain each click in one line.",
    lines: [
      "How do we get the image? For free.",
      "Go to EarthExplorer, from the USGS. Make a free account.",
      "Search your area. Choose Landsat. Choose the product.",
      "Set the clouds to less than ten percent.",
      "Check the results. Preview the scene. Then download.",
      "For Sentinel-two, use the Copernicus Browser. Same idea.",
      "One tip: download the real band files. Not just a small picture.",
    ],
  },
  {
    time: "1:00",
    cue: "Say the menu path out loud, slowly.",
    lines: [
      "Now we open QGIS.",
      "The downloaded bands are separate files. We add them one by one.",
      "Then we stack them.",
      "Raster. Miscellaneous. Build Virtual Raster.",
      "We tick — place each input file into a separate band.",
      "Then we clip the image to our study area.",
      "Now we have one clean raster. Ready for colour.",
    ],
  },
  {
    time: "1:00",
    cue: "Click each style. Pause on the NDVI one.",
    lines: [
      "Next — symbology. This is the fun part.",
      "Right-click the layer. Properties. Symbology.",
      "Choose Multiband colour.",
      "Red is band four. Green is band three. Blue is band two.",
      "Now it looks like a real photo.",
      "We can also change the contrast to make it clearer.",
      "And there are other styles: grey for one band, a colour ramp for NDVI, and colours for a land-cover map.",
      "Important: symbology changes the look. It never changes the data.",
    ],
  },
  {
    time: "0:45",
    cue: "Drag the slider back and forth once.",
    lines: [
      "If we change the bands, the story changes.",
      "Natural colour — four, three, two. Like our eyes.",
      "Colour infrared — five, four, three. Plants glow red.",
      "Agriculture — six, five, two. Good for crops.",
      "NDVI — a number from minus one to plus one. Green means healthy plants.",
      "Same place. Same day. Different story.",
    ],
  },
  {
    time: "1:00",
    cue: "Point at the legend, scale bar and north arrow.",
    lines: [
      "Finally, we make the map.",
      "In QGIS: Project. New Print Layout.",
      "Add the map. Add a title. Add a legend.",
      "Add a scale bar and a north arrow.",
      "Add the source and the date. People must know where the image came from.",
      "Then export to PDF or PNG.",
      "A good map is not only beautiful. It is clear and honest.",
    ],
  },
  {
    time: "0:20",
    cue: "Say thank you. Then stop talking and take questions.",
    lines: [
      "So — we sense. We download. We style. We map.",
      "That is the whole workflow. From orbit to insight.",
      "Thank you for listening.",
      "Any questions?",
    ],
  },
];

export const TOTAL_TIME = "about 12–13 minutes";
