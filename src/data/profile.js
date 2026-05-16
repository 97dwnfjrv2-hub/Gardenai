export const growProfile = {
  room: {
    dimensionsM: { length: 3, width: 1.8, height: 3 },
    activeCanopyM: { length: 3, width: 1.1 },
    futureRoomM: { length: 3, width: 3 },
    lungRoom: true,
  },
  cultivation: {
    medium: 'Coco / perlite',
    fertigation: 'High-frequency drain-to-waste',
    training: 'SCROG',
    floweringStyle: 'Aggressive but controlled',
    defoliation: 'Heavy',
  },
  lighting: {
    topLights: [
      { name: 'Pro Grow 780W Model Z', watts: 780 },
      { name: 'Pro Grow 780W Model Z', watts: 780 },
    ],
    underCanopyLights: [
      { name: 'Hi-Par Understorm', watts: 200 },
      { name: 'Hi-Par Understorm', watts: 200 },
      { name: 'Hi-Par Understorm', watts: 200 },
    ],
  },
  potSetups: [
    { id: '8x15', label: '8 × 15 L pots', pots: 8, potVolumeL: 15 },
    { id: '4x30', label: '4 × 30 L pots', pots: 4, potVolumeL: 30 },
  ],
  nutrients: ['Mills A+B', 'Start-R', 'C4', 'PK', 'Vitalize', 'Drip Clean', 'Recharge', 'Professor’s Go Green'],
  monitoring: ['COM-80 EC', 'Photone PPFD', 'IBebot root zone', 'Inkbird', 'Runoff EC/pH', 'Leaf temperature'],
}

export const evidenceLibrary = [
  {
    source: 'AROYA crop steering',
    type: 'commercial methodology',
    use: 'Vegetative vs generative cue framing, irrigation timing, dryback interpretation',
  },
  {
    source: 'Athena crop steering principles',
    type: 'commercial methodology',
    use: 'Operational crop steering vocabulary and workflow alignment',
  },
  {
    source: 'Bruce Bugbee / controlled environment agriculture',
    type: 'CEA research',
    use: 'Light, photosynthesis, and environment framing',
  },
  {
    source: 'Peer-reviewed soilless substrate literature',
    type: 'peer reviewed',
    use: 'Substrate hydraulics, fertigation, and nutrient-risk interpretation',
  },
]
