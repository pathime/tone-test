const scale = [0, 0, 2, 2, 4, 5, 7, 7, 9, 9, 11, 11]

export default function scaleNote(note) {
  let rootNote = Math.floor(note / 12) * 12
  let index = note % 12
  
  return rootNote + scale[index]
}
